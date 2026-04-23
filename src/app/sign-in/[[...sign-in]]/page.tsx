import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="auth-page">
      <div className="auth-page-header">
        <div className="auth-brand">Winston van der Bok</div>
        <div className="auth-brand-sub">Beeldbeheer</div>
      </div>
      <SignIn signUpUrl="/sign-up" forceRedirectUrl="/" />
    </main>
  );
}
