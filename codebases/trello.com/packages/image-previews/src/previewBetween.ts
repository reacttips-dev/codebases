import type { Preview } from './imagePreview.types';
import { biggestPreview } from './biggestPreview';
import { previewsBetween } from './previewsBetween';

export function previewBetween(
  previews: Preview[] | null = [],
  minWidth: number,
  minHeight: number,
  maxWidth: number,
  maxHeight: number,
) {
  return biggestPreview(
    previewsBetween(previews, minWidth, minHeight, maxWidth, maxHeight),
  );
}
