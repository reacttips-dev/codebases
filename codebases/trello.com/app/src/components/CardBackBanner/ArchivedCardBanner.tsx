import React from 'react';
import { ArchiveIcon } from '@trello/nachos/icons/archive';
import { forTemplate } from '@trello/i18n';
import styles from './ArchivedCardBanner.less';
import { CardBackTestIds } from '@trello/test-ids';

const format = forTemplate('card_detail');

export const ArchivedCardBanner: React.FunctionComponent = () => {
  return (
    <div
      className={styles.archivedBanner}
      data-test-id={CardBackTestIds.ArchivedBanner}
    >
      <ArchiveIcon
        dangerous_className={styles.archiveBannerIcon}
        size="large"
      />
      <p className={styles.archivedBannerText}>
        {format('this-card-is-archived')}
      </p>
    </div>
  );
};
