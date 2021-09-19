import React from 'react';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';
import useMartyContext from 'hooks/useMartyContext';

import css from 'styles/components/search/facetActions.scss';

export const FacetActions = ({ clearFacetGroup, selectedFacet, facetDone, mobileCloseFiltersText, mobileRemoveSelectionsText }) => {
  const { testId, marketplace: { search: { hasFacetListClear } } } = useMartyContext();
  return (
    <div className={css.facetActions}>
      <button
        type="button"
        className={css.resetFacets}
        onClick={clearFacetGroup}
        data-test-id={testId('resetFacets')}>
        {mobileRemoveSelectionsText} {(hasFacetListClear && selectedFacet) ? selectedFacet.facetFieldDisplayName : 'All'}
      </button>
      <button
        type="button"
        data-test-id={testId('facetDone')}
        className={css.done}
        onClick={facetDone}>
        {mobileCloseFiltersText}
      </button>
    </div>
  );
};

FacetActions.displayName = 'FacetActions';
export default withErrorBoundary('FacetActions', FacetActions);
