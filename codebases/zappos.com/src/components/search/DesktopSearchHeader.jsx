import React, { useCallback, useEffect, useState } from 'react';
import sanitizer from 'sanitizer';
import cn from 'classnames';

import Sort from 'components/search/Sort';
import { retrieveH1TagFromFilters } from 'helpers/SeoOptimizedDataHelper';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { SEARCH_PAGE } from 'constants/amethystPageTypes';
import FeatureFeedback from 'components/FeatureFeedback';
import Tooltip from 'components/common/Tooltip';
import useFocusTrap from 'hooks/useFocusTrap';
import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/search/desktopSearchHeader.scss';

export const DesktopSearchHeader = ({ totalProductCount, onSortSelected, filters, trustedRetailers, onToggleFacetsContainer, isFacetsVisible, makePersonalizedSortToggle }) => {
  const { testId, marketplace: { search: { sortOptions, showSearchFeedback, hasCrossSiteSearches, useAutoCorrect } } } = useMartyContext();
  const [ tooltipVisible, setTooltipVisible] = useState(false);
  const { sort, originalTerm, autocorrect, honeTag, selected, pageCount } = filters;
  const shouldShowAutocorrect = useAutoCorrect && autocorrect?.termBeforeAutocorrect;

  const headerProps = {
    'className': css.heading,
    'data-test-id': testId('desktopSearchResultsText')
  };

  let subHeadingText = !!totalProductCount && `${totalProductCount} items found`;

  let pageMainHeader = <h1
    {...headerProps}
    dangerouslySetInnerHTML={{
      '__html': sanitizer.sanitize(retrieveH1TagFromFilters(filters))
    }}/>;

  if (shouldShowAutocorrect) {
    const headingContent = <>Showing {totalProductCount} Results for <strong>"{honeTag}"</strong></>;

    pageMainHeader = !!totalProductCount && <h1 {...headerProps}>{headingContent}</h1>;
    subHeadingText = autocorrect.termBeforeAutocorrect ? (
      <>
        We couldn't find an exact result for <strong>"{autocorrect.termBeforeAutocorrect}"</strong>
      </>
    ) : '';
  }

  useEffect(() => {
    // original term Changed
    setTooltipVisible(false);
  }, [originalTerm]);

  const tooltipClick = () => {
    const element = document.getElementById('feedbackRequest');
    if (element.getAttribute('aria-expanded') === 'true') {
      element.setAttribute('aria-expanded', 'false');
    } else {
      element.setAttribute('aria-expanded', 'true');
    }
    setTooltipVisible(tooltipVisible ? false : true);
  };

  const closeFeedback = () => {
    setTooltipVisible(false);
  };

  const handleKeydown = useCallback(e => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      closeFeedback();
    }
  }, []);

  const makeFilterControl = () => {
    if (shouldRenderControl() || hasCrossSiteSearches && trustedRetailers.length) {
      return (
        <button
          type="button"
          className={css.filters}
          data-test-id={testId('filterButton')}
          onClick={onToggleFacetsContainer}>
          {makeFilterText()}
        </button>
      );
    }
    return null;
  };

  const makeRenderedCount = () => {
    const multiCount = Object.values(filters.selected.multiSelects).reduce((count, { length }) => count + length, 0);
    return multiCount ? ` (${multiCount})` : '';
  };

  const makeFilterText = () => (isFacetsVisible ? 'Close Filters' : `Filter${makeRenderedCount()}`);

  const shouldRenderControl = () => pageCount > 0 || (pageCount === 0 && Object.keys(selected.multiSelects).length);

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [handleKeydown]);

  const tooltipRef = useFocusTrap({ shouldFocusFirstElement: true, active: tooltipVisible });

  function makeSearchFeedback() {
    return (
      <div ref={tooltipRef} className={css.tooltipWrap}>
        <Tooltip
          tooltipId="searchFeedback"
          tooltipClassName={css.tooltip}
          contentClassName={css.content}
          mobileWrapper={css.mobileContainer}
          mobileClass={css.mobileEncompasss}
          direction="right"
          clickable={true}
          clickOpen={tooltipVisible}
          content={
          <>
            <header>
              {/* following eslint-disable is for accessibility */}
              <h3 // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
                tabIndex={0}
                id="feedBackTitle">Let us know your feedback!</h3>
              <button
                type="button"
                value="close"
                className={css.close}
                aria-label="Close"
                onClick={() => closeFeedback()}>
              </button>
            </header>
            <FeatureFeedback
              isYesNoOnly={true}
              autoOpenOnYesNoClick={true}
              completionMessage="Thank you!"
              feedbackQuestion="Did you find what you were looking for?"
              feedbackType="SEARCH_RELEVANCY_FEEDBACK"
              pageType={SEARCH_PAGE}
              source="search"
              wrapperClass={css.feedbackWrapper}
              yesNoWrapperClass={css.feedbackYesNoWrapper}
            />
          </>
          }>
        </Tooltip>
      </div>);
  }

  const makeSortControl = (availableSortOptions = sortOptions) => {
    if (shouldRenderControl() && !isFacetsVisible) {
      return (
        <>
          <Sort
            className={css.sortWrapper}
            sortId="searchSort"
            sortOptions={availableSortOptions}
            onSortSelected={onSortSelected}
            selectedSort={sort}
            filters={filters}
            testId={testId('selectSortValue')}
          />
          <span className={css.hpsMessage}>
            {makePersonalizedSortToggle && makePersonalizedSortToggle('bestForYouMessaging')}
          </span>
        </>
      );
    }
    return null;
  };

  return (
    <div className={css.desktopSearchHeader}>
      <div className={cn(css.leftCol, { [css.auto]: useAutoCorrect, [css.corrected]: shouldShowAutocorrect })}>
        {pageMainHeader}
        <span className={css.subheading} data-test-id={testId('searchResultsItemCount')}>
          {subHeadingText}
        </span>
        {showSearchFeedback && (
          <>
            <button
              type="button"
              className={css.feedbackButton}
              onClick={tooltipClick}
              aria-expanded="false"
              id="feedbackRequest"
              data-test-id={testId('searchFeedbackButton')}>
                Have Feedback?
            </button>
            {makeSearchFeedback()}
          </>
        )}
      </div>
      <span className={css.rightCol}>
        {makeSortControl()}
        {makeFilterControl()}
      </span>
    </div>
  );
};

DesktopSearchHeader.displayName = 'DesktopSearchHeader';
export default withErrorBoundary('DesktopSearchHeader', DesktopSearchHeader);
