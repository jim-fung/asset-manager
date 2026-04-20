"use client";

import { Suspense } from "react";
import { OverviewDashboard } from "@/components/OverviewDashboard";

export default function HomePage() {
  return (
    <Suspense>
      <OverviewDashboard />
    </Suspense>
  );
}
