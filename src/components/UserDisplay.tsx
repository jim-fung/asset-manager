"use client";

import { useUser } from "@clerk/nextjs";
import { Text, Avatar, Skeleton } from "@radix-ui/themes";
import { UserIcon } from "@/components/Icons";
import { LogoutButton } from "./LogoutButton";

export function UserDisplay() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <div className="sidebar-user">
        <div className="sidebar-user-row">
          <Skeleton className="sidebar-user-avatar-skeleton" width="40px" height="40px" />
          <div className="sidebar-user-meta">
            <Skeleton width="120px" height="16px" className="sidebar-user-skeleton-line" />
            <Skeleton width="160px" height="14px" />
          </div>
        </div>
        <Skeleton width="112px" height="34px" />
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
          size="3"
          src={user.imageUrl}
          fallback={<UserIcon />}
          className="sidebar-user-avatar"
        />
        <div className="sidebar-user-meta">
          <Text size="3" weight="bold" truncate>
            {user.fullName}
          </Text>
        </div>
      </div>
      <LogoutButton />
    </div>
  );
}
