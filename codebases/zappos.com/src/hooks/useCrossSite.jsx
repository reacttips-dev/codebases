/* eslint css-modules/no-unused-class: [2, { markAsUsed: ['modal'] }] */
import React, { useState } from 'react';
import cn from 'classnames';
import queryString from 'query-string';

import { evSearchCrossSiteRecoClick } from 'events/recommendations';
import { track } from 'apis/amethyst';
import useMartyContext from 'hooks/useMartyContext';
import { constructMSAImageUrl } from 'helpers';
import MelodyCarousel from 'components/common/MelodyCarousel';
import { crossSiteSellingUniqueIdentifier } from 'helpers/SearchUtils';
import { XSLL_EXCLUDED_PRODUCT_IMAGES } from 'constants/appConstants';

import css from 'styles/components/search/crossSiteProducts.scss';

const PRODUCT_IMAGE_SIZE = 450;
const MSA_IMAGE_DIMENSION = { width: PRODUCT_IMAGE_SIZE, height: PRODUCT_IMAGE_SIZE };

const useCrossSite = product => {
  const { testId, marketplace: { crossSiteQsParam, domain, search: { hasCrossSiteSearches } } } = useMartyContext();
  const [visible, setVisible] = useState(false);
  const { content, imageMap, storeName, term, productSeoUrl } = product;
  const crossSiteModal = content?.Global?.slotData?.[`${storeName}XsModal`] || {};
  const hasCrossSiteData = Object.keys(crossSiteModal).length;

  const handleClickCard = e => {
    if (hasCrossSiteData) {
      e.preventDefault();
      track(() => ([
        evSearchCrossSiteRecoClick, { product }
      ]));
      setVisible(true);
    }
  };

  const dismissModal = () => setVisible(false);

  const handleClick = e => {
    const element = e.target;
    if (['A', 'BUTTON'].includes(element.tagName)) {
      const isLink = element.tagName === 'A';
      const crossSiteQueryParams = '?' + queryString.stringify({
        'utm_medium': 'p2p',
        'utm_campaign': `${domain}_redirect`,
        'utm_term': term,
        [crossSiteQsParam]: crossSiteSellingUniqueIdentifier
      });

      if (isLink) {
        element.href += crossSiteQueryParams;
        element.target = '_blank';
      }

      track(() => ([
        evSearchCrossSiteRecoClick, { product: { ...product, crossSiteSellingUniqueIdentifier }, proceedToTrustedRetailer: isLink }
      ]));
      dismissModal();
    }
  };

  const makeProductImage = () => {
    const classes = { itemsContainer: css.itemsContainer, fullHeight: css.fullHeight };
    const arrowStyleOverrides = { top: '50%' };
    const images = Object.entries(imageMap)
      .filter(([key]) => !XSLL_EXCLUDED_PRODUCT_IMAGES.includes(key))
      .sort(([key]) => (key === 'MAIN' ? -1 : 0))
      .map(([key, imageId]) => <div key={imageId} className={css.imageContainer}>
        <img src={constructMSAImageUrl(imageId, MSA_IMAGE_DIMENSION)} alt={key} />
      </div>);

    return <MelodyCarousel classes={classes} arrowStyleOverrides={arrowStyleOverrides}>
      {images}
    </MelodyCarousel>;
  };

  const makeContent = () => {
    const { cancelCta, copy, cta, heading, subheading } = crossSiteModal;

    return (
      <>
        <section className={css.modalCarousel}>{makeProductImage()}</section>
        {/* eslint-disable-next-line */}
        <section className={cn(css.modalContent, css.pointer)} onClick={handleClick}>
          <h2 dangerouslySetInnerHTML={{ __html: heading }}/>
          <p dangerouslySetInnerHTML={{ __html: subheading }}/>
          <p dangerouslySetInnerHTML={{ __html: copy }}/>
          <div className={css.modalBtnContainer}>
            <a
              data-test-id={testId('searchResultsCrossSiteModalContinue')}
              className={css.btnContinue}
              href={productSeoUrl}
              target="_blank"
              rel="noopener noreferrer">
              {cta}
              {/* button to go to other marketplace */}
            </a>
            <button
              data-test-id={testId('searchResultsCrossSiteModalStay')}
              type="button"
              className={css.btnStay}>
              {cancelCta}
              {/* button to stay on current marketplace */}
            </button>
          </div>
        </section>
      </>
    );
  };

  return {
    onClick: storeName ? handleClickCard : null,
    closeClick: dismissModal,
    additionalLinkProps: hasCrossSiteSearches && !hasCrossSiteData ? { target: '_blank' } : {},
    content: hasCrossSiteSearches && storeName && hasCrossSiteData ? makeContent() : null,
    visible: !!visible
  };
};

export default useCrossSite;
