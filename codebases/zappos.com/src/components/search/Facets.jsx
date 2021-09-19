import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import Immutable from 'seamless-immutable';
import ExecutionEnvironment from 'exenv';

import { BEST_FOR_YOU_FACETFIELD, SINGLE_SELECT_FILTERS } from 'constants/appConstants';
import { evFacetClick } from 'events/search';
import FacetAutoComplete from 'components/common/AutoComplete';
import { NOFOLLOW_FACET_RE } from 'common/regex';
import { trackEvent } from 'helpers/analytics';
import { track } from 'apis/amethyst';
import Tooltip from 'components/common/Tooltip';
import { MoreInfo } from 'components/icons';
import MultiSelectFilters from 'components/search/MultiSelectFilters';
import Sort from 'zen/components/search/Sort';
import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import { savedValuesMatch } from 'helpers/SearchUtils';
import TrustedRetailerBanner from 'components/common/TrustedRetailerBanner';
import { onEvent } from 'helpers/EventHelpers';

import css from 'styles/components/search/facets.scss';

export class Facets extends Component {
  static displayName = 'Facets';

  componentDidMount() {
    // Handle key events for closing facet
    if (ExecutionEnvironment.canUseDOM) {
      onEvent(window, 'keydown', this.handleKeyDown, null, this);
    }
  }

  shouldComponentUpdate(nextProps) {
    const { facets, filters, filters: { savedsizes }, autoComplete, mobileSortToggled } = this.props;
    const { facets: nextFacets, filters: nextFilters, filters: { savedsizes: newSavedSizeFilters }, autoComplete: nextAutoComplete, mobileSortToggled: nextMobileSortToggled } = nextProps;
    return nextFacets !== facets ||
    nextFilters !== filters ||
    nextAutoComplete !== autoComplete ||
    nextMobileSortToggled !== mobileSortToggled ||
    !!savedsizes && (Object.keys(savedsizes.filters).length !== Object.keys(newSavedSizeFilters.filters).length);
  }

  // By binding handleFacetSelect is executed in the context of the Facets Component
  handleFacetSelect(facetGroup, facetName, selectedFacetGroupIndex, selectedFacetIndex, isSelected, section, e) {
    const { hasAutoComplete, autoComplete, onFacetSelect } = this.props;
    // This is executed in the context of the Search Component because it's bound to it in its constructor function
    onFacetSelect(facetGroup, facetName, selectedFacetGroupIndex, selectedFacetIndex, null, section);
    // Track for Amethyst
    track(() => ([
      evFacetClick, {
        facetGroup,
        facetName,
        facetClickSource: 'LEFT_HAND_FACET_NAV',
        selected: !isSelected,
        deselected: !!isSelected
      }
    ]));

    // track if autocomplete used for this group
    if (hasAutoComplete && autoComplete[facetGroup]?.text) {
      trackEvent('TE_SEARCH_AUTOCOMPLETE', `${facetGroup}:${autoComplete[facetGroup].text}`);
    }

    /*
     * This preventDefault stops the link from being followed and instead allows
     * the facet updates to be handled through the state. If you remove this,
     * you'll see multiple search API requests occurring for a single facet
     * click which is not desirable.
     */
    e.preventDefault();
    return false;
  }

  handleKeyDown = e => {
    const { facetDone } = this.props;
    if (e.key === 'Escape' || e.key === 'Esc') {
      facetDone();
    }
  };

  checkIfFacetCheckbox(symbolicSizingField, facetField) {
    return !symbolicSizingField && !SINGLE_SELECT_FILTERS[facetField];
  }

