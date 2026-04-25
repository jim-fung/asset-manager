"use client";

import { cloneElement, type ReactElement } from "react";

type TooltipCompatibleElementProps = {
  title?: string;
  "aria-label"?: string;
};

interface ConditionalTooltipProps {
  show: boolean;
  content: string;
  children: ReactElement<TooltipCompatibleElementProps>;
}

export function ConditionalTooltip({
  show,
  content,
  children,
}: ConditionalTooltipProps) {
  if (!show) return children;

  return cloneElement(children, {
    title: content,
    "aria-label": children.props["aria-label"] ?? content,
  });
}
