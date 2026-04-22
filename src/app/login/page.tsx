"use client";

import { useState } from "react";
import { Button, TextField, Callout } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Header } from "@/components/Header";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function LoginPage() {
  useDocumentTitle("Inloggen");
  const router = useRouter();
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
      router.push("/");
      router.refresh();
    } catch {
      setError("Ongeldige e-mail of wachtwoord");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header title="Inloggen" subtitle="Welkom terug" />
      <div className="page-content">
        <section className="content-section" style={{ maxWidth: "480px", margin: "0 auto" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {error && (
              <Callout.Root color="red">
                <Callout.Text>{error}</Callout.Text>
              </Callout.Root>
            )}

            <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>E-mailadres</span>
              <TextField.Root
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="naam@voorbeeld.nl"
                required
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span style={{ fontSize: "0.875rem", fontWeight: 500 }}>Wachtwoord</span>
              <TextField.Root
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </label>

            <Button type="submit" disabled={loading} size="3">
              {loading ? "Inloggen..." : "Inloggen"}
            </Button>
          </form>

          <p style={{ marginTop: "1.5rem", textAlign: "center", color: "var(--color-text-secondary)" }}>
            Nog geen account?{" "}
            <Button variant="ghost" color="sky" onClick={() => router.push("/signup")}>
              Registreren
            </Button>
          </p>
        </section>
      </div>
    </>
  );
}
