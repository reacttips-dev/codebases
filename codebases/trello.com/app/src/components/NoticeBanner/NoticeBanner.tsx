import { Banner } from 'app/src/components/Banner';
import React from 'react';

import { Button, ButtonLink } from '@trello/nachos/button';
import { BusinessBlue500 } from '@trello/colors';
import { forNamespace } from '@trello/i18n';
import { InlineLink } from 'app/src/components/BillableGuestsAlert/InlineLink';
import styles from './NoticeBanner.less';

const format = forNamespace();

interface NoticeBannerProps {
  children: React.ReactNode;
  onDismiss?: () => void;
  inline?: boolean;
  learnMoreUrl?: string;
  actionButton?: {
    text: string;
    onClick: () => void;
  };
}

const learnMore = format('learn more button');

export const NoticeBanner = ({
  children,
  onDismiss,
  inline,
  actionButton,
  learnMoreUrl,
}: NoticeBannerProps) => {
  return (
    <Banner
      onDismiss={onDismiss}
      bannerColor={BusinessBlue500}
      useLightText
      roundedCorners={inline}
      inlinePadding={inline}
    >
      <div className={styles.noticeBannerContainer}>
        <div className={styles.textContent}>
          {children}{' '}
          {learnMoreUrl && inline && (
            <InlineLink text={learnMore} href={learnMoreUrl} />
          )}
        </div>
        {learnMoreUrl && !inline && (
          <div className={styles.learnMoreButton}>
            <ButtonLink link={learnMoreUrl} openInNewTab isPrimary={false}>
              {learnMore}
            </ButtonLink>
          </div>
        )}
        {actionButton && !inline && !learnMoreUrl && (
          <div className={styles.learnMoreButton}>
            <Button
              appearance="primary"
              onClick={actionButton.onClick}
              role="link"
            >
              {actionButton.text}
            </Button>
          </div>
        )}
      </div>
    </Banner>
  );
};
