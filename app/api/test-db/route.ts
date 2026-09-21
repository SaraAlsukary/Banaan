import { db } from '@/db';
import { users } from '@/db/schema';

export async function GET() {
  try {
    const testUser = await db.insert(users).values({
      clerkId: `test_clerk_${Date.now()}`,
      name: 'مستخدم تجريبي',
      email: `test_${Date.now()}@example.com`,
      imageUrl: '',
    }).returning();

    return Response.json({ success: true, data: testUser });
  } catch (error: any) {
    console.error('❌ خطأ اختبار Neon:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}