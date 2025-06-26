import { AuthForm } from "@/components/auth/auth-form";
import Link from "next/link";

export default function SignInPage() {
  return (
    <>
      <AuthForm mode="signin" />
      <p className="px-8 text-center text-sm text-muted-foreground mt-4">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign Up
        </Link>
      </p>
    </>
  );
}
