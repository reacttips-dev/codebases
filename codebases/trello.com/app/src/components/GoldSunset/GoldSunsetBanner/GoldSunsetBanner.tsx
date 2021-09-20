import React, { useEffect, useCallback } from 'react';
import styles from './GoldSunsetBanner.less';
import { forTemplate, localizeCount } from '@trello/i18n';
import { TrelloGoldIcon } from '@trello/nachos/icons/trello-gold';
import { Analytics } from '@trello/atlassian-analytics';
import { BillingIds } from '@trello/test-ids';
import { getDate } from 'app/common/lib/util/date';
import moment from 'moment';

const format = forTemplate('gold_sunset');

interface GoldSunsetBannerProps {
  sunsetDate: string;
  expirationDate: string;
  goldIsActive: boolean;
}

export const GoldSunsetBanner: React.FunctionComponent<GoldSunsetBannerProps> = ({
  sunsetDate,
  expirationDate,
  goldIsActive,
}) => {
  // Key dates
  const today = getDate();
  const daysLeft = moment(expirationDate).diff(today, 'days') || 0;
  const sunsetDatePassed = moment(sunsetDate).isBefore(today, 'day');
  const expired = !goldIsActive || daysLeft <= 0;

  // Variations
  const showCountdown = daysLeft <= 3;
  const variation:
    | 'pre-sunset'
    | 'post-sunset'
    | 'pre-sunset-countdown'
    | 'post-sunset-countdown'
    | 'post-sunset-expired' = sunsetDatePassed
    ? expired
      ? 'post-sunset-expired'
      : showCountdown
      ? 'post-sunset-countdown'
      : 'post-sunset'
    : showCountdown
    ? 'pre-sunset-countdown'
    : 'pre-sunset';

  const onClickLearnMore = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'learnMoreLink',
      source: 'goldSunsetBanner',
      attributes: {
        variation,
      },
    });
  }, [variation]);

  useEffect(() => {
    Analytics.sendViewedComponentEvent({
      componentName: 'goldSunsetBanner',
      componentType: 'banner',
      source: 'workspaceBillingScreen',
      attributes: {
        variation,
      },
    });
  }, [variation]);

  return (
    <div className={styles.banner}>
      <div className={styles.iconContainer}>
        <TrelloGoldIcon size="large" />
      </div>
      <div>
        <div
          className={styles.header}
          data-test-id={BillingIds.SunsetGoldHeader}
        >
          {expired
            ? format('your-trello-gold-subscription-is-expired')
            : showCountdown
            ? localizeCount('trello-gold-days-til-expiration', daysLeft)
            : format('your-trello-gold-subscription-will-expire-on', {
                expirationDate: moment(expirationDate).format('LL'),
              })}
        </div>
        <p data-test-id={BillingIds.SunsetGoldText}>
          {format(
            sunsetDatePassed || expired
              ? 'trello-gold-is-no-longer-available-for-renewal'
              : 'trello-gold-will-no-longer-be-available-for-renewal-after',
            {
              sunsetDate: moment(sunsetDate).format('LL'),
            },
          )}{' '}
          <a
            className={styles.learnMoreLink}
            href="https://help.trello.com/article/1323-what-to-do-if-your-gold-membership-is-ending"
            target="_blank"
            onClick={onClickLearnMore}
            key="gold-learn-more"
          >
            {format('learn-more')}
          </a>
        </p>
      </div>
    </div>
  );
};
