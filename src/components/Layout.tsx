import type { ReactNode } from "react";

interface LayoutProps {
  sidebar: ReactNode;
  children: ReactNode;
}

export function Layout({ sidebar, children }: LayoutProps) {
  return (
    <div className="app-layout">
      <aside className="app-sidebar">{sidebar}</aside>
      <main className="app-main">{children}</main>
    </div>
  );
}
