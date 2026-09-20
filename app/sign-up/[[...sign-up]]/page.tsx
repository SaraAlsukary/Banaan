import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-[80vh] flex items-center justify-center bg-banan-bg py-12 px-4">
      <SignUp />
    </main>
  );
}