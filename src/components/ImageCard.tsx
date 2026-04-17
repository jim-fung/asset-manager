import type { ImageAsset, ImageStatus } from "@/data/imageData";
import { useImageStatuses } from "@/hooks/useImageStatuses";

interface ImageCardProps {
  image: ImageAsset;
  onClick: () => void;
  triggerId?: string;
}

const statusLabels: Record<ImageStatus, string> = {
  approved: "Goedgekeurd",
  review: "Te beoordelen",
  "needs-replacement": "Vervangen",
  unset: "Niet ingesteld",
};

export function ImageCard({ image, onClick, triggerId }: ImageCardProps) {
  const statusMap = useImageStatuses();
  const status: ImageStatus = statusMap[image.id] ?? "unset";
  const altText =
    image.alt || image.description || image.caption || image.filename;

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
        />
        <div
          className={`image-card-status ${status}`}
          title={statusLabels[status]}
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
          <span className={`status-badge ${status}`}>
            <span className="dot" />
            {statusLabels[status]}
          </span>
          <div className="image-card-section">{image.section}</div>
        </div>
      </div>
    </button>
  );
}
