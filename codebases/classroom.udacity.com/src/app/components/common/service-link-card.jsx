import { Flex, Heading, Text } from '@udacity/veritas-components';
import AnalyticsService from 'services/analytics-service';
import Card from 'components/common/card';
import NotificationBadge from 'components/common/notification-badge';
import PropTypes from 'prop-types';
import React from 'react';
import styles from './service-links.scss';

export default function ServiceLinkCard({
  url,
  icon,
  header,
  text,
  hasUnreads,
  unreadCount,
}) {
  return (
    <li>
      <a
        href={url}
        target="_blank"
        rel="noreferrer noopener"
        onClick={() => {
          AnalyticsService.trackNavLink(_.noop, `${header} Clicked`, {});
        }}
      >
        <Card styleName="lesson-card" interactive={true}>
          <div className={styles.cardContent}>
            <Flex align="center" spacing="half">
              {icon}
              <Heading size="h5" spacing="half">
                {header}
              </Heading>
              {hasUnreads && <NotificationBadge unreadCount={unreadCount} />}
            </Flex>
            <Text size="sm">{text}</Text>
          </div>
        </Card>
      </a>
    </li>
  );
}

ServiceLinkCard.propTypes = {
  url: PropTypes.string,
  header: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.func, PropTypes.element]),
  text: PropTypes.string,
};
