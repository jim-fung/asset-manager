import { useSetAtom } from "jotai";
import { mobileSidebarOpenAtom } from "@/store/atoms";
import type { ReactNode } from "react";

interface HeaderProps {
  children?: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
}

export function Header({ children, title, subtitle }: HeaderProps) {
  const setMobileSidebarOpen = useSetAtom(mobileSidebarOpenAtom);

  return (
    <header className="page-header">
      <button 
        className="mobile-menu-btn"
        onClick={() => setMobileSidebarOpen(true)}
        aria-label="Open menu"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      <div className="header-titles">
        {title && <div className="page-title">{title}</div>}
        {subtitle && <div className="page-subtitle">{subtitle}</div>}
      </div>

      <div className="header-actions">
        {children}
      </div>
    </header>
  );
}
