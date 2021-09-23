/**
 * A small utility for tracking what section(s) of a page are currently within
 * the viewport. Tracks every SectionPositionTrackerSection child, no matter how deep.
 *
 * Example usage:
 *
 * <SectionPositionTracker onChange={onChange}>
 *   <SectionPositionTrackerSection>Section 1</SectionPositionTrackerSection>
 *   <div className="someRandomWrapper">
 *     <SectionPositionTrackerSection>Section 2</SectionPositionTrackerSection>
 *   </div>
 * </Section>
 *
 * As the user scrolls, and "Section 2" comes into view, onChange will be called
 * with something like:
 * [
 *   { sectionIndex: 0, intersectionRatio: 1 }, // assuming "Section 1" is entirely in view
 *   { sectionIndex: 1, intersectionRatio: 0.1 }
 * ]
 *
 * Once "Section 1" is completely out of view, onChange might be called with:
 * [
 *   { sectionIndex: 1, intersectionRatio: 1 }
 * ]
 *
 * If you want to get updates more frequently as the user scrolls, you can
 * provide a more granular threshold:
 *
 * <SectionPositionTracker intersectionThreshold={createRange(0, 1, 0.01)} />
 *
 * This will make sure onChange is called at intersection ratios 0.1, 0.11,
 * 0.12, etc.
 *
 * Conversely, [0.5, 1] means onChange is called when the element is halfway and
 * fully within the view.
 */
import React, { Children, ReactElement, useEffect, useState } from 'react';
import InView from 'react-intersection-observer';
import { createRange } from '../../modules/ArrayUtils';
import { deepMap } from '../../modules/ReactChildrenUtils';

export interface SectionIntersection {
  sectionIndex: number;
  entry: IntersectionObserverEntry;
}

interface SectionIntersectionMap {
  [sectionIndex: number]: SectionIntersection;
}

interface SectionPositionTrackerProps {
  children: ReactElement | ReactElement[];
  onChange: (intersections: SectionIntersection[]) => void;
  intersectionThreshold?: number | number[];
  rootMargin?: string;
}

export function SectionPositionTrackerSection({
  children,
}: {
  children: ReactElement | string;
}): ReactElement {
  return <>{children}</>;
}

const intersectionsToString = (map: SectionIntersectionMap) => {
  return Object.values(map)
    .map(
      intersection =>
        `${intersection.sectionIndex}${intersection.entry.intersectionRatio}`
    )
    .join(',');
};

export const SectionPositionTracker = ({
  children,
  onChange,
  rootMargin,
  intersectionThreshold = createRange(0, 1, 0.01),
}: SectionPositionTrackerProps) => {
  const [intersections, setIntersections] = useState<SectionIntersectionMap>(
    {}
  );

  const registerIntersection = (
    sectionIndex: number,
    isIntersecting: boolean,
    entry: IntersectionObserverEntry
  ) => {
    let newIntersections = { ...intersections };
    if (!isIntersecting) {
      delete newIntersections[sectionIndex];
    } else {
      newIntersections = {
        ...intersections,
        [sectionIndex]: {
          sectionIndex,
          entry,
        },
      };
    }
    // To prevent unneccessary re-renders, especially because the intersection
    // entry contains a "time" field that is always changing.
    if (
      intersectionsToString(newIntersections) !==
      intersectionsToString(intersections)
    ) {
      setIntersections(newIntersections);
    }
  };

  useEffect(() => {
    onChange(Object.values(intersections));
  }, [intersections]);

  const wrapElement = (child: ReactElement, index: number): ReactElement => {
    return (
      <InView
        as="section"
        key={`section-position-tracker-child-${index}`}
        rootMargin={rootMargin}
        threshold={intersectionThreshold}
        onChange={(isIntersecting, entry) =>
          registerIntersection(index, isIntersecting, entry)
        }
      >
        {child}
      </InView>
    );
  };

  const wrapChildren = (children: ReactElement[]) => {
    let sectionIndex = 0;
    return deepMap(children, (child: ReactElement) => {
      return child.type === SectionPositionTrackerSection
        ? wrapElement(child, sectionIndex++)
        : child;
    });
  };

  return <>{wrapChildren(Children.toArray(children))}</>;
};
