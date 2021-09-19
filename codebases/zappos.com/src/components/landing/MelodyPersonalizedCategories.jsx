import { connect } from 'react-redux';
import { useCallback, useEffect } from 'react';

import { trackEvent } from 'helpers/analytics';
import MelodyCarousel from 'components/common/MelodyCarousel';
import MelodyCardCategory from 'components/common/melodyCard/MelodyCardCategory';
import { evCategoryStreamClick, evCategoryStreamImpression } from 'events/symphony';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { track } from 'apis/amethyst';

import css from 'styles/components/landing/melodyPersonalizedCategories.scss';

export const MelodyPersonalizedCategories = ({ firstName, slotName, slotDetails, slotIndex, onComponentClick, shouldLazyLoad }) => {
  const { categories, monetateId } = slotDetails;

  useEffect(() => {
    trackEvent('TE_PERSONALIZED_CATEGORIES_VIEW', `slotIndex:${slotIndex}`);
    track(() => ([evCategoryStreamImpression, { slotDetails, slotIndex, slotName, personalized: true }]));
  }, [slotDetails, slotIndex, slotName]);

  const handleClick = useCallback((e, card) => {
    trackEvent('TE_PERSONALIZED_CATEGORIES_CLICK', `slotIndex:${slotIndex}`);
    onComponentClick && onComponentClick(e);
    track(() => ([evCategoryStreamClick, { slotDetails: { ...slotDetails, ...card }, identifier: card?.name, slotIndex, slotName, personalized: true }]));
  }, [onComponentClick, slotDetails, slotIndex, slotName]);

  if (categories?.length) {
    return (
      <div className={css.wrap} data-slot-id={slotName} data-monetate-id={monetateId}>
        <h2 className={css.heading}>
          {Boolean(firstName) && `${firstName}, `}You Might Like These Categories.
        </h2>
        <MelodyCarousel>
          {categories.map((category, index) => (
            <MelodyCardCategory
              cardData={category}
              onComponentClick={handleClick}
              key={index}
              eventLabel="melodyPersonalizedCategories"
              melodyCardTestId="melodyPersonalizedCategories"
              shouldLazyLoad={shouldLazyLoad} />
          ))}
        </MelodyCarousel>
      </div>
    );
  } else {
    return null;
  }
};

function mapStateToProps(state) {
  return {
    firstName: state.holmes?.firstName
  };
}

const ConnectedMelodyPersonalizedCategories = connect(mapStateToProps)(MelodyPersonalizedCategories);
export default withErrorBoundary('ConnectedMelodyPersonalizedCategories', ConnectedMelodyPersonalizedCategories);
