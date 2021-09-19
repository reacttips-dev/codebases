import React from 'react';

import css from 'styles/components/search/multiSelectFilters.scss';

const possibleSelects = {
  'zc1': 'product type',
  'txAttrFacet_Gender': 'gender',
  'zc2': 'category'
};

const MultiSelectFilters = ({ filters, facets, chosenFacetGroup, hasMultiSelectMessaging }) => {
  const makeMessaging = () => {
    const availSingleSelects = [];
    Object.keys(possibleSelects).forEach(key => {
      if (!filters.selected.singleSelects[key] && (facets.toDisplay || []).find(v => v.facetField === key)) {
        availSingleSelects.push(possibleSelects[key]);
      }
    });
    if (availSingleSelects.length > 0) {
      return (
        <p>
          Please choose a <span>{availSingleSelects[0]}</span> to enable additional filter options
        </p>
      );
    }
  };

  return (
    <div className={css.multiSelectCrumbs}>
      {hasMultiSelectMessaging && !chosenFacetGroup && makeMessaging()}
    </div>
  );
};

export default MultiSelectFilters;
