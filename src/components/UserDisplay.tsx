"use client";

import { useUser } from "@clerk/nextjs";
import { UserIcon } from "@/components/Icons";
import { Avatar } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoutButton } from "./LogoutButton";

export function UserDisplay() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="sidebar-user">
        <div className="sidebar-user-row">
          <Skeleton className="sidebar-user-avatar-skeleton h-10 w-10 rounded-full" />
          <div className="sidebar-user-meta">
            <Skeleton className="sidebar-user-skeleton-line h-4 w-[120px]" />
            <Skeleton className="h-3.5 w-[160px]" />
          </div>
        </div>
        <Skeleton className="h-[34px] w-[112px]" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="sidebar-user">
      <div className="sidebar-user-row">
        <Avatar
          src={user.imageUrl}
          alt={user.fullName ?? "Gebruiker"}
          fallback={<UserIcon />}
          className="sidebar-user-avatar"
        />
        <div className="sidebar-user-meta">
          <div className="truncate text-sm font-bold">
            {user.fullName}
          </div>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}
