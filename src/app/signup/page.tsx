"use client";

import { useState } from "react";
import { Button, TextField, Callout } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function SignupPage() {
  useDocumentTitle("Registreren");
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password !== confirmPassword) {
      setError("Wachtwoorden komen niet overeen");
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError("Wachtwoord moet minimaal 8 tekens lang zijn");
      setLoading(false);
      return;
    }

    try {
      await authClient.signUp.email({
        email,
        password,
        name,
      });
      setSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message :
        (err as { error?: { message?: string } })?.error?.message ?? "";
      setError(message || "Registratie mislukt. Probeer het opnieuw.");
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
        <h1>Registreren</h1>
        <p className="auth-subtitle">Maak een account aan</p>

        {success ? (
          <>
            <Callout.Root color="green">
              <Callout.Text>
                Account aangemaakt! Je kunt nu inloggen met je e-mailadres en wachtwoord.
              </Callout.Text>
            </Callout.Root>
            <div style={{ marginTop: "1rem", textAlign: "center" }}>
              <Button size="3" onClick={() => router.push("/login")}>
                Naar inloggen
              </Button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <Callout.Root color="red">
                <Callout.Text>{error}</Callout.Text>
              </Callout.Root>
            )}

            <label>
              <span>Naam</span>
              <TextField.Root
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Volledige naam"
                required
              />
            </label>

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

            <label>
              <span>Wachtwoord bevestigen</span>
              <TextField.Root
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={8}
              />
            </label>

            <Button type="submit" disabled={loading} size="3">
              {loading ? "Registreren..." : "Registreren"}
            </Button>
          </form>
        )}

        {!success && (
          <p className="auth-footer">
            Al een account?{" "}
            <Button variant="ghost" color="sky" onClick={() => router.push("/login")}>
              Inloggen
            </Button>
          </p>
        )}
      </div>
    </div>
  );
}