  renderFacetHead(facetGroup, isExpanded, section) {
    const { filterBrandDesigner } = this.props;
    const { testId } = this.context;
    const { facetFieldDisplayName } = facetGroup;
    const displayName = filterBrandDesigner && facetFieldDisplayName === 'Brand' ? 'Designer' : facetFieldDisplayName;
    return (
      <h3 className={css.facetGroupName} id={facetGroup.facetField}>
        <button
          type="button"
          className={css.facetGroupHead}
          aria-expanded={isExpanded}
          data-selected-facet-group-name={facetGroup.facetField}
          data-selected-facet-section={section}
          data-test-id-facet-head-name={displayName}
          data-test-id={testId('facetGroupHeadTestId')}
          onClick={this.props.onFacetGroupSelect}>
          {displayName}
          {this.renderFacetSelections(facetGroup)}
          <span className={css.chevronRight}/>
        </button>
        <span className={css.facetTooltipWrapper}>
          {facetGroup.facetField === BEST_FOR_YOU_FACETFIELD && (
            <Tooltip
              tooltipId="bestForYou"
              wrapperClassName={css.tooltipWrapper}
              tooltipClassName={css.tooltip}
              direction="right"
              content={'We\'re blending your feedback, recent purchases, and shopping behavior to perfect your searches. Hooray!'}>
              <MoreInfo/>
            </Tooltip>
          )}
        </span>
      </h3>
    );
  }

  makeFacetCount(count) {
    if (count) {
      return <span className={css.facetCount} aria-label={`${count} products available`}>({count})</span>;
    }
    return null;
  }

  renderFacetSelections(facetGroup) {
    const { filters: { selected: { singleSelects, multiSelects }, personalizedSize } } = this.props;
    let foundSelections = null;

    if (facetGroup.facetField === BEST_FOR_YOU_FACETFIELD && personalizedSize?.facets?.[0]?.selected) {
      foundSelections = [`${personalizedSize.facets[0].name} (${personalizedSize.sizes[0]}-${personalizedSize.sizes[personalizedSize.sizes.length - 1]})`];
    } else {
      foundSelections = singleSelects[facetGroup.facetField] || multiSelects[facetGroup.facetField];
    }

    if (foundSelections) {
      const sortedFoundSelections = Immutable.asMutable(foundSelections).sort().join(', ');
      return <span className={css.facetSelection}>{sortedFoundSelections}</span>;
    }
  }

  makeFacetValues(facetGroup, shouldRenderAutoComplete) {
    const { autoComplete } = this.props;
    return (shouldRenderAutoComplete && autoComplete && autoComplete[facetGroup.facetField] && autoComplete[facetGroup.facetField].values) || facetGroup.values;
  }

  makeListOptions(facetGroup, index, isExpanded, section) {
    const { testId } = this.context;
    const { autoCompleteMinValues, filters, hasAutoComplete } = this.props;
    const shouldRenderAutoComplete = hasAutoComplete && facetGroup.values.length > autoCompleteMinValues;
    const { checkIfFacetCheckbox, handleFacetSelect, makeFacetCount } = this;
    const relType = NOFOLLOW_FACET_RE.test(facetGroup.facetField) ? 'nofollow' : undefined;
    const isCheckbox = checkIfFacetCheckbox(facetGroup.symbolicSizingField, facetGroup.facetField);
    const facetValues = this.makeFacetValues(facetGroup, shouldRenderAutoComplete);
    return facetValues.map((facet, j) => {
      const facetSelected = facetGroup.facetField === BEST_FOR_YOU_FACETFIELD ? filters.personalizedSize?.facets?.[0]?.selected : facet.selected;
      return (
        <li key={facet.name} className={cn({ [css.selectedFacet]: facetSelected })} data-test-id={testId(`facet-${facet.displayName}`)}>
          <a
            rel={facet.facetUrl ? relType : undefined}
            tabIndex={!facet.facetUrl ? 0 : null} // necessary since links without a href aren't keyboard focusable
            className={cn({ [css.facetBox]: facetGroup.symbolicSizingField, [css.hasCheckbox]: isCheckbox })}
            href={facet.facetUrl}
            onKeyPress={handleFacetSelect.bind(this, facetGroup.facetField, facet.name, index, j, facetSelected, section)}
            onClick={handleFacetSelect.bind(this, facetGroup.facetField, facet.name, index, j, facetSelected, section)}
            data-test-id={testId('facetBox')}>
            <span data-test-id={testId('facetName')}>
              {facet.displayName === 'One Size' ? 'OS' : facet.displayName}
            </span>
            {makeFacetCount(facet.count)}
          </a>
        </li>
      );
    });
  }

