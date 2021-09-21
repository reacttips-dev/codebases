import React from 'react';
import { WarningBannerElement } from './styles';

interface WarningBannerProps {
  bannerText: string;
}

export const WarningBanner = ({ bannerText }: WarningBannerProps) => {
  return (
    <WarningBannerElement>
      <span>{bannerText}</span>
    </WarningBannerElement>
  );
};
