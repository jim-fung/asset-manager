import { memo } from "react";
import { Badge } from "@radix-ui/themes";
import type { ImageAsset } from "@/data/imageData";
import { useImageStatuses } from "@/hooks/useImageStatuses";
import { resolveStatus, getImageAltText } from "@/utils/imageHelpers";
import { statusConfig } from "@/utils/statusConfig";

interface ImageCardProps {
  image: ImageAsset;
  onClick: () => void;
  triggerId?: string;
}

export const ImageCard = memo(function ImageCard({ image, onClick, triggerId }: ImageCardProps) {
  const statusMap = useImageStatuses();
  const status = resolveStatus(image.id, statusMap);
  const altText = getImageAltText(image);
  const { label, color } = statusConfig[status];

  return (
    <button
      type="button"
      id={triggerId}
      className="image-card"
      onClick={onClick}
      aria-label={`Openen ${image.filename}`}
    >
      <div className="image-card-thumb">
        <img src={image.preview} alt={altText} loading="lazy" />
        <div
          className={`image-card-status ${status}`}
          title={label}
          aria-hidden="true"
        />
      </div>
      <div className="image-card-info">
        <div className="image-card-filename">{image.filename}</div>
        {(image.description || image.caption) && (
          <div className="image-card-description">
            {image.description || image.caption}
          </div>
        )}
        <div className="image-card-meta-row">
          <Badge
            color={color}
            variant="soft"
            radius="full"
            size="1"
          >
            {label}
          </Badge>
          <div className="image-card-section">{image.section}</div>
        </div>
      </div>
    </button>
  );
});
