import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { deepEqual } from 'fast-equals';

import marketplace from 'cfg/marketplace.json';
import { createLocationWithParams, sortStringToObject } from 'helpers/SearchUtils';

import css from 'styles/zen/search/sort.scss';

const { search: { sortOptions } } = marketplace;

export class Sort extends Component {

  getSelectedSortValue = (sortOptions, criteria) => {
    const matched = (sortOptions || []).find(({ value }) => deepEqual(sortStringToObject(value), criteria));
    return matched ? matched : sortOptions[0];
  };

  makeDesktopLink = value => {
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
  };

  makeSortOptions = () => {
    const { accordion, filters: { sort } } = this.props;
    const selectedValue = this.getSelectedSortValue(sortOptions, sort);
    return sortOptions.map(({ label, value, ariaLabel }) => {
      if (selectedValue.value === value) {
        const selectedVal = <span key={label} className={css.selected}>{label}</span>;
        return accordion ? <li key={label}>{selectedVal}</li> : selectedVal;
      }

      const link = <Link
        to={this.makeDesktopLink(value)}
        key={label}
        data-value={value}
        aria-label={ariaLabel}>{label}</Link>;

      return accordion ? <li key={label}>{link}</li> : link;
    });
  };

  render() {
    const { accordion, sortId = 'searchSort' } = this.props;
    const sortOptions = this.makeSortOptions();
    const markup = accordion ? <ul>{sortOptions}</ul> : sortOptions;
    return (
      <div id={sortId} className={css.sort}>
        {!accordion && <span>Sort by</span>}
        {markup}
      </div>
    );
  }
}

function mapStateToProps({ filters }) {
  return {
    filters
  };
}

export default connect(mapStateToProps, {
})(Sort);
