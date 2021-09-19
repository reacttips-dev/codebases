import { useCallback, useEffect } from 'react';

import MelodyCarousel from 'components/common/MelodyCarousel';
import MelodyCardCategory from 'components/common/melodyCard/MelodyCardCategory';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { evCategoryStreamClick, evCategoryStreamImpression } from 'events/symphony';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/melodyCategory.scss';

const stylesWithNoBackground = ['bottomAlignedWithNoBackground'];
const stylesWithBottomAligned = ['bottomAlignedWithNoBackground'];

export const MelodyCategory = ({ slotName, slotDetails, slotIndex, onComponentClick, shouldLazyLoad }) => {
  const { heading, style, categories, monetateId } = slotDetails;
  const noBackground = stylesWithNoBackground.includes(style);
  const bottomAligned = stylesWithBottomAligned.includes(style);

  useEffect(() => {
    track(() => ([evCategoryStreamImpression, { slotDetails, slotName, slotIndex, personalized: false }]));
  }, [slotDetails, slotIndex, slotName]);

  const onClick = useCallback((evt, card) => {
    onComponentClick && onComponentClick(evt);
    track(() => ([evCategoryStreamClick, { slotDetails: { ...slotDetails, ...card }, slotName, slotIndex, personalized: false }]));
  }, [onComponentClick, slotDetails, slotIndex, slotName]);

  if (categories?.length) {
    if (style === 'featureNav') {
      const altCss = {
        featureCss: css.featureCss,
        imgCss: css.imgCss
      };

      return (
        <div className={css.wrap} data-slot-id={slotName} data-monetate-id={monetateId}>
          <div className={css.items}>
            {categories.slice(0, 4).map((category, i) => {
              const { gae } = category;
              return <MelodyCardCategory
                cardData={category}
                onComponentClick={onClick}
                key={`${gae}-${i}`}
                eventLabel="melodyCategoryFeatureNav"
                melodyCardTestId="melodyCategoryFeatureNav"
                shouldLazyLoad={shouldLazyLoad}
                altCss={altCss} />;
            })}
          </div>
        </div>);
    }
    return (
      <div className={css.wrap} data-slot-id={slotName} data-monetate-id={monetateId}>
        {heading && (
          <h2 className={css.heading}>
            {heading}
          </h2>
        )}
        <MelodyCarousel>
          {categories.map((category, i) => {
            const { gae } = category;
            return <MelodyCardCategory
              cardData={category}
              onComponentClick={onClick}
              key={`${gae}-${i}`}
              eventLabel="melodyCategory"
              melodyCardTestId="melodyCategory"
              shouldLazyLoad={shouldLazyLoad}
              bottomAligned={bottomAligned}
              noBackground={noBackground}/>;
          })}
        </MelodyCarousel>
      </div>
    );
  } else {
    return false;
  }
};

export default withErrorBoundary('MelodyCategory', MelodyCategory);
