import React, { ReactNode } from 'react';

type Graphic = {
  src: string;
  width: number;
  height: number;
};

const BrandingCircle: Graphic = {
  src: 'https://d2j5ihb19pt1hq.cloudfront.net/enterprise/BrandingCircle.svg',
  width: 85,
  height: 85,
};
const BrandingHalfCircle: Graphic = {
  src: 'https://d2j5ihb19pt1hq.cloudfront.net/enterprise/BrandingHalfCircle.svg',
  width: 144,
  height: 72,
};
const BrandingPattern: Graphic = {
  src: 'https://d2j5ihb19pt1hq.cloudfront.net/enterprise/BrandingPattern.png',
  width: 131,
  height: 165,
};
const Dots: Graphic = {
  src: 'https://d2j5ihb19pt1hq.cloudfront.net/enterprise/Dots.svg',
  width: 69,
  height: 91,
};
const OrganicShape: Graphic = {
  src: 'https://d2j5ihb19pt1hq.cloudfront.net/enterprise/OrganicShape.svg',
  width: 165,
  height: 99,
};
const OrganicShape3: Graphic = {
  src: 'https://d2j5ihb19pt1hq.cloudfront.net/enterprise/OrganicShape3.svg',
  width: 116,
  height: 101,
};

type GraphicPosition = {
  graphic: Graphic;
  key: string;
  top?: number;
  left?: number;
  bottom?: number;
  right?: number;
  transform?: string;
};

function render({ graphic, key, top, left, bottom, right, transform }: GraphicPosition): ReactNode {
  return (
    <img
      key={key}
      className="OnboardingModal-Graphic"
      src={graphic.src}
      width={graphic.width}
      height={graphic.height}
      style={{
        top,
        left,
        bottom,
        right,
        transform,
      }}
      alt=""
    />
  );
}

export const PageGraphics: ReactNode[][] = [
  [
    render({
      graphic: OrganicShape,
      key: OrganicShape.src,
      top: 54,
      left: 27,
    }),
    render({
      graphic: BrandingCircle,
      key: BrandingCircle.src,
      bottom: 24,
      right: 115,
    }),
    render({
      graphic: Dots,
      key: Dots.src,
      bottom: 95,
      right: 30,
    }),
  ],
  [
    render({
      graphic: BrandingHalfCircle,
      key: BrandingHalfCircle.src,
      top: 0,
      right: 97,
    }),
    render({
      graphic: BrandingPattern,
      key: BrandingPattern.src,
      top: 0,
      right: 38,
    }),
  ],
  [
    render({
      graphic: BrandingHalfCircle,
      key: BrandingHalfCircle.src,
      bottom: 132,
      right: -36,
      transform: 'rotate(90deg)',
    }),
    render({
      graphic: OrganicShape,
      key: OrganicShape.src,
      bottom: 31,
      right: 72,
      transform: 'rotate(30deg)',
    }),
  ],
  [
    render({
      graphic: Dots,
      key: Dots.src,
      bottom: 0,
      right: 162,
    }),
    render({
      graphic: BrandingCircle,
      key: BrandingCircle.src,
      bottom: 45,
      right: 48,
      transform: 'rotate(180deg)',
    }),
  ],
  [
    render({
      graphic: BrandingHalfCircle,
      key: BrandingHalfCircle.src,
      bottom: 0,
      right: 197,
      transform: 'rotate(180deg)',
    }),
    render({
      graphic: BrandingHalfCircle,
      key: BrandingHalfCircle.src + '-2',
      top: 108,
      right: -36,
      transform: 'rotate(90deg)',
    }),
    render({
      graphic: Dots,
      key: Dots.src,
      top: 61,
      right: 83,
    }),
  ],
  [
    render({
      graphic: OrganicShape3,
      key: OrganicShape3.src,
      top: 90,
      left: 24,
    }),
    render({
      graphic: BrandingCircle,
      key: BrandingCircle.src,
      bottom: 24,
      right: 120,
    }),
  ],
];
