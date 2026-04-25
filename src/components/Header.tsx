"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { mobileSidebarOpenAtom, sidebarCollapsedAtom, mobileSidebarTriggerIdAtom } from "@/store/atoms";
import { MenuIcon, SidebarIcon } from "@/components/Icons";
import { useEffect, useId, useRef, useTransition, type ReactNode } from "react";
import { serverPreferencesAtom } from "@/store/serverAtoms";
import { updateUserPreference } from "@/app/actions/preferenceActions";

interface HeaderProps {
  children?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
}

export function Header({ children, title, subtitle }: HeaderProps) {
  const setMobileSidebarOpen = useSetAtom(mobileSidebarOpenAtom);
  const setMobileSidebarTriggerId = useSetAtom(mobileSidebarTriggerIdAtom);
  const [isSidebarCollapsed, setSidebarCollapsed] = useAtom(sidebarCollapsedAtom);
  const serverPreferences = useAtomValue(serverPreferencesAtom);
  const didHydrateSidebarPreference = useRef(false);
  const [, startTransition] = useTransition();
  const menuBtnId = useId();

  useEffect(() => {
    if (didHydrateSidebarPreference.current) return;
    const storedValue = serverPreferences["sidebar-collapsed"];
    if (storedValue === undefined) return;
    didHydrateSidebarPreference.current = true;
    setSidebarCollapsed(storedValue === "true");
  }, [serverPreferences, setSidebarCollapsed]);

  const toggleSidebarCollapsed = () => {
    const nextCollapsed = !isSidebarCollapsed;
    setSidebarCollapsed(nextCollapsed);
    startTransition(async () => {
      const formData = new FormData();
      formData.set("key", "sidebar-collapsed");
      formData.set("value", String(nextCollapsed));
      await updateUserPreference(formData);
    });
  };

  return (
    <header className="page-header">
      <div className="header-leading">
        <button
          type="button"
          className="mobile-menu-btn"
          id={menuBtnId}
          onClick={() => {
            setMobileSidebarTriggerId(menuBtnId);
            setMobileSidebarOpen(true);
          }}
          aria-label="Menu openen"
        >
          <MenuIcon />
        </button>

        <button
          type="button"
          className="desktop-sidebar-btn"
          onClick={toggleSidebarCollapsed}
          aria-label={isSidebarCollapsed ? "Zijbalk uitklappen" : "Zijbalk inklappen"}
          title={isSidebarCollapsed ? "Zijbalk uitklappen" : "Zijbalk inklappen"}
        >
          <SidebarIcon collapsed={isSidebarCollapsed} />
        </button>

        <div className="header-titles">
          {title && <div className="page-title">{title}</div>}
          {subtitle && <div className="page-subtitle">{subtitle}</div>}
        </div>
      </div>

      <div className="header-actions">{children}</div>
    </header>
  );
}
