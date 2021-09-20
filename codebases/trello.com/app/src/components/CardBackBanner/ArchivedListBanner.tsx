import React from 'react';
import { ArchiveIcon } from '@trello/nachos/icons/archive';
import { forTemplate } from '@trello/i18n';
import styles from './ArchivedListBanner.less';

const format = forTemplate('card_detail');

export const ArchivedListBanner: React.FunctionComponent = () => {
  return (
    <div className={styles.archivedBanner}>
      <ArchiveIcon
        dangerous_className={styles.archiveBannerIcon}
        size="large"
      />
      <p className={styles.archivedBannerText}>
        {format('this-card-is-in-an-archived-list')}
      </p>
    </div>
  );
};
