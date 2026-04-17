import { useAtom, useSetAtom } from "jotai";
import { mobileSidebarOpenAtom, sidebarCollapsedAtom } from "@/store/atoms";
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
        <button 
          type="button"
          className="mobile-menu-btn"
          onClick={() => setMobileSidebarOpen(true)}
          aria-label="Menu openen"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </button>

        <button
          type="button"
          className="desktop-sidebar-btn"
          onClick={() => setSidebarCollapsed((current) => !current)}
          aria-label={isSidebarCollapsed ? "Zijbalk uitklappen" : "Zijbalk inklappen"}
          title={isSidebarCollapsed ? "Zijbalk uitklappen" : "Zijbalk inklappen"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="16" rx="2" />
            <path d="M9 4v16" />
            {isSidebarCollapsed ? <path d="m13 12 4-3v6l-4-3Z" /> : <path d="m11 12 4-3v6l-4-3Z" />}
          </svg>
        </button>

        <div className="header-titles">
          {title && <div className="page-title">{title}</div>}
          {subtitle && <div className="page-subtitle">{subtitle}</div>}
        </div>
      </div>

      <div className="header-actions">
        {children}
      </div>
    </header>
  );
}
