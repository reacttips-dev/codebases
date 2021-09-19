import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { evFacetClick } from 'events/search';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { FILTERS_RE } from 'common/regex';
import { trackEvent } from 'helpers/analytics';
import { track } from 'apis/amethyst';
import useMartyContext from 'hooks/useMartyContext';
import useWindowSize from 'hooks/useWindowSize';

import styles from 'styles/components/search/compactSingleSelects.scss';

export const CompactSingleSelects = ({ filters, className, hasAutoScroll, removePersonalizedSize, handlePillClick, hydraAutoFacetSuggestion }) => {
  const { testId, router, marketplace: { search: { maxPills } } } = useMartyContext();
  const breadcrumbWrapper = useRef();
  const [scrollingBreadcrumbs, setScrollingBreadcrumbs] = useState(false);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const { width: windowWidth } = useWindowSize();

  const { scrollLeft, scrollWidth, clientWidth } = breadcrumbWrapper.current || {};
  const maxScroll = scrollWidth - clientWidth;
  const selectionTitle = filters.breadcrumbs.length || !hydraAutoFacetSuggestion ? 'Your Selections' : 'Suggested Filters';
  const hidePills = !hydraAutoFacetSuggestion || hydraAutoFacetSuggestion === 3;

  useEffect(() => {
    if (windowWidth && breadcrumbWrapper.current) {
      setShowScrollButtons(hasAutoScroll && scrollWidth - clientWidth > 0);
    }
  }, [windowWidth, hasAutoScroll, scrollWidth, clientWidth]);

  if (!filters.breadcrumbs.length && (hidePills || !filters?.pills?.recommendations?.length)) {
    return null;
  }

  const makeBreadcrumbClickHandler = crumb => e => {
    e.preventDefault();
    if (filters?.personalizedSize?.sizes?.includes(crumb.name)) {
      removePersonalizedSize();
    }
    router.forceBrowserPush(crumb.removeUrl);
    track(() => ([
      evFacetClick, {
        breadcrumbRemove: crumb,
        facetClickSource: 'FACET_PILLS',
        selected: false,
        deselected: true
      }
    ]));
  };

  const makeCrumbContent = (crumb, isSingleSelect) => {
    const crumbTitle = `Remove ${crumb.name} filter`;
    return (
      <a // eslint-disable-line jsx-a11y/anchor-is-valid
        href={!FILTERS_RE.test(crumb.removeUrl) ? crumb.removeUrl : ''}
        aria-label={crumbTitle}
        data-singleselect={isSingleSelect}
        tabIndex={0}
        onClick={makeBreadcrumbClickHandler(crumb)}
        data-test-id={testId('singleSelectBreadcrumb')}>
        {crumb.name}
      </a>
    );
  };

  const onPillClick = (crumb, index) => {
    if (breadcrumbWrapper.current) {
      breadcrumbWrapper.current.scrollLeft = 0;
    }

    handlePillClick(crumb, index);
    trackEvent('TE_SEARCH_PILLCLICKED', `${crumb.name}:${crumb.value}`);
    track(() => ([
      evFacetClick, { crumb, facetClickSource: 'FACET_PILLS', selected: true, deselected: false }
    ]));
  };

  const makePillMarkup = () => {
    const breadCrumbs = filters.breadcrumbs.map(crumb => {
      const { name, removeUrl } = crumb;
      const isSingleSelect = Object.keys(filters.selected.singleSelects).some(e => filters.selected.singleSelects[e][0] === name);
      return (
        <li key={`${removeUrl}-${name}`} className={cn({ [styles.onSaleFacet]: name === 'On Sale', [styles.defaultTerm]: name === 'Search' })}>
          {makeCrumbContent(crumb, isSingleSelect)}
        </li>
      );
    });

    const makePills = filters?.pills?.recommendations.map((crumb, i) => {
      if (i < (maxPills + 1)) {
        return (
          <li key={`${crumb.value}-${crumb.name}`} className={styles.pills}>
            <button
              type="button"
              key={i}
              onClick={() => onPillClick(crumb, i)}
              aria-label={`Select ${crumb.value} filter`}>
              {crumb.value}
            </button>
          </li>
        );
      }
    });
    return breadCrumbs.concat(makePills);
  };

  const scrollBreadCrumbs = (isScrollingLeft, scrollTo) => {
    if (breadcrumbWrapper.current) {
      const { current: { scrollLeft } } = breadcrumbWrapper;
      setScrollingBreadcrumbs(true);
      if ((isScrollingLeft && scrollLeft > scrollTo) || (!isScrollingLeft && scrollLeft < scrollTo)) {
        breadcrumbWrapper.current.scrollLeft += isScrollingLeft ? -20 : 20;
        setTimeout(scrollBreadCrumbs, 10, isScrollingLeft, scrollTo);
      } else {
        setScrollingBreadcrumbs(false);
      }
    }
  };

  const onScrollBreadcrumbs = e => {
    const { current: { scrollLeft, clientWidth } } = breadcrumbWrapper;

    if (scrollingBreadcrumbs) {
      e.preventDefault();
    } else {
      const isScrollingLeft = e.target.className === styles.leftScroll;
      let scrollTo = scrollLeft + clientWidth < maxScroll ? scrollLeft + clientWidth : maxScroll;

      if (isScrollingLeft) {
        scrollTo = scrollLeft - clientWidth > 0 ? scrollLeft - clientWidth : 0;
      }

      scrollBreadCrumbs(isScrollingLeft, scrollTo);
    }
  };

  return (
    <div className={cn(styles.compactSingleSelects, className || null, { [styles.hasAutoScroll]: hasAutoScroll, [styles.pillsCompactSingleSelects]: hasAutoScroll })} data-test-id={testId('breadcrumbScroll')}>
      <h2 className={styles.selectionText} data-test-id={testId('breadcrumbTitle')}>{selectionTitle}</h2>
      {showScrollButtons && <button
        type="button"
        onMouseDown={onScrollBreadcrumbs}
        tabIndex="-1"
        disabled={scrollLeft <= 0}
        className={styles.leftScroll}
        data-test-id={testId('leftBreadcrumbScroll')}>Left Scroll</button>}
      <ul id="searchSelectedFilters" ref={breadcrumbWrapper} data-test-id={testId('breadcrumbContainer')}>
        {makePillMarkup()}
      </ul>
      {showScrollButtons && <button
        type="button"
        onMouseDown={onScrollBreadcrumbs}
        tabIndex="-1"
        disabled={scrollLeft === maxScroll}
        className={styles.rightScroll}
        data-test-id={testId('rightBreadcrumbScroll')}>Right Scroll</button>}
    </div>
  );
};

export default withErrorBoundary('CompactSingleSelects', CompactSingleSelects);
