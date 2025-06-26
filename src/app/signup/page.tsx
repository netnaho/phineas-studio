import { AuthForm } from "@/components/auth/auth-form";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <>
      <AuthForm mode="signup" />
      <p className="px-8 text-center text-sm text-muted-foreground mt-4">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="underline underline-offset-4 hover:text-primary"
        >
          Sign In
        </Link>
      </p>
    </>
  );
}
