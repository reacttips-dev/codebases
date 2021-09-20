import React from 'react';
import styles from './FreeTrialUpsellModal.less';
import { Button } from '@trello/nachos/src/components/Button';
import { FreeTrialTestIds } from '@trello/test-ids';
import { Spinner } from '@trello/nachos/src/components/Spinner';
import { forNamespace } from '@trello/i18n';
import { useProductData } from 'app/src/components/UpgradePrompts/useProductData';

const format = forNamespace(['free trial existing', 'upsell']);

const standardBulletPoints = [
  format('bullet-views'),
  format('bullet-unlimited-automations'),
  format('bullet-admin-and-security'),
  format('bullet-board-collections'),
  format('bullet-and-more'),
];

const freeBulletPoints = [
  format('bullet-unlimited-boards'),
  format('bullet-advanced-checklists'),
  format('bullet-admin-and-security'),
  format('bullet-unlimited-automations'),
  format('bullet-and-more'),
];

interface UpsellOverlayProps {
  onPrimaryClick: () => void;
  onSecondaryClick(): void;
  isLoading?: boolean;
  orgId: string;
}

export const FreeTrialUpsellModal: React.FC<UpsellOverlayProps> = ({
  onSecondaryClick,
  onPrimaryClick,
  isLoading,
  orgId,
}) => {
  const { isStandard } = useProductData(orgId);
  const bulletPoints = isStandard ? standardBulletPoints : freeBulletPoints;
  return (
    <div className={styles.container}>
      <div className={styles.confetti}>
        <img
          src={require('resources/images/free-trial/confetti.svg')}
          alt=""
          role="presentation"
        />
      </div>
      <h3 className={styles.header}>{format('headline')}</h3>
      <p className={styles.subheader}>
        {format(isStandard ? 'subheader-paid' : 'subheader-free')}
      </p>
      <div className={styles.listContainer}>
        <ul className={styles.list}>
          {bulletPoints.map((bullet, i) => (
            <li key={i.toString()}>{bullet}</li>
          ))}
        </ul>
      </div>
      <Button
        className={styles.button}
        appearance="primary"
        data-test-id={
          isStandard
            ? FreeTrialTestIds.StandardStartPremiumFreeTrialButton
            : FreeTrialTestIds.StartFreeTrialButton
        }
        onClick={onPrimaryClick}
        size="fullwidth"
      >
        {isLoading ? (
          <Spinner centered small wrapperClassName={styles.spinner} />
        ) : (
          format('maincta')
        )}
      </Button>
      <Button
        className={styles.link}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={onSecondaryClick}
        appearance="link"
        data-test-id={
          isStandard
            ? FreeTrialTestIds.StandardLearnMoreAboutPremiumButton
            : FreeTrialTestIds.LearnMoreAboutBCButton
        }
      >
        {format('learn-more')}
      </Button>
      {isStandard ? (
        <footer className={styles.footer}>{format('footer')}</footer>
      ) : null}
    </div>
  );
};
