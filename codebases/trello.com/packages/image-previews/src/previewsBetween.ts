import { Preview } from './imagePreview.types';
import { preferScaledPreviews } from './preferScaledPreviews';

export function previewsBetween(
  previews: Preview[] | null = [],
  minWidth: number,
  minHeight: number,
  maxWidth: number,
  maxHeight: number,
) {
  return preferScaledPreviews(previews).filter(
    (p) =>
      minWidth <= p.width &&
      p.width <= maxWidth &&
      minHeight <= p.height &&
      p.height <= maxHeight,
  );
}
