/**
 * A component for overlaying two images and adding a caption. Used primarily on
 * the marketing pages.
 *
 * Example usage:
 *
 * <HomeStackedImages>
 *   <HomeStackedImagesPrimary>
 *     <Picture url="..." />
 *   </HomeStackedImagesPrimary>
 *   <HomeStackedImagesSecondary position={SecondaryImagePosition.TOP_RIGHT}>
 *     <Picture url="..." />
 *   </HomeStackedImagesSecondary>
 *   <HomeStackedImagesCaption>
 *     Image caption
 *   </HomeStackedImagesCaption>
 * </HomeStackedImages>
 *
 * It makes sure to space and wrap the caption correctly so that it doesn't
 * overlap with the secondary image, also wraps for optimal responsiveness.
 */
import styled from '@emotion/styled';
import React, { Children, ReactElement, ReactNode } from 'react';
import { HomeImageCaption } from '../../styles';
import {
  areasToString,
  columnsToString,
  getGrid,
  getIsCaptionNextToSecondaryImage,
  getIsSecondaryTop,
} from './utils';

export enum SecondaryImagePosition {
  TOP_LEFT,
  TOP_RIGHT,
  BOTTOM_LEFT,
  BOTTOM_RIGHT,
}

export enum CaptionPosition {
  TOP,
  BOTTOM,
}

export const HomeStackedImagesCaption = ({
  children,
}: {
  children: ReactNode;
  position?: CaptionPosition;
}): ReactElement => <>{children}</>;

export const HomeStackedImagesPrimary = ({
  children,
}: {
  children: ReactNode;
  /**
   * This is a bit of a peculiar case. If you put two of
   * these stacked images below each other, and one has the secondary on the left
   * and the other on the right, you'll need to add some padding on the side of
   * the one of th primaries to the two stadcks to align.
   */
  isPadded?: boolean;
}): ReactElement => <>{children}</>;

export const HomeStackedImagesSecondary = ({
  children,
}: {
  children: ReactNode;
  position?: SecondaryImagePosition;
}): ReactElement => <>{children}</>;

const getChild = (
  children: ReactElement[],
  childType: any
): ReactElement | undefined => children.find(({ type }) => type === childType);

const getChildProp = (
  child: ReactElement | undefined,
  prop: string,
  defaultValue: any
) => (!child || !(prop in child.props) ? defaultValue : child.props[prop]);

export const HomeStackedImages = ({
  children,
}: {
  children: ReactElement | ReactElement[];
}) => {
  const arrayChildren = Children.toArray(children);
  const caption = getChild(arrayChildren, HomeStackedImagesCaption);
  const secondaryImage = getChild(arrayChildren, HomeStackedImagesSecondary);
  const primaryImage = getChild(arrayChildren, HomeStackedImagesPrimary);

  const captionPosition = getChildProp(
    caption,
    'position',
    CaptionPosition.BOTTOM
  );
  const isPrimaryImagePadded = getChildProp(primaryImage, 'isPadded', false);
  const secondaryImagePosition = getChildProp(
    secondaryImage,
    'position',
    SecondaryImagePosition.TOP_RIGHT
  );

  const { areas, columns } = getGrid(
    secondaryImagePosition,
    captionPosition,
    isPrimaryImagePadded
  );

  const isSecondaryTop = getIsSecondaryTop(secondaryImagePosition);
  const isCaptionNextToSecondaryImage = getIsCaptionNextToSecondaryImage(
    secondaryImagePosition,
    captionPosition
  );
  return (
    <Container areas={areasToString(areas)} columns={columnsToString(columns)}>
      <PrimaryImageWrapper>{primaryImage}</PrimaryImageWrapper>
      <CaptionWrapper hasLeftMargin={isCaptionNextToSecondaryImage}>
        {caption}
      </CaptionWrapper>
      <SecondaryImageWrapper isMovedUp={isSecondaryTop}>
        {secondaryImage}
      </SecondaryImageWrapper>
    </Container>
  );
};

const Container = styled.div<{
  areas: string;
  columns: string;
}>`
  display: grid;
  grid-template-columns: ${({ columns }) => columns};
  grid-template-areas: ${({ areas }) => areas};
`;

const CaptionWrapper = styled(HomeImageCaption)<{
  hasLeftMargin: boolean;
}>`
  grid-area: caption;
  align-self: flex-end;
  margin: 15px;
  font-size: 1.6rem;

  ${({ hasLeftMargin }) => !hasLeftMargin && `margin-left: 0`}
`;

const PrimaryImageWrapper = styled.div`
  grid-area: primary;
`;

const SecondaryImageWrapper = styled.div<{
  isMovedUp: boolean;
}>`
  grid-area: secondary;
  align-self: flex-end;
  // The simplest way I could think of to place the images on top of each other.
  // There's a way to do it w/ a grid layout, but it started to get really complex.
  ${({ isMovedUp }) =>
    isMovedUp
      ? `margin-bottom: -50%; align-self: flex-end;`
      : `margin-top: -50%;`}
`;
