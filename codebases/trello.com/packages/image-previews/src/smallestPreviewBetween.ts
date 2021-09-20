import type { Preview } from './imagePreview.types';
import { previewsBetween } from './previewsBetween';
import { smallestPreview } from './smallestPreview';

export function smallestPreviewBetween(
  previews: Preview[] | null = [],
  minWidth: number,
  minHeight: number,
  maxWidth: number,
  maxHeight: number,
) {
  return smallestPreview(
    previewsBetween(previews, minWidth, minHeight, maxWidth, maxHeight),
  );
}
