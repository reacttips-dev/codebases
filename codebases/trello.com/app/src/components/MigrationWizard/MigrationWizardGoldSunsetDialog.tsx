import React, { useEffect, useContext, useCallback } from 'react';
import { MigrationWizardContext } from './MigrationWizardContext';
import { Analytics, getScreenFromUrl } from '@trello/atlassian-analytics';
import { Button, ButtonLink } from '@trello/nachos/button';
import { forNamespace } from '@trello/i18n';

import styles from './MigrationWizardGoldSunsetDialog.less';
import moment from 'moment';

const format = forNamespace(['migration wizard']);

export const MigrationWizardGoldSunsetDialog: React.FC<{
  close: () => void;
  isAutoShow: boolean;
}> = ({ close, isAutoShow }) => {
  const { teamify } = useContext(MigrationWizardContext);

  const migrationDate =
    !!teamify?.autoMigration &&
    moment(teamify?.autoMigration).format('MMMM Do');

  useEffect(() => {
    Analytics.sendViewedComponentEvent({
      componentType: 'modal',
      componentName: 'teamifyGoldUserModal',
      source: getScreenFromUrl(),
      attributes: { autoLaunch: isAutoShow },
    });
  }, [isAutoShow]);

  const onClickLearnMore = useCallback(() => {
    Analytics.sendClickedLinkEvent({
      linkName: 'learnMoreLink',
      source: 'teamifyGoldUserModal',
      attributes: { autoLaunch: isAutoShow },
    });
  }, [isAutoShow]);

  return (
    <div className={styles.container}>
      <img
        className={styles.headerImage}
        src={require('resources/images/migration-wizard/start-board-migration.png')}
        alt=""
        role="presentation"
      />
      <h1 className={styles.title}>{format('gold-promo-dialog-heading')}</h1>
      <div className={styles.body}>
        <p className={styles.paragraph}>
          {migrationDate
            ? format('gold-promo-dialog-subtext', {
                migrationDate,
              })
            : format('gold-promo-dialog-subtext-without-date')}
        </p>

        <div className={styles.explanation}>
          <img
            alt=""
            className={styles.featureIcon}
            src={require('resources/images/teamify/wandIcon.svg')}
          />
          <p>
            <b>{format('gold-promo-dialog-free-features-title')}</b>
            <br />
            {format('gold-promo-dialog-free-features-description')}
          </p>
        </div>

        <div className={styles.explanation}>
          <img
            alt=""
            className={styles.featureIcon}
            src={require('resources/images/teamify/tombIcon.svg')}
          />
          <p>
            <b>{format('gold-promo-dialog-renewal-unavailable-title')}</b>
            <br />
            {format('gold-promo-dialog-renewal-unavailable-description')}
          </p>
        </div>

        <div className={styles.explanation}>
          <img
            alt=""
            className={styles.featureIcon}
            src={require('resources/images/teamify/partyPopperIcon.svg')}
          />
          <p>
            <b>{format('gold-promo-dialog-60-days-title')}</b>
            <br />
            {format('gold-promo-dialog-60-days-description')}
          </p>
        </div>

        <p className={styles.paragraph}>
          {format('gold-promo-dialog-posttext')}
        </p>
      </div>
      <div className={styles.buttons}>
        <ButtonLink
          link="https://help.trello.com/article/1323-what-to-do-if-your-gold-membership-is-ending"
          className={styles.buttonLearnMore}
          onClick={onClickLearnMore}
        >
          {format('gold-promo-dialog-learn-more')}
        </ButtonLink>

        <Button
          appearance="primary"
          size="wide"
          onClick={close}
          className={styles.buttonCta}
        >
          {format('gold-promo-dialog-cta')}
        </Button>
      </div>
    </div>
  );
};
