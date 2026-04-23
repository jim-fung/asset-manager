import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="auth-page">
      <div className="auth-page-header">
        <div className="auth-brand">Winston van der Bok</div>
        <div className="auth-brand-sub">Beeldbeheer</div>
      </div>
      <SignUp signInUrl="/sign-in" forceRedirectUrl="/" />
    </main>
  );
}
