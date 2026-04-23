"use client";

import { useState } from "react";
import { Button, TextField, Callout } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function LoginPage() {
  useDocumentTitle("Inloggen");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authClient.signIn.email({
        email,
        password,
      });
      router.push(callbackUrl);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message :
        (err as { error?: { message?: string } })?.error?.message ?? "";
      setError(message || "Ongeldige e-mail of wachtwoord");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page-header">
        <div className="auth-brand">Winston van der Bok</div>
        <div className="auth-brand-sub">Beeldbeheer</div>
      </div>

      <div className="auth-card">
        <h1>Inloggen</h1>
        <p className="auth-subtitle">Welkom terug</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && (
            <Callout.Root color="red">
              <Callout.Text>{error}</Callout.Text>
            </Callout.Root>
          )}

          <label>
            <span>E-mailadres</span>
            <TextField.Root
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="naam@voorbeeld.nl"
              required
            />
          </label>

          <label>
            <span>Wachtwoord</span>
            <TextField.Root
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={8}
            />
          </label>

          <Button type="submit" disabled={loading} size="3">
            {loading ? "Inloggen..." : "Inloggen"}
          </Button>
        </form>

        <p className="auth-footer">
          Nog geen account?{" "}
          <Button variant="ghost" color="sky" onClick={() => router.push("/signup")}>
            Registreren
          </Button>
        </p>
      </div>
    </div>
  );
}
