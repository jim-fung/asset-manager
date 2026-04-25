"use client";

import { useClerk } from "@clerk/nextjs";
import { SignOutIcon } from "@/components/Icons";
import { Button } from "@/components/ui/button";

export function LogoutButton() {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Button
      variant="ghost"
      onClick={handleLogout}
      className="sidebar-logout-btn"
    >
      <SignOutIcon />
      Uitloggen
    </Button>
  );
}
