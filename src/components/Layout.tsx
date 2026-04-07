import { useAtom } from "jotai";
import { mobileSidebarOpenAtom } from "@/store/atoms";
import type { ReactNode } from "react";

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function Layout({ sidebar, children }: LayoutProps) {
  const [isMobileOpen, setIsMobileOpen] = useAtom(mobileSidebarOpenAtom);

  return (
    <div className={`app-layout ${isMobileOpen ? "mobile-sidebar-open" : ""}`}>
      <div 
        className="sidebar-overlay" 
        onClick={() => setIsMobileOpen(false)}
      />
      <aside className="app-sidebar">
        <button 
          className="mobile-close-btn"
          onClick={() => setIsMobileOpen(false)}
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {sidebar}
      </aside>
      <main className="app-main">{children}</main>
    </div>
  );
}
