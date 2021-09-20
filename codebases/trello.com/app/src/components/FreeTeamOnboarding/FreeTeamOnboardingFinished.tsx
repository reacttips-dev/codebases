import React, { useState } from 'react';
import { currentLocale } from '@trello/locale';
import { isDesktop } from '@trello/browser';
import { forTemplate, forNamespace } from '@trello/i18n';
import { UpsellOverlay } from 'app/src/components/FreeTrial/UpsellOverlay';
import { Overlay, OverlayBackground } from 'app/src/components/Overlay';
import {
  useFreeTrialEligibilityRules,
  FreeTrialPlanSelection,
} from 'app/src/components/FreeTrial';
import { Button } from '@trello/nachos/button';
import { BoardIcon } from '@trello/nachos/icons/board';
import { BusinessClassIcon } from '@trello/nachos/icons/business-class';
import { OrganizationIcon } from '@trello/nachos/icons/organization';
import { StarIcon } from '@trello/nachos/icons/star';
import { FreeTrialTestIds } from '@trello/test-ids';
import { Spinner } from '@trello/nachos/spinner';
import { useFreeTeamOnboarding } from './useFreeTeamOnboarding';
import { Analytics } from '@trello/atlassian-analytics';
import styles from './FreeTeamOnboardingFinished.less';
import { useFeatureFlag } from '@trello/feature-flag-client';

const format = forTemplate('free_team_onboarding');
const formatPromptPlanSelection = forNamespace(
  'upgrade-prompt-plan-selection-consolidated',
);

const formatHref = (pathname: string) => {
  return `/${currentLocale}/${pathname}`;
};

interface TileTipProps {
  tipText: string;
}

const TileTip = ({ tipText }: TileTipProps) => {
  return <div className={styles.tileTip}>{tipText}</div>;
};

interface TileContentProps {
  tipText: string;
  learnMoreUrl: string;
  orgId: string;
}

const TileContent = ({ tipText, learnMoreUrl, orgId }: TileContentProps) => {
  const onClickLearnMore = () => {
    Analytics.sendClickedLinkEvent({
      linkName: 'learnMoreLink',
      source: 'freeTeamGettingStartedScreen',
      attributes: {
        linkDestination: learnMoreUrl,
      },
      containers: {
        organization: {
          id: orgId,
        },
      },
    });
  };

  return (
    <>
      <TileTip tipText={tipText} />
      <a
        href={learnMoreUrl}
        target="_blank"
        className={styles.freeTrialButtonLink}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={() => onClickLearnMore()}
      >
        {format('learn-more')}
      </a>
    </>
  );
};

interface BcTileContentProps {
  isFreeTrialEligible: boolean;
  teamName: string;
  onFreeTrialLearnMoreClick: () => void;
  orgId: string;
}

const BcTileContent = ({
  isFreeTrialEligible,
  onFreeTrialLearnMoreClick,
  teamName,
  orgId,
}: BcTileContentProps) => {
  if (isDesktop()) {
    return (
      <TileContent
        tipText={format('step-up-your-team')}
        learnMoreUrl={formatHref('guide/team-administration')}
        orgId={orgId}
      />
    );
  }

  if (isFreeTrialEligible) {
    return (
      <>
        <TileTip tipText={format('start-your-free-trial')} />
        <a
          role="button"
          className={styles.freeTrialButtonLink}
          onClick={onFreeTrialLearnMoreClick}
        >
          {format('learn-more')}
        </a>
      </>
    );
  }

  return (
    <TileContent
      tipText={format('upgrade-your-team')}
      learnMoreUrl={`/${teamName}/billing`}
      orgId={orgId}
    />
  );
};

interface FreeTrialPlanProps {
  orgId: string;
  isFreeTrialLoading: boolean;
  onStartFreeTrial: () => void;
}

const FreeTrialPlan = ({
  orgId,
  isFreeTrialLoading,
  onStartFreeTrial,
}: FreeTrialPlanProps) => {
  const isRepackagedGtm = useFeatureFlag(
    'nusku.repackaging-gtm.features',
    false,
  );
  return (
    <div className={styles.freeTrialPlanWrapper}>
      <FreeTrialPlanSelection
        type="try-business-class"
        orgId={orgId}
        cta={
          <Button
            appearance="primary"
            size="fullwidth"
            data-test-id={FreeTrialTestIds.StartFreeTrialButton}
            onClick={onStartFreeTrial}
          >
            {isFreeTrialLoading ? (
              <Spinner centered small wrapperClassName={styles.spinner} />
            ) : (
              formatPromptPlanSelection(['try-business-class', 'cta'], {
                dayCount: 14,
              })
            )}
          </Button>
        }
        trialLength={14}
        isRepackagedGtm={isRepackagedGtm}
      />
    </div>
  );
};

interface FreeTrialBcInfoProps {
  orgId: string;
  isViewingPlan: boolean;
  isFreeTrialLoading: boolean;
  onFreeTrialBcOverlayClose: () => void;
  onStartFreeTrial: () => void;
  onLearnMoreClick: () => void;
}

