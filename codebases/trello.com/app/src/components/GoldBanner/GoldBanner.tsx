import React, { useEffect } from 'react';
import { BillingIds } from '@trello/test-ids';
import { forTemplate, localizeCount } from '@trello/i18n';
import { CloseIcon } from '@trello/nachos/icons/close';
import { Button } from '@trello/nachos/button';
import { Analytics } from '@trello/atlassian-analytics';
import styles from './GoldBanner.less';

const format = forTemplate('boards_page_gold_banner');

interface GoldBannerProps {
  hasGold?: boolean;
  invitedMemberNames?: string[];
  creditedMonths?: number;
  onDismissBanner: () => void;
}

export const GoldBanner: React.FC<GoldBannerProps> = ({
  hasGold = false,
  invitedMemberNames,
  creditedMonths = 0,
  onDismissBanner,
}) => {
  let welcomeHeading: string;
  let subheading: string;
  let tips: string[] = [];

  useEffect(() => {
    Analytics.sendViewedBannerEvent({
      bannerName: hasGold ? 'goldUpgradeBanner' : 'goldRedeemBanner',
      source: 'memberHomeScreen',
    });
  }, [hasGold]);

  if (hasGold) {
    welcomeHeading = format('welcome heading-upgrade');
    subheading = format('welcome subheading-upgrade');
    tips = [
      format('tip-power-ups', {
        url:
          'https://trello.com/power-ups?utm_source=welcome-banner&utm_medium=inapp&utm_term=gold-subscribe',
      }),
      format('tip-board backgrounds', {
        url:
          'http://help.trello.com/article/818-changing-board-backgrounds?utm_source=welcome-banner&utm_medium=inapp&utm_term=gold-subscribe',
      }),
      format('tip-premium stickers', {
        url:
          'http://help.trello.com/article/817-trello-gold-user-guide?utm_source=welcome-banner&utm_medium=inapp&utm_term=gold-subscribe',
      }),
    ];
  } else {
    welcomeHeading = format('welcome heading-recommendation');
    subheading =
      (invitedMemberNames ?? []).length > 0
        ? localizeCount('months of trello gold on us', creditedMonths)
        : localizeCount('months of trello gold', creditedMonths);
    tips = [
      format('tip-account settings', {
        url:
          '/my/billing?utm_source=welcome-banner&utm_medium=inapp&utm_term=gold-recommend',
      }),
      format('tip-learn trello gold', {
        url:
          'http://help.trello.com/article/817-trello-gold-user-guide?utm_source=welcome-banner&utm_medium=inapp&utm_term=gold-recommend',
      }),
    ];

    if ((invitedMemberNames ?? []).length > 0) {
      tips.unshift(
        format('tip-these people joined', {
          invited_members: (invitedMemberNames ?? []).join(', '),
        }),
      );
    }
  }

  return (
    <div
      className={styles.GoldBanner}
      data-test-id={
        hasGold ? BillingIds.WelcomeToGoldBanner : BillingIds.RedeemGoldBanner
      }
    >
      <Button
        iconBefore={<CloseIcon color="light" size="large" />}
        className={styles.DismissButton}
        onClick={onDismissBanner}
      />
      <div className={styles.GoldBannerContent}>
        <div className={styles.WelcomeSection}>
          <h1 className={styles.WelcomeHeading}>{welcomeHeading}</h1>
          <p className={styles.WelcomeSubheading}>{subheading}</p>
        </div>
        <ol className={styles.TipList}>
          {tips.map((tip, i) => (
            <li
              className={styles.ListItem}
              key={`gold-banner-tip-list-item-${i}`}
            >
              <span className={styles.Bullet} aria-hidden="true"></span>
              <span
                className={styles.ListItemText}
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{ __html: tip }}
              />
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
};
