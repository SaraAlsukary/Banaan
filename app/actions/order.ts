"use server";

import { db } from "@/db";
import { orders, orderItems, users, products } from "@/db/schema";
import { currentUser } from "@clerk/nextjs/server";
import { eq, inArray, or } from "drizzle-orm";
import { revalidatePath } from "next/cache";
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

        // 1. جلب المستخدم وتأكيد وجوده
        try {
            const clerkUser = await currentUser();
            if (clerkUser) {
                const userEmail = clerkUser.emailAddresses?.[0]?.emailAddress;

                const whereConditions = [];
                if (clerkUser.id) whereConditions.push(eq(users.clerkId, clerkUser.id));
                if (userEmail) whereConditions.push(eq(users.email, userEmail));

                if (whereConditions.length > 0) {
                    const existingUsers = await db
                        .select({ id: users.id })
                        .from(users)
                        .where(or(...whereConditions))
                        .limit(1);

                    if (existingUsers.length > 0) {
                        dbUserId = existingUsers[0].id;
                    }
                }
            }
        } catch (clerkError) {
            console.warn("تعذر التحقق من مستخدم Clerk، سيتم حفظ الطلب بدون user_id:", clerkError);
        }

        const sanitizedTotalAmount = Number(orderData.totalAmount);
        if (isNaN(sanitizedTotalAmount)) {
            throw new Error("إجمالي المبلغ غير صالح");
        }

        // 2. إدخال الطلب (مع استخدام null بشكل صريح في حال عدم وجود dbUserId)
        const [insertedOrder] = await db
            .insert(orders)
            .values({
                userId: dbUserId ?? null,
                customerName: orderData.customerName,
                customerEmail: orderData.customerEmail,
                phone: orderData.phone,
                address: orderData.address,
                notes: orderData.notes || null,
                totalAmount: sanitizedTotalAmount.toFixed(2),
                status: "pending",
            })
            .returning({ id: orders.id });

        if (!insertedOrder) {
            throw new Error("فشل إنشاء الطلب في قاعدة البيانات");
        }

        const orderId = insertedOrder.id;

        // 3. حفظ عناصر الطلب
        // 3. حفظ عناصر الطلب (مع التحقق من وجود المنتجات)
        if (orderData.items && orderData.items.length > 0) {
            // جلب كل المعرفات المطلوبة للمنتجات
            const productIds = orderData.items
                .map((item) => Number(item.id))
                .filter((id) => !isNaN(id) && id > 0);

            // استعلام للتأكد من المعرفات الموجودة فعلياً في قاعدة البيانات
            const existingProducts = productIds.length > 0
                ? await db
                    .select({ id: products.id })
                    .from(products)
                    .where(inArray(products.id, productIds))
                : [];

            const existingProductIdsSet = new Set(existingProducts.map((p) => p.id));

            const itemsToInsert = orderData.items.map((item) => {
                const itemPrice = Number(item.price);
                const rawProductId = Number(item.id);

                if (isNaN(itemPrice)) {
                    throw new Error(`سعر المنتج غير صالح: ${item.name}`);
                }

                // إذا كان المنتج غير موجود في جدول المنتجات، نضع null لحماية الاستعلام
                const validProductId = existingProductIdsSet.has(rawProductId)
                    ? rawProductId
                    : null;

                return {
                    orderId: orderId,
                    productId: validProductId, // لن يسبب Foreign Key Constraint Error
                    quantity: Number(item.quantity) || 1,
                    price: itemPrice.toFixed(2),
                };
            });

            await db.insert(orderItems).values(itemsToInsert);
        }

        // 4. إرسال البريد الإلكتروني
        if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASS) {
            try {
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
              <h2 style="color: #556B2F; border-bottom: 2px solid #C5A059; padding-bottom: 10px; margin-top: 0;">🛍️ طلب جديد رقم #${orderId}</h2>
              <h3 style="color: #8B151A; margin-bottom: 5px;">بيانات العميل:</h3>
              <ul style="list-style: none; padding: 0; line-height: 1.8;">
                <li><strong>الاسم:</strong> ${orderData.customerName}</li>
                <li><strong>البريد:</strong> ${orderData.customerEmail}</li>
                <li><strong>الهاتف:</strong> ${orderData.phone}</li>
                <li><strong>العنوان:</strong> ${orderData.address}</li>
                ${orderData.notes ? `<li><strong>ملاحظات:</strong> ${orderData.notes}</li>` : ""}
              </ul>
              ${itemsHtmlTable}
            </div>
          </div>
        `;

                const customerEmailHtml = `
          <div dir="rtl" style="font-family: Arial, sans-serif; background-color: #f9f8f6; padding: 20px; color: #333;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 25px; border: 1px solid #e0dbd1;">
              <h1 style="color: #556B2F; text-align: center;">متجر بَنان 🌸</h1>
              <p>أهلاً <strong>${orderData.customerName}</strong>،<br/>تم استلام طلبك رقم <strong>#${orderId}</strong> بنجاح.</p>
              ${itemsHtmlTable}
            </div>
          </div>
        `;

                await Promise.all([
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
                ]);
            } catch (emailError) {
                console.error("إرسال البريد فشل، لكن تم حفظ الطلب:", emailError);
            }
        }

        return { success: true, orderId };
    } catch (error: any) {
        console.error("=== SERVER ACTION ERROR ===");
        console.error("Error Detail:", error?.detail);
        console.error("Error Message:", error?.message);

        return {
            success: false,
            error: error?.detail || error?.message || "حدث خطأ أثناء إرسال الطلب.",
        };
    }
}

export async function updateOrderStatus(orderId: number, status: string) {
  try {
    await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, orderId));

    // إعادة تحديث مسارات الأدمن لضمان تحديث الإحصائيات وصفحة الطلبات فوراً
    revalidatePath("/admin/orders");
    revalidatePath("/admin");
    
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: "فشل تحديث حالة الطلب" };
  }
}