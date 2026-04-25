"use client";

import { useAtom, useAtomValue } from "jotai";
import { mobileSidebarOpenAtom, mobileSidebarTriggerIdAtom, sidebarCollapsedAtom } from "@/store/atoms";
import { CloseIcon } from "@/components/Icons";
import { useEffect, type ReactNode } from "react";

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function Layout({ sidebar, children }: LayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useAtom(mobileSidebarOpenAtom);
  const triggerId = useAtomValue(mobileSidebarTriggerIdAtom);
  const isSidebarCollapsed = useAtomValue(sidebarCollapsedAtom);

  // Restore focus to the trigger button when the mobile sidebar closes
  useEffect(() => {
    if (!isMobileOpen && triggerId) {
      const trigger = document.getElementById(triggerId);
      if (trigger instanceof HTMLElement) {
        trigger.focus();
      }
    }
  }, [isMobileOpen, triggerId]);

  return (
    <div
      className={[
        "app-layout",
        isMobileOpen ? "mobile-sidebar-open" : "",
        isSidebarCollapsed ? "sidebar-collapsed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <a href="#main-content" className="skip-link">
        Naar hoofdinhoud
      </a>
      <button
        type="button"
        className="sidebar-overlay"
        onClick={() => setIsMobileOpen(false)}
        aria-label="Navigatie sluiten"
      />
      <aside className="app-sidebar" aria-label="Hoofdnavigatie">
        <button
          type="button"
          className="mobile-close-btn"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Menu sluiten"
        >
          <CloseIcon />
        </button>
        {sidebar}
      </aside>
      <main className="app-main" id="main-content">{children}</main>
    </div>
  );
}
