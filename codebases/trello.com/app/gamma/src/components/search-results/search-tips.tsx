/* eslint-disable import/no-default-export */
import React from 'react';
import preventDefault from 'app/gamma/src/util/prevent-default';
import { OPERATORS } from './constants';
import { OperatorDefinitions } from './operator-definitions';
import { Button } from '@trello/nachos/button';
import styles from './search-results.less';

import { HeaderTestIds } from '@trello/test-ids';
import { forTemplate } from '@trello/i18n';
const format = forTemplate('search_instant_results');

interface SearchTipsProps {}

interface SearchTipsState {
  showAllTips: boolean;
}

class SearchTips extends React.Component<SearchTipsProps, SearchTipsState> {
  state = {
    showAllTips: false,
  };

  onClickLearnMore = () => {
    this.setState({
      showAllTips: true,
    });
  };

  render() {
    const { showAllTips } = this.state;

    return (
      <div className={styles.searchTips}>
        {showAllTips ? (
          <div className={styles.operatorDefinitions}>
            {format(
              'search-operators-help-you-find-specific-cards-and-create-highly-tailored-lists-trello-will-suggest-operators-for-you-as-you-type-but-here-s-a-full-list-to-keep-in-mind-you-can-add-to-any-operator-to-do-a-negative-search-such-as-has-members-to-search-for-cards-without-any-members-assigned',
              OPERATORS,
            )}
            <OperatorDefinitions />
          </div>
        ) : (
          <div className={styles.shortTipsWrapper}>
            <div className={styles.shortTips}>
              <div className={styles.shortTipsText}>
                {format(
                  'refine-your-search-with-operators-like-at-member-label-is-archived-and-has-attachments',
                  OPERATORS,
                )}
              </div>
            </div>
            <Button
              onClick={preventDefault(this.onClickLearnMore)}
              data-test-id={HeaderTestIds.SearchTips}
            >
              {format('learn-more')}
            </Button>
          </div>
        )}
      </div>
    );
  }
}

export default SearchTips;
