import AuthCard from "@/components/auth/auth-card";
import SignUpForm from "@/components/auth/sign-up-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <AuthCard title="Create account" description="Start booking flights with your own profile.">
        <SignUpForm />
        <p className="mt-6 text-center text-sm text-slate-600">
          Already registered?{' '}
          <Link href="/auth/sign-in" className="font-semibold text-blue-600 hover:text-blue-700">
            Sign in
          </Link>
        </p>
      </AuthCard>
    </main>
  );
}