  makeSaveSizeFeature = (facetField, facetFieldDisplayName) => {
    const { isCustomer, onSaveSizeClick, onResetSizeClick, filters: { savedsizes, selected } } = this.props;
    const isSavedCategory = savedsizes?.filters?.[facetField];
    let content = null;
    if (isSavedCategory) {
      const hasPossibleSaveValue = selected.multiSelects?.[facetField]?.length;
      const savedFacets = savedsizes?.filters?.[facetField];
      const displayName = facetFieldDisplayName.toLowerCase();
      const savedFiltersMatchChosen = savedValuesMatch(savedFacets, selected.multiSelects[facetField]);
      if (isCustomer && savedFacets.length && savedFiltersMatchChosen) {
        const buttonText = `Saved ${displayName}(s): ${savedsizes.filters[facetField].join(' & ')}`;
        content = (
          <>
            <span id="resetDescription" data-test-id="resetDescriptionText">{buttonText}</span>
            <button
              type="button"
              aria-describedby="resetDescription"
              data-test-id="resetDescriptionButton"
              onClick={onResetSizeClick.bind(this, facetField)}>
              Reset
            </button>
          </>
        );
      } else if (hasPossibleSaveValue) {
        const buttonText = `Save ${displayName}(s) for future searches?`;
        content = (
          <>
            <span id="saveDescription" data-test-id="saveDescriptionText">{buttonText}</span>
            <button
              type="button"
              aria-describedby="saveDescription"
              data-test-id="saveDescriptionButton"
              onClick={onSaveSizeClick}>
              Save
            </button>
          </>
        );
      }

      if (content) {
        return (
          <div className={css.saveFacets}>
            {content}
          </div>
        );
      }
    }
    return null;
  };

  makeSavedFiltersToggleText = () => {
    const { filters: { savedsizes }, facets } = this.props;
    const { marketplace: { search: { usesFacetNavData } } } = this.context;
    const savedKeys = Object.keys(savedsizes.filters);
    const message = [];
    if (usesFacetNavData) {
      for (const section of Object.keys(facets.navigation)) {
        for (const facet of facets.navigation[section]) {
          const { facetFieldDisplayName, facetField } = facet;
          const hasSavedSizes = savedsizes.filters[facetField]?.length;
          const isSavedSizeFacetGroup = savedKeys.includes(facetField);
          if (isSavedSizeFacetGroup && hasSavedSizes) {
            message.push(`\n${facetFieldDisplayName.toLowerCase()}(s): ${savedsizes.filters[facetField].join(', ')}`);
          }
        }
      }
    } else {
      for (const facet of facets.toDisplay) {
        const { facetField, facetFieldDisplayName } = facet;
        if (savedsizes.filters[facetField]?.length && savedKeys.includes(facetField)) {
          message.push(`\n${facetFieldDisplayName.toLowerCase()}(s): ${savedsizes.filters[facetField].join(', ')}`);
        }
      }
    }

    return ` for ${message.join(' and ')}`;
  };

  makeSavedFiltersTop = () => {
    const { testId } = this.context;
    const { isCustomer, onSaveFeatureToggle, filters: { savedsizes, applySavedFilters, selected } } = this.props;
    if (savedsizes) {
      const savedSizes = Object.values(savedsizes.filters);
      const hasSavedValues = savedSizes.some(v => v.length);
      const showSavedToggle = savedSizes.length;
      const hasChosenASaveFilter = Object.keys(savedsizes.filters).some(v => selected.multiSelects[v]);
      let content = null;

      if (!isCustomer) {
        content = (
          <>
          Login to see saved sizes <button type="button" onClick={onSaveFeatureToggle}>Sign In</button>
          </>
        );
      } else if (savedsizes.id && showSavedToggle && hasSavedValues) {
        const toggleText = applySavedFilters ? 'off' : 'on';
        content = (
          <>
          <button
            id="toggleBtn"
            className={css.toggleBtn}
            type="button"
            aria-pressed={applySavedFilters}
            onClick={onSaveFeatureToggle}/>
          <label htmlFor="toggleBtn">turn {toggleText} auto-apply{this.makeSavedFiltersToggleText()}</label>
          </>
        );
      } else if (showSavedToggle && !hasSavedValues && !hasChosenASaveFilter) {
        content = 'Select a size you want to save for future searches';
      }

      if (content) {
        return (
          <div className={css.toggleTop} data-test-id={testId('toggleTop')}>
            {content}
          </div>
        );
      }
    }
    return null;
  };

