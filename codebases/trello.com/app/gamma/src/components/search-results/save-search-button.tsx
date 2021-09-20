/* eslint-disable import/no-default-export */
import { StarIcon } from '@trello/nachos/icons/star';
import { State } from 'app/gamma/src/modules/types';
import React from 'react';
import { connect } from 'react-redux';
import { getMatchingSavedSearchNameByQuery } from 'app/gamma/src/selectors/saved-searches';
import { ProductFeatures } from '@trello/product-features';
import preventDefault from 'app/gamma/src/util/prevent-default';
import { getMe } from 'app/gamma/src/selectors/members';
import { getMyTeams } from 'app/gamma/src/selectors/teams';

import { dontUpsell } from '@trello/browser';
import { forTemplate } from '@trello/i18n';
import styles from './search-results.less';
import { searchState } from 'app/src/components/SearchResults';

const format = forTemplate('search_instant_results');

interface StateProps {
  isSavedSearchEnabled: boolean;
  queryMatchingSavedSearchName: string;
}

const mapStateToProps = (state: State) => {
  return {
    isSavedSearchEnabled:
      ProductFeatures.isFeatureEnabled(
        'savedSearches',
        getMe(state)?.products?.[0],
      ) ||
      getMyTeams(state).some(({ premiumFeatures }) =>
        premiumFeatures?.includes('savedSearches'),
      ),
    queryMatchingSavedSearchName: getMatchingSavedSearchNameByQuery(state),
  };
};

class SaveSearchButton extends React.Component<StateProps> {
  onClick = () => {
    const { isSavedSearchEnabled } = this.props;

    if (isSavedSearchEnabled) {
      searchState.setValue({
        displayAddSavedSearchForm: true,
      });
    } else {
      searchState.setValue({
        displaySavedSearchPromo: true,
      });
    }
  };

  render() {
    const { isSavedSearchEnabled, queryMatchingSavedSearchName } = this.props;

    if (queryMatchingSavedSearchName) {
      return (
        <span className={styles.staticAction}>
          <StarIcon size="small" color="quiet" />
          {queryMatchingSavedSearchName}
        </span>
      );
    } else if (
      (!dontUpsell() && !isSavedSearchEnabled) ||
      isSavedSearchEnabled
    ) {
      return (
        <a
          className={styles.saveSearchOption}
          onClick={preventDefault(this.onClick)}
          href="#"
        >
          <StarIcon size="small" color="quiet" />
          {format('save-this-search')}
        </a>
      );
    } else {
      return null;
    }
  }
}

export default connect(mapStateToProps)(SaveSearchButton);
