import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// تحديد المسارات العامة التي لا تتطلب تسجيل دخول
const isPublicRoute = createRouteMatcher([
  '/',
  '/api/webhooks(.*)', // 👈 فتح كافة مسارات الـ Webhook لـ Clerk
  '/categories(.*)',
  '/products(.*)',
  '/about',
  '/contact',
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};