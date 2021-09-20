import React, { useEffect } from 'react';
import styles from './UpsellOverlay.less';
import { forNamespace } from '@trello/i18n';
import { Button } from '@trello/nachos/button';
import { Spinner } from '@trello/nachos/spinner';
import { ForwardIcon } from '@trello/nachos/icons/forward';
import { Analytics } from '@trello/atlassian-analytics';
import { FreeTrialTestIds } from '@trello/test-ids';
import { FreeTrialUpsellModal } from './FreeTrialUpsellModal';
import { useFeatureFlag } from '@trello/feature-flag-client';

const formatAll = forNamespace('');
const format = forNamespace(['free trial existing', 'upsell']);

const thingsToKnow = [
  format('things-to-know-point-1'),
  format('things-to-know-point-2'),
  format('things-to-know-point-3', {
    priority: (
      <a
        href="https://help.trello.com"
        style={{ marginRight: 4 }}
        key="things-to-know-point-3-priority-support"
      >
        {format('things-to-know-point-3-priority-support')}
      </a>
    ),
  }),
  format('things-to-know-point-4'),
];

interface UpsellOverlayProps {
  onLearnMore(): void;
  onCtaClick: () => void;
  orgId: string;
  isLoading?: boolean;
}

export const UpsellOverlay: React.FC<UpsellOverlayProps> = ({
  onLearnMore,
  orgId,
  onCtaClick,
  isLoading,
}) => {
  const isRepackagedGtm = useFeatureFlag(
    'nusku.repackaging-gtm.features',
    false,
  );

  const onLearnMoreWithTracking = () => {
    onLearnMore();
    Analytics.sendClickedButtonEvent({
      buttonName: 'learnMoreButton',
      source: 'freeTrialModal',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });
  };

  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'freeTrialModal',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });
  }, [orgId]);

  if (isRepackagedGtm) {
    return (
      <FreeTrialUpsellModal
        isLoading={isLoading}
        onPrimaryClick={onCtaClick}
        onSecondaryClick={onLearnMore}
        orgId={orgId}
      />
    );
  }

  return (
    <div className={styles.upsellOverlay}>
      <div className={styles.upsellOverlayHeader}>
        <img
          src={require('resources/images/free-trial/light.svg')}
          alt="free-trial-light"
          role="presentation"
          width="101"
          height="90"
        />
        <div className={styles.upsellOverlayTag}>{format('tag')}</div>
        <h3>{format('headline')}</h3>
        <p>{format('content')}</p>
        <Button
          className={styles.button}
          appearance="primary"
          data-test-id={FreeTrialTestIds.StartFreeTrialButton}
          onClick={onCtaClick}
          size="fullwidth"
        >
          {isLoading ? (
            <Spinner centered small wrapperClassName={styles.spinner} />
          ) : (
            format('maincta')
          )}
        </Button>
      </div>
      <div className={styles.upsellOverlayBody}>
        <div className={styles.upsellOverlayBodyHeader}>
          <h3>{format('things-to-know-header')}</h3>
          <img
            src={require('resources/images/free-trial/thumbs-up.svg')}
            alt="free-trial-thumbs-up"
            role="presentation"
            width="94"
            height="93"
          />
        </div>
        <div className={styles.upsellOverlayThings}>
          {thingsToKnow.map((thingToKnow, i) => (
            <div key={i.toString()} className={styles.upsellOverlayThing}>
              <div
                className={styles.upsellOverlayThingBullet}
                aria-hidden="true"
                role="presentation"
              />{' '}
              {thingToKnow}
            </div>
          ))}
        </div>
        <Button
          className={styles.learnMoreStep}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={onLearnMoreWithTracking}
          size="fullwidth"
          data-test-id={FreeTrialTestIds.LearnMoreAboutBCButton}
          iconAfter={<ForwardIcon size="small" />}
        >
          {formatAll(['learn more button'])}
        </Button>
      </div>
    </div>
  );
};
