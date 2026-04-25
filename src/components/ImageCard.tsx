"use client";

import { memo } from "react";
import type { ServerImageViewModel } from "@/types/server";
import { useImageStatuses } from "@/hooks/useImageStatuses";
import { resolveStatus, getImageAltText } from "@/utils/imageHelpers";
import { statusConfig } from "@/utils/statusConfig";
import { Badge } from "@/components/ui/badge";

interface ImageCardProps {
  image: ServerImageViewModel;
  onClick: () => void;
  triggerId?: string;
  onRemove?: () => void;
}

export const ImageCard = memo(function ImageCard({ image, onClick, triggerId, onRemove }: ImageCardProps) {
  const statusMap = useImageStatuses();
  const status = resolveStatus(image.id, statusMap);
  const altText = getImageAltText(image);
  const { label, color } = statusConfig[status];
  const title = image.description || image.caption || image.filename;
  const showFilename = title !== image.filename;
  const statusVariant =
    color === "green"
      ? "success"
      : color === "amber"
        ? "warning"
        : color === "red"
          ? "destructive"
          : "default";

  return (
    <button
      type="button"
      id={triggerId}
      className="image-card"
      onClick={onClick}
      aria-label={`Openen ${image.filename}`}
    >
      <div className="image-card-thumb">
        <img
          src={image.preview}
          alt={altText}
          loading="lazy"
          data-image-id={image.id}
          data-source-type={image.sourceType}
        />
        <div
          className={`image-card-status ${status}`}
          title={label}
          aria-hidden="true"
        />
        {onRemove && (
          <button
            type="button"
            className="image-card-remove-btn"
            aria-label="Verwijderen uit hoofdstuk"
            title="Verwijderen uit hoofdstuk"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            &times;
          </button>
        )}
      </div>
      <div className="image-card-info">
        <div className="image-card-title">{title}</div>
        {showFilename && <div className="image-card-filename">{image.filename}</div>}
        <div className="image-card-meta-row">
          <Badge
            variant={statusVariant}
            className="image-card-status-pill"
          >
            {label}
          </Badge>
          <div className="image-card-section">{image.section}</div>
        </div>
      </div>
    </button>
  );
});
