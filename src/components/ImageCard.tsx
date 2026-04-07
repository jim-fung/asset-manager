import type { ImageAsset, ImageStatus } from "@/data/imageData";
import { useImageStatuses } from "@/hooks/useImageStatuses";

interface ImageCardProps {
  image: ImageAsset;
  onClick: () => void;
}

export function ImageCard({ image, onClick }: ImageCardProps) {
  const statusMap = useImageStatuses();
  const status: ImageStatus = statusMap[image.id] ?? "unset";

  return (
    <div className="image-card" onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && onClick()}>
      <div className="image-card-thumb">
        <img
          src={image.src}
          alt={image.caption || image.filename}
          loading="lazy"
        />
        <div className={`image-card-status ${status}`} title={status} />
      </div>
      <div className="image-card-info">
        <div className="image-card-filename">{image.filename}</div>
        {(image.description || image.caption) && (
          <div className="image-card-description">
            {image.description || image.caption}
          </div>
        )}
        <div className="image-card-section">{image.section}</div>
      </div>
    </div>
  );
}
