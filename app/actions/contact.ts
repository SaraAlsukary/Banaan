"use server";

import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASS,
    },
});

export async function sendContactEmail(formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const subject = formData.get('subject') as string;
    const message = formData.get('message') as string;

    try {
        await transporter.sendMail({
            from: `"${name}" <${process.env.GMAIL_USER}>`, 
            to: process.env.GMAIL_USER,
            replyTo: email,
            subject: `رسالة جديدة من الموقع: ${subject}`,
            html: `
                <div dir="rtl" style="background-color: #F9F6F0; padding: 30px 15px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; border: 1px solid #E8DCCB; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">
                        
                        <!-- Header -->
                        <div style="background-color: #4A5D23; padding: 24px; text-align: center; color: #ffffff;">
                            <h2 style="margin: 0; font-size: 22px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">متجر بنان</h2>
                            <p style="margin: 6px 0 0 0; font-size: 13px; color: #E8DCCB; opacity: 0.95;">إشعار بوجود رسالة تواصل جديدة</p>
                        </div>

                        <!-- Body Content -->
                        <div style="padding: 28px 24px;">
                            
                            <!-- Key Info Table -->
                            <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                                <tr>
                                    <td style="padding: 10px 14px; background-color: #F9F6F0; border-radius: 10px; font-size: 13px; width: 32%; color: #A67B5B; font-weight: bold;">الاسم الكريم</td>
                                    <td style="padding: 10px 14px; font-size: 14px; color: #4A5D23; font-weight: 700;">${name}</td>
                                </tr>
                                <tr><td colspan="2" style="height: 8px;"></td></tr>
                                <tr>
                                    <td style="padding: 10px 14px; background-color: #F9F6F0; border-radius: 10px; font-size: 13px; color: #A67B5B; font-weight: bold;">البريد الإلكتروني</td>
                                    <td style="padding: 10px 14px; font-size: 14px; color: #4A5D23; font-weight: 600; direction: ltr; text-align: right;">${email}</td>
                                </tr>
                                <tr><td colspan="2" style="height: 8px;"></td></tr>
                                <tr>
                                    <td style="padding: 10px 14px; background-color: #F9F6F0; border-radius: 10px; font-size: 13px; color: #A67B5B; font-weight: bold;">رقم الهاتف</td>
                                    <td style="padding: 10px 14px; font-size: 14px; color: #4A5D23; font-weight: 600; direction: ltr; text-align: right;">${phone || 'غير محدد'}</td>
                                </tr>
                                <tr><td colspan="2" style="height: 8px;"></td></tr>
                                <tr>
                                    <td style="padding: 10px 14px; background-color: #F9F6F0; border-radius: 10px; font-size: 13px; color: #A67B5B; font-weight: bold;">الموضوع</td>
                                    <td style="padding: 10px 14px; font-size: 14px; color: #4A5D23; font-weight: 700;">${subject}</td>
                                </tr>
                            </table>

                            <!-- Message Section -->
                            <div style="margin-top: 20px;">
                                <p style="margin: 0 0 8px 0; font-size: 13px; font-weight: bold; color: #A67B5B;">محتوى الرسالة:</p>
                                <div style="background-color: #F9F6F0; border: 1px solid #E8DCCB; padding: 18px; border-radius: 12px; font-size: 14px; color: #4A5D23; white-space: pre-wrap; line-height: 1.7;">${message}</div>
                            </div>

                            <!-- Direct Reply Button -->
                            <div style="margin-top: 30px; text-align: center;">
                                <a href="mailto:${email}" style="display: inline-block; background-color: #788B54; color: #ffffff; text-decoration: none; padding: 12px 32px; border-radius: 50px; font-size: 14px; font-weight: 700; box-shadow: 0 2px 6px rgba(120,139,84,0.3);">
                                    الرد السريع على العميل
                                </a>
                            </div>

                        </div>

                        <!-- Footer -->
                        <div style="background-color: #F9F6F0; padding: 16px; text-align: center; border-top: 1px solid #E8DCCB; font-size: 12px; color: #A67B5B;">
                            تم إرسال هذه الرسالة تلقائياً عبر نموذج التواصل بـ <strong>متجر بنان</strong>
                        </div>

                    </div>
                </div>
            `
        });

        return { success: true };
    } catch (error) {
        console.error('Nodemailer Contact Error:', error);
        return { success: false, error: 'فشل في إرسال البريد الإلكتروني' };
    }
}