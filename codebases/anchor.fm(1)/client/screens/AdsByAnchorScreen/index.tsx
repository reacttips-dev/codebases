import React from 'react';
import { Global } from '@emotion/core';
import { Footer } from 'client/components/Footer';
import {
  Header,
  BrandPartners,
  Carousel,
  FAQ,
  Glossary,
  Quote,
  SellingPoints,
  Video,
} from 'client/screens/AdsByAnchorScreen/components';
import { MarketingHeaderBackground } from 'client/components/MarketingPagesShared/MarketingHeaderBackground';
import { COLOR_GREEN } from 'client/components/MarketingPagesShared/styles';
import { hexToRgb, rgbToRgbaString } from 'client/modules/ColorUtils';
import { adsByAnchorPageStyles } from './styles';

const headerColor = rgbToRgbaString(hexToRgb(COLOR_GREEN)!);

export function AdsByAnchorScreen() {
  return (
    <>
      <Global styles={adsByAnchorPageStyles} />
      <MarketingHeaderBackground color={headerColor} />
      <main>
        <Header />
        <SellingPoints />
        <Video />
        <Carousel />
        <Quote />
        <BrandPartners />
        <FAQ />
        <Glossary />
      </main>
      <Footer />
    </>
  );
}
