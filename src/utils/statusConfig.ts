import type { ImageStatus } from "@/data/imageData";

/** Single source of truth for all status display metadata */
export const statusConfig = {
  approved: { label: "Goedgekeurd", color: "green" as const },
  review: { label: "Te beoordelen", color: "amber" as const },
  "needs-replacement": { label: "Vervangen", color: "red" as const },
  unset: { label: "Niet ingesteld", color: "gray" as const },
} as const satisfies Record<ImageStatus, { label: string; color: string }>;

export type StatusColor = (typeof statusConfig)[ImageStatus]["color"];

/** All status values that a filter UI might offer (null = "all") */
export const statusFilterOptions: readonly {
  readonly value: ImageStatus | null;
  readonly label: string;
}[] = [
  { value: null, label: "Alles" },
  { value: "approved", label: statusConfig.approved.label },
  { value: "review", label: statusConfig.review.label },
  { value: "needs-replacement", label: statusConfig["needs-replacement"].label },
  { value: "unset", label: statusConfig.unset.label },
];

/** Status options for dropdowns/select (no null option) */
export const statusSelectOptions: readonly {
  readonly value: ImageStatus;
  readonly label: string;
}[] = [
  { value: "unset", label: statusConfig.unset.label },
  { value: "approved", label: statusConfig.approved.label },
  { value: "review", label: statusConfig.review.label },
  { value: "needs-replacement", label: statusConfig["needs-replacement"].label },
];

/** The set of statuses considered valid in URL search params */
export const validStatuses = new Set<ImageStatus>(
  Object.keys(statusConfig) as ImageStatus[],
);
