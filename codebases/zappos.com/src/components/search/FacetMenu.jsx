import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import { withErrorBoundary } from 'components/common/MartyErrorBoundary';

import css from 'styles/components/search/facetmenu.scss';

class FacetMenu extends Component {
  makeBackArrow() {
    const { facets: { chosenFacetGroup }, clearChosenFacet } = this.props;
    const { testId } = this.context;
    return chosenFacetGroup
      ? <button
        type="button"
        className={css.facetBack}
        onClick={clearChosenFacet}
        data-test-id={testId('facetBack')}
        aria-label="back to categories">
        <span className={css.arrow}/>
      </button>
      : '';
  }

  makeMenuTitle() {
    const { hasMobileLayeredFacets, mobileFacetHeader, facets: { chosenFacetGroup }, totalProductCount } = this.props;

    return (
      <div>
        <span className={cn({ [css.nonLayerdFacets]: !hasMobileLayeredFacets })}>
          <h3>{hasMobileLayeredFacets && chosenFacetGroup ? chosenFacetGroup.facetFieldDisplayName : mobileFacetHeader}</h3>
        </span>
        {hasMobileLayeredFacets && <div className={css.productCount}>{totalProductCount} items</div>}
      </div>
    );
  }

  makeCloseButton() {
    const { facetDone } = this.props;
    const { testId } = this.context;
    return (
      <button
        type="button"
        className={css.facetClose}
        onClick={facetDone}
        data-test-id={testId('facetClose')}>
        Back to Results
      </button>
    );
  }

  render() {
    const { hasMobileLayeredFacets } = this.props;
    return (
      <div className={`${css.facetMenu} ${css.fixed}`}>
        {hasMobileLayeredFacets && this.makeBackArrow()} {this.makeMenuTitle()} {this.makeCloseButton()}
      </div>
    );
  }
}

FacetMenu.displayName = 'FacetMenu';
FacetMenu.contextTypes = {
  testId: PropTypes.func
};

export default withErrorBoundary('FacetMenu', FacetMenu);
