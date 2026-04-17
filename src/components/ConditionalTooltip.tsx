import { Tooltip } from "@radix-ui/themes";
import type { ReactElement } from "react";

interface ConditionalTooltipProps {
  show: boolean;
  content: string;
  children: ReactElement;
}

/** Wraps children in a Radix Tooltip only when `show` is true */
export function ConditionalTooltip({
  show,
  content,
  children,
}: ConditionalTooltipProps) {
  if (!show) return children;
  return (
    <Tooltip content={content} side="right">
      {children}
    </Tooltip>
  );
}
