import { Outlet } from "react-router";
import { Layout } from "@/components/Layout";
import { Sidebar } from "@/components/Sidebar";

export function AppShell() {
  return (
    <Layout sidebar={<Sidebar />}>
      <Outlet />
    </Layout>
  );
}
