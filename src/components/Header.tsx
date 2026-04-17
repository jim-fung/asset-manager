import { useAtom, useSetAtom } from "jotai";
import { IconButton } from "@radix-ui/themes";
import { mobileSidebarOpenAtom, sidebarCollapsedAtom } from "@/store/atoms";
import { MenuIcon, SidebarIcon } from "@/components/Icons";
import type { ReactNode } from "react";

interface HeaderProps {
  children?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
}

export function Header({ children, title, subtitle }: HeaderProps) {
  const setMobileSidebarOpen = useSetAtom(mobileSidebarOpenAtom);
  const [isSidebarCollapsed, setSidebarCollapsed] = useAtom(sidebarCollapsedAtom);

  return (
    <header className="page-header">
      <div className="header-leading">
        <IconButton
          type="button"
          variant="soft"
          color="gray"
          size="2"
          className="mobile-menu-btn"
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Menu openen"
        >
          <MenuIcon />
        </IconButton>

        <IconButton
          type="button"
          variant="soft"
          color="gray"
          size="2"
          className="desktop-sidebar-btn"
          onClick={() => setSidebarCollapsed((current) => !current)}
          aria-label={isSidebarCollapsed ? "Zijbalk uitklappen" : "Zijbalk inklappen"}
          title={isSidebarCollapsed ? "Zijbalk uitklappen" : "Zijbalk inklappen"}
        >
          <SidebarIcon collapsed={isSidebarCollapsed} />
        </IconButton>

        <div className="header-titles">
          {title && <div className="page-title">{title}</div>}
          {subtitle && <div className="page-subtitle">{subtitle}</div>}
        </div>
      </div>

      <div className="header-actions">{children}</div>
    </header>
  );
}
