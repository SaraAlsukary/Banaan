"use server";

import { db } from "@/db";
import { orders, orderItems, users } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, or } from "drizzle-orm";
import nodemailer from "nodemailer";

export interface OrderInput {
    userId?: number;
    customerName: string;
    customerEmail: string;
    phone: string;
    address: string;
    notes?: string;
    totalAmount: number;
    items: {
        id: number;
        name: string;
        price: number;
        quantity: number;
    }[];
}

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
    },
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 5000,
});

export async function submitOrder(orderData: OrderInput) {
    try {
        let dbUserId: number | null = null;

        // 1. محاولة جلب المستخدم من Clerk وربطه بقاعدة البيانات
        try {
            const clerkUser = await currentUser();
            if (clerkUser) {
                const userEmail = clerkUser.emailAddresses?.[0]?.emailAddress;

                const dbUser = await db.query.users.findFirst({
                    where: userEmail
                        ? or(
                            eq(users.clerkId, clerkUser.id),
                            eq(users.email, userEmail)
                        )
                        : eq(users.clerkId, clerkUser.id),
                });

                if (dbUser) {
                    dbUserId = dbUser.id;
                }
            }
        } catch (clerkError) {
            console.error("Clerk user fetch failed:", clerkError);
        }

        // 2. حفظ الطلب في جدول orders
        const [insertedOrder] = await db
            .insert(orders)
            .values({
                userId: dbUserId,
                customerName: orderData.customerName,
                customerEmail: orderData.customerEmail,
                phone: orderData.phone,
                address: orderData.address,
                notes: orderData.notes || null,
                totalAmount: orderData.totalAmount.toString(),
                status: "pending",
            })
            .returning({ id: orders.id });

        const orderId = insertedOrder.id;

        // 3. حفظ عناصر الطلب في order_items
        if (orderData.items && orderData.items.length > 0) {
            const itemsToInsert = orderData.items.map((item) => ({
                orderId: orderId,
                productId: item.id,
                quantity: item.quantity,
                price: item.price.toString(),
            }));
            await db.insert(orderItems).values(itemsToInsert);
        }

        // 4. تجهيز قوالب الإيميل
        const itemsHtmlTable = `
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px; text-align: right;" dir="rtl">
                <thead>
                    <tr style="background-color: #556B2F; color: #ffffff;">
                        <th style="padding: 10px; border: 1px solid #ddd;">المنتج</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">الكمية</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">السعر الفردي</th>
                        <th style="padding: 10px; border: 1px solid #ddd;">الإجمالي</th>
                    </tr>
                </thead>
                <tbody>
                    ${orderData.items
                .map(
                    (item) => `
                        <tr>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${item.name}</td>
                            <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                            <td style="padding: 10px; border: 1px solid #ddd;">${Number(item.price).toLocaleString()}$</td>
                            <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${(Number(item.price) * item.quantity).toLocaleString()}$</td>
                        </tr>
                    `
                )
                .join("")}
                </tbody>
            </table>
        `;

        const adminEmailHtml = `
            <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #f9f8f6; padding: 20px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 25px; border: 2px solid #556B2F;">
                    <h2 style="color: #556B2F; border-bottom: 2px solid #C5A059; padding-bottom: 10px; margin-top: 0;">
                        🛍️ طلب جديد رقم #${orderId}
                    </h2>
                    <h3 style="color: #8B151A; margin-bottom: 5px;">بيانات العميل:</h3>
                    <ul style="list-style: none; padding: 0; line-height: 1.8;">
                        <li><strong>الاسم:</strong> ${orderData.customerName}</li>
                        <li><strong>البريد الإلكتروني:</strong> ${orderData.customerEmail}</li>
                        <li><strong>رقم الهاتف:</strong> ${orderData.phone}</li>
                        <li><strong>العنوان:</strong> ${orderData.address}</li>
                        ${orderData.notes ? `<li><strong>ملاحظات:</strong> ${orderData.notes}</li>` : ""}
                    </ul>
                    <h3 style="color: #556B2F; margin-top: 20px;">تفاصيل السلة:</h3>
                    ${itemsHtmlTable}
                    <div style="margin-top: 20px; padding: 15px; background-color: #f2efe9; border-radius: 8px; text-align: left;">
                        <span style="font-size: 18px; font-weight: bold; color: #556B2F;">المجموع الإجمالي: ${orderData.totalAmount.toLocaleString()} $</span>
                    </div>
                </div>
            </div>
        `;

        const customerEmailHtml = `
            <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #f9f8f6; padding: 20px; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 25px; border: 1px solid #e0dbd1;">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <h1 style="color: #556B2F; margin: 0; font-size: 28px;">متجر بَنان 🌸</h1>
                        <p style="color: #777; font-size: 14px;">اصنعي، استمتعي، وشاركي إبداعك</p>
                    </div>
                    <p style="font-size: 16px; line-height: 1.6;">
                        أهلاً <strong>${orderData.customerName}</strong>،<br />
                        شكراً لطلبك من متجر <strong>بَنان</strong>! تم استلام طلبك رقم <strong>#${orderId}</strong> بنجاح.
                    </p>
                    <h3 style="color: #556B2F; border-bottom: 1px solid #ddd; padding-bottom: 8px;">ملخص الطلب:</h3>
                    ${itemsHtmlTable}
                    <div style="margin-top: 20px; padding: 15px; background-color: #f8f6f0; border-radius: 8px; font-size: 16px; font-weight: bold; color: #556B2F;">
                        الإجمالي الكلي: ${orderData.totalAmount.toLocaleString()} $
                    </div>
                </div>
            </div>
        `;

        // 5. إرسال البريد بشكل غير متزامن (مستقل عن العودة بالنتيجة)
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
            Promise.all([
                transporter.sendMail({
                    from: `"متجر بنان" <${process.env.GMAIL_USER}>`,
                    to: process.env.GMAIL_USER,
                    subject: `🛍️ طلب جديد #${orderId} من: ${orderData.customerName}`,
                    html: adminEmailHtml,
                }),
                transporter.sendMail({
                    from: `"متجر بنان" <${process.env.GMAIL_USER}>`,
                    to: orderData.customerEmail,
                    subject: `تم استلام طلبك بنجاح #${orderId} | متجر بنان 🌸`,
                    html: customerEmailHtml,
                }),
            ]).catch((emailError) => {
                console.error("Email sending failed:", emailError);
            });
        }

        return { success: true, orderId };
    } catch (error) {
        // طباعة تفاصيل الخطأ في الـ Terminal للوقوف على السبب بدقة
        console.error("تفاصيل خطأ إنشاء الطلب:", error);
        return { success: false, error: "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً." };
    }
}