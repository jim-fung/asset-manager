"use client";

import { useState } from "react";
import { Button } from "@radix-ui/themes";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { SignOutIcon } from "@/components/Icons";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await authClient.signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      color="gray"
      onClick={handleLogout}
      disabled={loading}
      style={{ width: "100%", justifyContent: "flex-start" }}
    >
      <SignOutIcon />
      {loading ? "Uitloggen..." : "Uitloggen"}
    </Button>
  );
}
