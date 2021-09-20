import type { Preview } from './imagePreview.types';
import { tryToExcludeEXIFRotated } from './tryToExcludeEXIFRotated';

export function preferScaledPreviews(
  previews: Preview[] | null = [],
): Preview[] {
  if (!previews) {
    return [];
  }

  const scaledPreviews = tryToExcludeEXIFRotated(
    previews.filter((p) => p.scaled),
  );

  if (scaledPreviews && scaledPreviews.length) {
    return scaledPreviews;
  } else {
    return previews;
  }
}
