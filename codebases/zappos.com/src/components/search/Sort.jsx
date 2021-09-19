import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { deepEqual } from 'fast-equals';
import cn from 'classnames';

import { createLocationWithParams, sortStringToObject } from 'helpers/SearchUtils';

import styles from 'styles/components/search/sort.scss';

class Sort extends Component {
  /**
  * Given a list of sort options, return the option which matches
  * the passed in criteria.
  * @param  {object[]} sortOptions array of sort options
  * @param  {object} criteria      object of sort criteria
  * @return {object}               matching sort option or undefined
  */
  getSelectedSortValue(sortOptions, criteria) {
    const matched = (sortOptions || []).find(({ value }) => deepEqual(sortStringToObject(value), criteria));
    return matched ? matched : sortOptions[0];
  }

  makeDesktopLink(value) {
    const { filters } = this.props;
    const newSort = value.replace(/-/g, '/');
    const newParams = { s: newSort, si: null, sy: null };
    if (filters.page > 0) {
      newParams['p'] = 0;
    }
    /*
    * If the current url is not a zso
    * then we need to use the current url as a zso
    */
    let newUrl = null;
    if (filters.executedSearchUrl) {
      newUrl = createLocationWithParams(filters.executedSearchUrl, newParams);
    }
    return newUrl;
  }

  makeSort() {
    const { sortOptions, sortId = 'searchSort', sortAccordian, onSortSelected, selectedSort, testId, filters: { bestForYouSortEligible } } = this.props;
    const newSortOptions = [ ...sortOptions ];
    const selectedValue = this.getSelectedSortValue(newSortOptions, selectedSort);

    if (sortAccordian) {
      return (
        <div>{this.makeSortOptions(newSortOptions, !!bestForYouSortEligible)}</div>
      );
    }

    return (
      <span>
        <label htmlFor={sortId}>Sort <span> By</span></label>
        <select
          id={sortId}
          className={styles.sortSelect}
          value={selectedValue.value}
          onChange={onSortSelected}
          data-test-id={testId}>
          {this.makeSortOptions(newSortOptions, !!bestForYouSortEligible)}
        </select>
      </span>
    );
  }

  /**
  * Given an array of sort options, render option elements
  * @param  {object[]} optionData options to render
  * @return {object[]}            rendered options
  */
  makeSortOptions(optionData, showBestForYouSort) {
    return optionData.map(({ eventLabel, label, value, ariaLabel }) => {
      const option = <option
        key={value}
        value={value}
        aria-label={ariaLabel}
        data-label={eventLabel || label}>
        {label}
      </option>;
      if (label !== 'Best For You' || (label === 'Best For You' && showBestForYouSort)) {
        return option;
      }
    });
  }

  render() {
    const { className } = this.props;
    return (
      <div className={cn(styles.sort, { [className]: className })}>
        {this.makeSort()}
      </div>
    );
  }
}

Sort.propTypes = {
  onSortSelected: PropTypes.func,
  selectedSort: PropTypes.object,
  sortOptions: PropTypes.array.isRequired
};

Sort.defaultProps = {
  onSortSelected: () => null
};

export default Sort;
