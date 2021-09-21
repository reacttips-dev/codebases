import React from 'react';
import styled from '@emotion/styled';
import { CDN_PATH } from '../constants';
import { RetinaPicture } from '../../RetinaPicture';
import { DEFAULT_DROP_SHADOW } from '../styles';

const DEFAULT_PLACEHOLDER_COLOR = 'rgba(0, 0, 0, 0.3)';

export enum MarketingImageType {
  JPG,
  PNG,
}

/**
 * Just a simple component that reserves the space for responsive images
 */
export function MarketingImage({
  width,
  height,
  imagePath,
  alt,
  imageType = MarketingImageType.JPG,
  placeholderColor = DEFAULT_PLACEHOLDER_COLOR,
  isDropShadowed = true,
}: {
  width: number;
  height: number;
  alt: string;
  imagePath: string;
  imageType?: MarketingImageType;
  placeholderColor?: string;
  isDropShadowed?: boolean;
}) {
  const isPng = imageType === MarketingImageType.PNG;
  const isJpg = imageType === MarketingImageType.JPG;
  const usePlaceholderColor = isJpg ? placeholderColor : 'transparent';

  return (
    <MarketingImageContainer
      width={width}
      height={height}
      isDropShadowed={isDropShadowed}
      imageType={imageType}
      placeholderColor={usePlaceholderColor}
    >
      <RetinaPicture
        alt={alt}
        baseUrl={`${CDN_PATH}/`}
        imagePath={imagePath}
        fallbackExtension={isPng ? 'png' : 'jpg'}
      />
    </MarketingImageContainer>
  );
}

const getDropShadowCss = (imageType: MarketingImageType): string => {
  if (imageType === MarketingImageType.JPG) {
    return `box-shadow: ${DEFAULT_DROP_SHADOW};`;
  }
  // Used instead of drop-shadow so that transparent images (SVGs, PNGs) get the shadow in the right place
  return `filter: drop-shadow(${DEFAULT_DROP_SHADOW});`;
};

const MarketingImageContainer = styled.div<{
  width: number;
  height: number;
  placeholderColor: string;
  isDropShadowed: boolean;
  imageType: MarketingImageType;
}>`
  background: ${({ placeholderColor }) => placeholderColor};
  padding-bottom: ${({ width, height }) => Math.floor((height / width) * 100)}%;
  position: relative;
  ${({ isDropShadowed, imageType }) =>
    isDropShadowed ? getDropShadowCss(imageType) : ''}

  svg,
  img,
  picture {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
`;
