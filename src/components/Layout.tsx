import { useAtom } from "jotai";
import { IconButton } from "@radix-ui/themes";
import { mobileSidebarOpenAtom, sidebarCollapsedAtom } from "@/store/atoms";
import { CloseIcon } from "@/components/Icons";
import type { ReactNode } from "react";

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function Layout({ sidebar, children }: LayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useAtom(mobileSidebarOpenAtom);
  const [isSidebarCollapsed] = useAtom(sidebarCollapsedAtom);

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
        <IconButton
          type="button"
          variant="soft"
          color="gray"
          size="2"
          className="mobile-close-btn"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Menu sluiten"
        >
          <CloseIcon />
        </IconButton>
        {sidebar}
      </aside>
      <main className="app-main" id="main-content">{children}</main>
    </div>
  );
}
