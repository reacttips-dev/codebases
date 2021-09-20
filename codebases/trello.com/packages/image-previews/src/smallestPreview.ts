import type { Preview } from './imagePreview.types';
import { preferScaledPreviews } from './preferScaledPreviews';

export function smallestPreview(previews: Preview[] | null = []) {
  if (!previews || previews.length === 0) {
    return null;
  } else {
    return preferScaledPreviews(previews).sort(
      (a, b) => Math.max(a.width, a.height) - Math.max(b.width, b.height),
    )[0];
  }
}
