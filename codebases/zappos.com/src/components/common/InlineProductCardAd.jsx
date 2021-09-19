import React, { useEffect } from 'react';

import { track } from 'apis/amethyst';
import { evSearchAdClick, evSearchAdView } from 'events/search';
import useMartyContext from 'hooks/useMartyContext';
import Card from 'components/common/card/Card';
import CardMedia from 'components/common/card/CardMedia';
import LandingPageLink from 'components/landing/LandingPageLink';
import { trackEvent } from 'helpers/analytics';
import { NON_ALPHA_NUMERIC_RE_GEN } from 'common/regex';

import { details, mainText, productLink, subText } from 'styles/components/common/productCard.scss';

const InlineProductCardAd = props => {
  const {
    className,
    mobilesrc,
    src,
    link,
    heading,
    subheading,
    term,
    placement,
    gae
  } = props;

  const { testId } = useMartyContext();

  const mediaProps = {
    mainImage: {
      src,
      srcSet: `${mobilesrc} 1x, ${src} 2x`
    },
    fullSizeImage: true,
    imageNoBackground: true
  };
  const productLabel = `${heading} ${subheading}`;

  const cardClick = () => {
    track(() => ([
      evSearchAdClick, { adLocation: 'SEARCH_RESULTS', searchTerm: term, advertisementType: 'INLINE_SYMPHONY_AD', endpoint: link }
    ]));
    trackEvent('TE_SEARCH_EDITORIAL_PLACEMENT_CLICK', gae || `${heading.replace(NON_ALPHA_NUMERIC_RE_GEN(), '')}-${term.replace(NON_ALPHA_NUMERIC_RE_GEN(), '')}`);
  };

  useEffect(() => {
    track(() => ([
      evSearchAdView, { adLocation: 'SEARCH_RESULTS', searchTerm: term, advertisementType: 'INLINE_SYMPHONY_AD', endpoint: link }
    ]));
  }, [term, placement, link]);

  return (
    <Card className={className}>
      <LandingPageLink
        className={productLink}
        onClick={cardClick}
        url={link}
        itemProp="url"
        data-test-id={testId('inlineProductAdLink')}>
        {productLabel}
      </LandingPageLink>
      <CardMedia {...mediaProps}/>
      <dl className={details}>
        <dt>Title</dt>
        <dd className={mainText}>{heading}</dd>
        {subheading && (
          <>
            <dt>Description</dt>
            <dd className={subText}>{subheading}</dd>
          </>
        )}
      </dl>
    </Card>
  );
};

export default InlineProductCardAd;
