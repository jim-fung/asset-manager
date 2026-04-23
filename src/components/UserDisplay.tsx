"use client";

import { useEffect, useState } from "react";
import { Text, Avatar, Skeleton } from "@radix-ui/themes";
import { UserIcon } from "@/components/Icons";
import { LogoutButton } from "./LogoutButton";

export function UserDisplay() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const response = await fetch("/api/auth/user");
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "1rem", borderTop: "1px solid var(--color-border-subtle)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
          <Skeleton width="34px" height="34px" style={{ borderRadius: "50%" }} />
          <div style={{ flex: 1 }}>
            <Skeleton width="120px" height="16px" style={{ marginBottom: "4px" }} />
            <Skeleton width="160px" height="14px" />
          </div>
        </div>
        <Skeleton width="80px" height="32px" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ padding: "1rem", borderTop: "1px solid var(--color-border-subtle)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
        <Avatar
          size="2"
          fallback={<UserIcon />}
          style={{ backgroundColor: "var(--color-accent-muted)" }}
        />
        <div style={{ flex: 1, overflow: "hidden" }}>
          <Text size="2" weight="bold" truncate>
            {user.name}
          </Text>
          <Text size="1" color="gray" truncate>
            {user.email}
          </Text>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}
