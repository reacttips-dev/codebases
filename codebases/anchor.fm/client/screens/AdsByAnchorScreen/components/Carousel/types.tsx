import React from 'react';

export const UPDATE_NEXT_ACTIVE_AD_INDEX = 'UPDATE_NEXT_ACTIVE_AD_INDEX';
export const ROTATE_SLIDE_INDEX_ARRAY = 'ROTATE_SLIDE_INDEX_ARRAY';
export const CLICK_EVENT = 'CLICK_EVENT';
export const TOUCH_START_EVENT = 'TOUCH_START_EVENT';
export const TOUCH_MOVE_EVENT = 'TOUCH_MOVE_EVENT';
export const TOUCH_END_EVENT = 'TOUCH_END_EVENT';

export type CarouselReducerActionProps =
  | {
      type: typeof UPDATE_NEXT_ACTIVE_AD_INDEX;
      value: number;
    }
  | { type: typeof ROTATE_SLIDE_INDEX_ARRAY }
  | { type: typeof CLICK_EVENT; value: number }
  | { type: typeof TOUCH_START_EVENT; value: number }
  | { type: typeof TOUCH_MOVE_EVENT; value: number }
  | { type: typeof TOUCH_END_EVENT; value: number };

export type AdBody = {
  language: string;
  svg: (screenType: string) => React.ReactNode;
};

export type AdStat = {
  body: string;
  link: string;
  subtext: string;
  title: string;
};

export type AdType = {
  description: string;
  type: React.ReactNode;
};

export type Ad = {
  adType: AdType;
  body: AdBody;
  stats: AdStat[];
  title: string;
};

export type CarouselSlideProps = {
  activeAdIndex: number;
  ad: Ad;
  index: number;
  rotatingAdIndex: number;
  slideIndexArray: number[];
};

export type CarouselStateProps = {
  activeAdIndex: number;
  activeSlide: Ad;
  didTouchRun: boolean;
  isRotating: boolean;
  nextActiveAdIndex: number;
  rotatingAdIndex: number;
  slideIndexArray: number[];
  touchEnd: number;
  touchStart: number;
};

export type CarouselNavProps = {
  activeAdIndex: number;
  setNextActiveAdIndex: ({
    type,
    value,
  }: {
    type: typeof UPDATE_NEXT_ACTIVE_AD_INDEX;
    value: number;
  }) => void;
};

export type CarouselStatsProps = {
  stats: AdStat[];
};

export type CarouselTypeProps = {
  adType: AdType;
};
