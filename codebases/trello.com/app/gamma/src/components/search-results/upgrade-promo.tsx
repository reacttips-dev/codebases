/* eslint-disable import/no-default-export,react/no-danger */
import React from 'react';
import styles from './search-results.less';

import { forTemplate } from '@trello/i18n';
const format = forTemplate('search_instant_results');

const UpgradeForSavedSearchPromo: React.FunctionComponent = () => {
  return (
    <div className={styles.savedSearchPromo}>
      <p className={styles.promoTitle}>
        {format('upgrade-to-add-new-saved-searches')}
      </p>
      <p
        className={styles.promoText}
        dangerouslySetInnerHTML={{
          __html: format(
            'you-can-get-saved-searches-for-your-entire-workspace-with-business-class',
          ),
        }}
      />
      <p className={styles.promoText}>
        <a
          className={styles.promoAction}
          rel="noopener noreferrer"
          target="_blank"
          href="/business-class"
        >
          {format('check-out-business-class')}
        </a>
      </p>
      <hr />
    </div>
  );
};

export default UpgradeForSavedSearchPromo;
