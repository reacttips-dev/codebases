import { mixRbg, RGBColor } from '../../../modules/ColorUtils';
import { SectionIntersection } from '../../SectionPositionTracker';

export interface SectionColorResult {
  currentSectionIndex: number;
  color: RGBColor;
}

const normalizeRatio = (ratio: number) => Math.max(0, Math.min(1, ratio));

export function getMixedColor(
  colors: RGBColor[],
  intersections: SectionIntersection[]
): SectionColorResult | null {
  if (colors.length === 0 || intersections.length === 0) {
    return null;
  }

  const intersection = intersections[0];

  const {
    sectionIndex: currentSectionIndex,
    entry: { intersectionRatio, rootBounds, boundingClientRect },
  } = intersection;

  if (currentSectionIndex >= colors.length) {
    return null;
  }

  const currentColor = colors[currentSectionIndex];

  // For tall screens where the element doesn't fit and will never reach an intersection of 1
  const maxIntersectionRatio = normalizeRatio(
    rootBounds!.height / boundingClientRect.height
  );

  const nextSectionIndex = currentSectionIndex + 1;

  // We are at the last section
  if (nextSectionIndex >= colors.length) {
    return {
      currentSectionIndex,
      color: currentColor,
    };
  }

  const nextColor = colors[nextSectionIndex];
  const ratio = normalizeRatio(intersectionRatio / maxIntersectionRatio);
  const color = mixRbg(currentColor, nextColor, ratio);

  return {
    currentSectionIndex,
    color,
  };
}