const FreeTrialBcInfo = ({
  orgId,
  isViewingPlan,
  isFreeTrialLoading,
  onFreeTrialBcOverlayClose,
  onStartFreeTrial,
  onLearnMoreClick,
}: FreeTrialBcInfoProps) => {
  return (
    <Overlay
      onClose={onFreeTrialBcOverlayClose}
      background={OverlayBackground.DARK}
    >
      {isViewingPlan ? (
        <FreeTrialPlan
          orgId={orgId}
          isFreeTrialLoading={isFreeTrialLoading}
          onStartFreeTrial={onStartFreeTrial}
        />
      ) : (
        <UpsellOverlay
          onLearnMore={onLearnMoreClick}
          onCtaClick={onStartFreeTrial}
          orgId={orgId}
        />
      )}
    </Overlay>
  );
};

interface FreeTeamOnboardingFinishedProps {
  orgId: string;
  orgName: string;
}

export const FreeTeamOnboardingFinished: React.FC<FreeTeamOnboardingFinishedProps> = ({
  orgId,
  orgName,
}) => {
  const [shouldShowFreeTrialBcInfo, setShouldShowFreeTrialBcInfo] = useState(
    false,
  );
  const [isFreeTrialLoading, setFreeTrialLoading] = useState(false);
  const [isViewingPlan, setIsViewingPlan] = useState(false);

  Analytics.sendScreenEvent({
    name: 'freeTeamGettingFinishedStartedScreen',
    containers: {
      organization: { id: orgId },
    },
  });

  const {
    isEligible: isFreeTrialEligible,
    startFreeTrial,
  } = useFreeTrialEligibilityRules(orgId);

  const { isDismissing, dismissAndRedirect } = useFreeTeamOnboarding(orgId);

  const onStartFreeTrial = async () => {
    if (isFreeTrialLoading) {
      return;
    }

    Analytics.sendTrackEvent({
      action: 'accepted',
      actionSubject: 'freeTrial',
      source: 'freeTrialModal',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });

    setFreeTrialLoading(true);
    await startFreeTrial();
    setFreeTrialLoading(false);
  };

  const onFreeTrialBcOverlayClose = () => {
    setShouldShowFreeTrialBcInfo(false);
    setIsViewingPlan(false);
  };

  const onDismiss = async () => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'hideThisPageButton',
      source: 'freeTeamGettingStartedScreen',
      containers: {
        organization: {
          id: orgId,
        },
      },
    });

    dismissAndRedirect();
  };

  return (
    <div className={styles.learnMoreContainer}>
      <h2 className={styles.title}>{format('youre-off-to-a-great-start')}</h2>
      <p className={styles.subTitle}>{format('here-are-a-few-more-things')}</p>
      <div className={styles.learnMoreGrid}>
        <div className={styles.learnMoreSection}>
          <BoardIcon color="gray" size="large" />
          <TileContent
            tipText={format('explore-more-ways')}
            learnMoreUrl={formatHref('guide/feature-deep-dive')}
            orgId={orgId}
          />
        </div>
        <div className={styles.learnMoreSection}>
          <StarIcon color="gray" size="large" />
          <TileContent
            tipText={format('read-trello-tips')}
            learnMoreUrl={formatHref('guide/pro-tips')}
            orgId={orgId}
          />
        </div>
        <div className={styles.learnMoreSection}>
          <OrganizationIcon color="gray" size="large" />
          <TileContent
            tipText={format('get-trello-playbooks')}
            learnMoreUrl={formatHref('teams')}
            orgId={orgId}
          />
        </div>
        <div className={styles.learnMoreSection}>
          <BusinessClassIcon color="gray" size="large" />
          <BcTileContent
            isFreeTrialEligible={Boolean(isFreeTrialEligible)}
            // eslint-disable-next-line react/jsx-no-bind
            onFreeTrialLearnMoreClick={() => setShouldShowFreeTrialBcInfo(true)}
            teamName={orgName}
            orgId={orgId}
          />
        </div>
      </div>
      <Button
        className={styles.hideButton}
        // eslint-disable-next-line react/jsx-no-bind
        onClick={onDismiss}
        appearance="primary"
        isDisabled={isDismissing}
        shouldFitContainer
      >
        {isDismissing ? (
          <Spinner wrapperClassName={styles.spinner} inline />
        ) : (
          format('hide-this-page')
        )}
      </Button>
      {shouldShowFreeTrialBcInfo && (
        <FreeTrialBcInfo
          orgId={orgId}
          isViewingPlan={isViewingPlan}
          isFreeTrialLoading={isFreeTrialLoading}
          // eslint-disable-next-line react/jsx-no-bind
          onFreeTrialBcOverlayClose={onFreeTrialBcOverlayClose}
          // eslint-disable-next-line react/jsx-no-bind
          onStartFreeTrial={onStartFreeTrial}
          // eslint-disable-next-line react/jsx-no-bind
          onLearnMoreClick={() => setIsViewingPlan(true)}
        />
      )}
    </div>
  );
};
