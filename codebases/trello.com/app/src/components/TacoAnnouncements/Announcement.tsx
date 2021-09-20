/* eslint-disable react/no-danger */
import classNames from 'classnames';
import { Analytics } from '@trello/atlassian-analytics';
import { forTemplate } from '@trello/i18n';
import { Announcement as AnnouncementType } from './helpers';
import React from 'react';
import styles from './Announcement.less';

const format = forTemplate('announcement');

export const classNamesForType = (type: string) => {
  return {
    [styles.announcement]: true,
    [styles[`announcement-${type}`]]: !!type,
  };
};

export const Announcement: React.FunctionComponent<AnnouncementType> = ({
  url,
  title,
  html,
  type,
}) => (
  <div className={classNames(classNamesForType(type))}>
    <h3 className={styles.announcementHeader}>
      {url ? (
        <a
          className={styles.announcementHeaderLink}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() =>
            Analytics.sendClickedLinkEvent({
              linkName: 'announcementHeaderLink',
              source: 'tacoAnnouncementInlineDialog',
            })
          }
        >
          {title}
        </a>
      ) : (
        title
      )}
    </h3>
    <p dangerouslySetInnerHTML={{ __html: html }} />
    {url && (
      <p className={styles.quiet}>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() =>
            Analytics.sendClickedLinkEvent({
              linkName: 'announcementLink',
              source: 'tacoAnnouncementInlineDialog',
            })
          }
        >
          {format('read-more-ellipsis')}
        </a>
      </p>
    )}
  </div>
);
