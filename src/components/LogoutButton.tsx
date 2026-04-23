"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@radix-ui/themes";
import { SignOutIcon } from "@/components/Icons";

export function LogoutButton() {
  const { signOut } = useClerk();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <Button
      variant="ghost"
      color="gray"
      onClick={handleLogout}
      className="sidebar-logout-btn"
    >
      <SignOutIcon />
      Uitloggen
    </Button>
  );
}
