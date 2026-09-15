import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" }); // أو ".env" حسب ملف البيئة لديك

export default defineConfig({
  schema: "./db/schema.ts", // أو "./src/db/schema.ts" حسب مسار ملفك
  out: "./drizzle", // المجلد الذي سيتم حفظ ملفات الـ migrations فيه
  dialect: "postgresql", // نوع قاعدة البيانات
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});