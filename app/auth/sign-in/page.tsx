import AuthCard from "@/components/auth/auth-card";
import SignInForm from "@/components/auth/sign-in-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <AuthCard title="Sign in" description="Welcome back to your flight dashboard.">
        <SignInForm />
        <p className="mt-6 text-center text-sm text-slate-600">
          Don’t have an account?{' '}
          <Link href="/auth/sign-up" className="font-semibold text-blue-600 hover:text-blue-700">
            Create one
          </Link>
        </p>
      </AuthCard>
    </main>
  );
}