  renderFacetList = (facetGroup, i, isExpanded, section) => {
    const { testId } = this.context;
    const { facetField, facetFieldDisplayName } = facetGroup;

    return (
      <div
        className={css.facetList}
        aria-hidden={!isExpanded}
        role="group"
        data-test-id={testId(`${facetFieldDisplayName}-values`)}>
        <ul aria-labelledby={facetField}>
          {this.makeListOptions(facetGroup, i, isExpanded, section)}
        </ul>
      </div>
    );
  };

  shouldRenderFacetGroup(name, section) {
    const { facets: { chosenFacetGroup, toDisplay } } = this.props;
    const matchingSection = chosenFacetGroup?.section === section || true;
    const isChosen = chosenFacetGroup && matchingSection && chosenFacetGroup.facetField === name;
    const onlyOne = toDisplay.length === 1;
    if (onlyOne || isChosen) {
      return css.selected;
    } else if (chosenFacetGroup) {
      return css.facetChosen;
    }
  }

  autoCompleteHandler(value, searchText) {
    /**
     * Replace Umlaute (äöüÄÖÜ) characters with US characters (aouAOU)
     * For brands such as "Fjällräven"
    */
    const displayName = value.displayName.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036F]/g, '');
    return displayName.includes(searchText.toLowerCase());
  }

  makeAutoComplete(facetGroup) {
    const { autoCompleteMinValues, hasAutoComplete } = this.props;
    if (hasAutoComplete && facetGroup.values.length > autoCompleteMinValues) {
      return (
        <div className={css.autoComplete}>
          <FacetAutoComplete
            id={facetGroup.facetField}
            title={facetGroup.facetFieldDisplayName}
            handler={this.autoCompleteHandler}
            values={facetGroup.values} />
        </div>
      );
    }
  }

  makeClearFilterLink = () => {
    const { clearFacetGroup, filters: { breadcrumbs } } = this.props;
    if (breadcrumbs.length) {
      return <button
        type="button"
        className={css.clearAllFacets}
        onClick={clearFacetGroup}>
        Clear Filters
      </button>;
    }
  };

  makeBreadcrumbClickHandler = crumb => {
    const { router } = this.context;
    const { removePersonalizedSize, filters } = this.props;
    return e => {
      e.preventDefault();
      if (filters.personalizedSize?.sizes?.includes(crumb.name)) {
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
      return false;
    };
  };

  makeChosenFacets = () => {
    const { filters: { breadcrumbs } } = this.props;
    if (breadcrumbs.length > 0) {
      const formattedBreadcrumbs = breadcrumbs.map(v => (
        <li className={css.selectedFacet} key={v.name}>
          <a href={v.removeUrl} className={css.hasCheckbox} onClick={this.makeBreadcrumbClickHandler(v)}>{v.name}</a>
        </li>
      ));

      return (
        <div className={css.facetList}>
          <ul>
            {formattedBreadcrumbs}
          </ul>
        </div>
      );
    }
  };

  makeTrustedRetailerMessaging = () => {
    const { facets: { toDisplay }, products: { trustedRetailers, list } } = this.props;
    if (!toDisplay.length && trustedRetailers.length || trustedRetailers.length && list.length) {
      return (
        <div className={css.crossSiteMessaging}>
          <strong>Can't find a filter?</strong>
          <p>It may be missing for products marked with:</p>
          <div className={css.trustedBanner}><TrustedRetailerBanner/></div>
        </div>
      );
    }
  };

  makeNormalFacets() {
    const { facets, autoCompleteMinValues } = this.props;
    const { testId, marketplace: { search: { hasSaveFilters, usesFacetNavData } } } = this.context;
    if (!usesFacetNavData && facets.toDisplay?.length) {
      return facets.toDisplay.map((facetGroup, i) => {
        const { isExpanded } = facets.toDisplay[i];
        const hasAutoComplete = facetGroup.values?.length > autoCompleteMinValues;
        const isFirstFacet = i === 0;
        return (
          <section
            key={`${facetGroup.facetField}`}
            className={cn(css.facetGroup, this.shouldRenderFacetGroup(facetGroup.facetField), { [css.firstFacet]: isFirstFacet, [css.collapsed]: !isExpanded, [css.hasAutoComplete]: hasAutoComplete, [css.personalizedPreferences]: facetGroup.facetField === BEST_FOR_YOU_FACETFIELD })}
            data-test-id={testId('facetGroup')}>
            {this.renderFacetHead(facetGroup, isExpanded)}
            {hasSaveFilters && this.makeSaveSizeFeature(facetGroup.facetField, facetGroup.facetFieldDisplayName)}
            {this.makeAutoComplete(facetGroup)}
            {this.renderFacetList(facetGroup, i, isExpanded)}
          </section>
        );
      });
    }
    return null;
  }

  makeOrderedFacets() {
    const { facets, autoCompleteMinValues } = this.props;
    const { testId, marketplace: { search: { hasSaveFilters, usesFacetNavData } } } = this.context;

    if (usesFacetNavData) {
      return Object.keys(facets.navigation).map((section, sectionIndex) => facets.navigation[section].map((facetGroup, i) => {
        if (facetGroup) {
          const { isExpanded } = facets.navigation[section][i];
          const hasAutoComplete = section !== 'sizing' && facetGroup.values.length > autoCompleteMinValues;
          const isFirstFacet = sectionIndex === 0 && i === 0;
          const additionalClasses = {
            [css.firstFacet]: isFirstFacet,
            [css.collapsed]: !isExpanded,
            [css.hasAutoComplete]: hasAutoComplete,
            [css.personalizedPreferences]: facetGroup.facetField === BEST_FOR_YOU_FACETFIELD
          };

          return (
            <section
              key={`${facetGroup.facetField}`}
              className={cn(css.facetGroup, this.shouldRenderFacetGroup(facetGroup.facetField, section), additionalClasses)}
              data-test-id={testId('facetGroup')}>
              {this.renderFacetHead(facetGroup, isExpanded, section)}
              {hasSaveFilters && this.makeSaveSizeFeature(facetGroup.facetField, facetGroup.facetFieldDisplayName)}
              {hasAutoComplete && this.makeAutoComplete(facetGroup)}
              {this.renderFacetList(facetGroup, i, isExpanded, section)}
            </section>
          );
        }
      }));
    }
    return null;
  }

  render() {
    const { filters, facets, hasBreadcrumbFacets, mobileFacetSort, facetHeader, hasMultiSelectMessaging } = this.props;
    const { chosenFacetGroup } = facets;
    const { marketplace: { search: { hasSaveFilters, hasCrossSiteSearches } } } = this.context;
    return (
      <div className={cn(css.facetStyle, { [css.chosenFacetGroup]: chosenFacetGroup })}>
        {(facetHeader && !!facets.toDisplay?.length) && <h2 className={css.desktopFacetsHeader}>{facetHeader}</h2>}
        {hasCrossSiteSearches && this.makeTrustedRetailerMessaging()}
        <MultiSelectFilters
          filters={filters}
          facets={facets}
          chosenFacetGroup={facets.chosenFacetGroup}
          hasMultiSelectMessaging={hasMultiSelectMessaging}/>
        {hasBreadcrumbFacets && this.makeClearFilterLink()}
        {hasBreadcrumbFacets && this.makeChosenFacets()}
        {mobileFacetSort && (
          <section className={cn(css.facetGroup, css.mobileSortFacet, { [css.selected]: facets.mobileFacetSortToggled })}>
            <h3>
              <button
                type="button"
                className={css.facetGroupHead}
                aria-expanded={facets.mobileFacetSortToggled}
                data-selected-facet-group-name="sort"
                onClick={this.props.onFacetGroupSelect}>
                Sort
              </button>
            </h3>
            <div className={css.facetList}>
              <Sort sortId="mobileSearchSort" accordion={true}/>
            </div>
          </section>)}
        {hasSaveFilters && this.makeSavedFiltersTop()}
        {this.makeOrderedFacets()}
        {this.makeNormalFacets()}
      </div>
    );
  }
}

Facets.propTypes = {
  facets: PropTypes.object.isRequired,
  onFacetGroupSelect: PropTypes.func.isRequired,
  onFacetSelect: PropTypes.func.isRequired
};

Facets.contextTypes = {
  router: PropTypes.object.isRequired,
  testId: PropTypes.func,
  marketplace: PropTypes.object
};

const FacetsWithErrorBoundary = withErrorBoundary('Facets', Facets);
export default FacetsWithErrorBoundary;
