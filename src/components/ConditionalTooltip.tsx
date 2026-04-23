"use client";

import { Tooltip } from "@radix-ui/themes";
import type { ReactElement } from "react";

interface ConditionalTooltipProps {
  show: boolean;
  content: string;
  children: ReactElement;
}

/**
 * Wraps children in a Radix Tooltip only when `show` is true.
 * Note: Radix Themes Tooltip already renders children as-is (no extra wrapper),
 * so no `asChild` prop is needed here.
 */
export function ConditionalTooltip({
  show,
  content,
  children,
}: ConditionalTooltipProps) {
  return (
    <Tooltip content={content} side="right" open={show ? undefined : false}>
      {children}
    </Tooltip>
  );
}
