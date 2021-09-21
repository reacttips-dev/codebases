/**
 * A utility for changing the background color based on where on the page the
 * user is, primarily for the marketing pages. Uses the SectionPositionTracker
 * under the hood to figure out what section the user is looking at and how far
 * down the section they are.
 *
 * Example usage:
 *
 * <ColorShiftContainer
 *   onChange={(color) => console.log(`Set background color to: ${color}`)}
 * >
 *   <ColorShiftSection color="#9A201C">
 *     <div className="makeItTall">Section 1</div>
 *   </ColorShiftSection>
 *   <div className="someWrapper">
 *     <ColorShiftSection color="#C74461">
 *       <div className="makeItTall">Section 2</div>
 *     </ColorShiftSection>
 *   </div>
 * </ColorShiftContainer>
 *
 * As the user scrolls from Section 1 to Section 2, the onChange callback will
 * be called with a mix of the two colors, gradually moving from the first
 * section color to the second.
 */

import React, {
  Children,
  ReactElement,
  forwardRef,
  useEffect,
  useState,
  Ref,
} from 'react';
import { hexToRgb, RGBColor } from '../../modules/ColorUtils';
import {
  SectionIntersection,
  SectionPositionTracker,
  SectionPositionTrackerSection,
} from '../SectionPositionTracker';
import { getMixedColor, SectionColorResult } from './utils/getMixedColor';
import { deepMap } from '../../modules/ReactChildrenUtils';

export const INVALID_COLOR_ERROR =
  'ColorShiftSection color-property can currently only be a hex color.';

export const ColorShiftSection = forwardRef(
  (
    {
      children,
    }: {
      children: ReactElement | string;
      color: string;
    },
    ref: Ref<HTMLDivElement>
  ): ReactElement => <div ref={ref}>{children}</div>
);

export function ColorShiftContainer({
  children,
  onChange,
}: {
  children: ReactElement | ReactElement[];
  onChange: (result: SectionColorResult) => void;
}) {
  const [colors, setColors] = useState<RGBColor[]>([]);
  const [intersections, setIntersections] = useState<SectionIntersection[]>([]);

  useEffect(() => {
    const currentMix = getMixedColor(colors, intersections);
    if (currentMix) {
      onChange(currentMix);
    }
  }, [intersections, colors, onChange]);

  useEffect(() => {
    // For now, for performance reasons, we only want this to happen once since
    // children tend to change without the actual color property changing. We
    // will revisit this in CAST-1417, when we focus more deeply on performance.
    if (colors.length !== 0) {
      return;
    }
    const parsedColors: RGBColor[] = [];
    deepMap(children, (child: ReactElement) => {
      if (child.type === ColorShiftSection) {
        const { color } = child.props;
        const rgbColor = hexToRgb(color);
        if (!rgbColor) {
          throw new Error(INVALID_COLOR_ERROR);
        }
        parsedColors.push(rgbColor);
      }
      return child;
    });
    setColors(parsedColors);
  }, [children, colors]);

  const wrapChildren = (traverseChildren: ReactElement[]) =>
    deepMap(traverseChildren, (child: ReactElement, index?: number) =>
      child.type === ColorShiftSection ? (
        <SectionPositionTrackerSection key={`section-${index}`}>
          {child}
        </SectionPositionTrackerSection>
      ) : (
        child
      )
    );

  return (
    <SectionPositionTracker
      onChange={newIntersections => setIntersections(newIntersections)}
      // To account for the header
      rootMargin="-96px 0px 0px 0px"
    >
      {wrapChildren(Children.toArray(children))}
    </SectionPositionTracker>
  );
}
