import type { Preview } from './imagePreview.types';
import { preferScaledPreviews } from './preferScaledPreviews';
import { tryToExcludeEXIFRotated } from './tryToExcludeEXIFRotated';
import { smallestPreview } from './smallestPreview';

export function smallestPreviewBiggerThan(
  previews: Preview[] | null = [],
  width: number = 0,
  height: number = 0,
) {
  if (!previews) {
    return null;
  }

  let eligible;
  let previewSet;
  const previewSets = [
    preferScaledPreviews(previews),
    tryToExcludeEXIFRotated(previews),
  ];
  for (previewSet of previewSets) {
    if (!eligible) {
      eligible = previewSet.filter(
        (p) => p.width >= width && p.height >= height,
      );
    }
  }

  return smallestPreview(eligible);
}
