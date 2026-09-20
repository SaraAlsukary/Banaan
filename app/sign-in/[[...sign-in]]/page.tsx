import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-banan-bg py-12 px-4">
      <SignIn />
    </main>
  );
}