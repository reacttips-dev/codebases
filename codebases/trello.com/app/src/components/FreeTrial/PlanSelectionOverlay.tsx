import React, { useState, useEffect } from 'react';
import styles from './PlanSelectionOverlay.less';
import classNames from 'classnames';
import { forNamespace } from '@trello/i18n';
import { Overlay, OverlayBackground } from 'app/src/components/Overlay';
import { ComponentWrapper } from 'app/src/components/ComponentWrapper';
import { ExpiredTrialPlanSelection } from './ExpiredTrialPlanSelection';
import { FreeTrialPlanSelection } from './FreeTrialPlanSelection';
import { UpsellOverlay } from './UpsellOverlay';
import {
  useFreeTrialEligibilityRules,
  StartFreeTrialOptions,
} from './useFreeTrialEligibilityRules';
import { Analytics } from '@trello/atlassian-analytics';
import { Spinner } from '@trello/nachos/spinner';
import { usePlanSelectionOverlayQuery } from './PlanSelectionOverlayQuery.generated';
import { FreeTrialTestIds } from '@trello/test-ids';
import { useStandard } from 'app/src/components/StandardGenerics';
import { useFeatureFlag } from '@trello/feature-flag-client';
import { BackIcon } from '@trello/nachos/icons/back';
import { CloseIcon } from '@trello/nachos/icons/close';
import { Button, ButtonLink } from '@trello/nachos/button';

const format = forNamespace('upgrade-prompt-plan-selection-consolidated');
const formatPrompt = forNamespace('upgrade prompt plan selection');

/**
 * PlanSelectionOverlay props
 *
 * showDefault: renders ExpiredTrialPlanSelection regardless of free trial eligibility/status
 * orgId: gives the context of the org
 * onClose: callback to handle any clicks outside the overlay or on the 'x' button
 */
interface Props {
  orgId: string;
  onClose(): void;
  currentPlanSelected?: string;
  startFreeTrialOptions?: StartFreeTrialOptions;
  showDefault?: boolean;
}

export const PlanSelectionOverlay: React.FunctionComponent<Props> = ({
  onClose,
  orgId,
  currentPlanSelected,
  startFreeTrialOptions,
  showDefault,
}) => {
  const { data, loading } = usePlanSelectionOverlayQuery({
    variables: {
      orgId,
    },
    skip: !orgId,
  });
  const isRepackagedGtm = useFeatureFlag(
    'nusku.repackaging-gtm.features',
    false,
  );
  const { isStandardVariationEnabled } = useStandard({ orgId });
  const isStandardVisible = isRepackagedGtm || isStandardVariationEnabled;
  const teamName = data?.organization?.name;
  const meId = data?.member?.id;
  const isAdmin = data?.organization?.memberships?.find(
    (member) => member.idMember === meId && member.memberType === 'admin',
  );

  const {
    isEligible,
    isTrialActive,
    startFreeTrial,
    loading: freeTrialRulesLoading,
  } = useFreeTrialEligibilityRules(orgId);

  const [isViewingPlan, setIsViewingPlan] = useState(false);
  const [isAddingFreeTrial, setFreeTrialAdding] = useState(false);
  const isFreeTrialModal =
    isRepackagedGtm &&
    isEligible &&
    !isTrialActive &&
    !isViewingPlan &&
    !showDefault;

  useEffect(() => {
    if (isTrialActive && isAddingFreeTrial) {
      onClose();
      // we dont really need to call this if we are unmounting the component.
      setFreeTrialAdding(false);
    }
  }, [onClose, isTrialActive, isAddingFreeTrial]);

  const onStartFreeTrial = async () => {
    if (isAddingFreeTrial) {
      return;
    }

    setFreeTrialAdding(true);

    Analytics.sendTrackEvent({
      action: 'accepted',
      actionSubject: 'freeTrial',
      source: 'freeTrialModal',
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        currentPlanSelected,
      },
    });

    await startFreeTrial(startFreeTrialOptions);
  };

  const goBackWithTracking = async () => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'backButton',
      source: 'planSelectionModal',
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        currentPlanSelected,
      },
    });
    setIsViewingPlan(false);
  };

  const closeOverlayWithTracking = async () => {
    Analytics.sendClosedComponentEvent({
      componentType: 'modal',
      componentName: 'freeTrialModal',
      source: 'planSelectionModal',
      containers: {
        organization: {
          id: orgId,
        },
      },
      attributes: {
        currentPlanSelected,
      },
    });
    onClose();
  };

  if (loading || freeTrialRulesLoading) {
    return null;
  }

  let children = (
    <ExpiredTrialPlanSelection
      cta={
        <ButtonLink
          className={
            isRepackagedGtm
              ? classNames(
                  styles.planSelectionCtaButton,
                  styles.ctaButtonRebrand,
                )
              : styles.planSelectionCtaButton
          }
          isPrimary
          onClick={onClose}
          link={isAdmin ? `/${teamName}/billing` : '/business-class'}
          openInNewTab={!isAdmin}
        >
          {format(['expired-free-trial-upgrade', 'cta'])}
        </ButtonLink>
      }
      type="have-business-class"
      isStandardVariationEnabled={isStandardVariationEnabled}
      isRepackagedGtm={isRepackagedGtm}
    />
  );

  if (!showDefault && (isEligible || isAddingFreeTrial)) {
    if (isViewingPlan) {
      children = (
        <FreeTrialPlanSelection
          type="try-business-class"
          orgId={orgId}
          cta={
            <Button
              className={isRepackagedGtm ? styles.ctaButtonRebrand : ''}
              appearance="primary"
              size="fullwidth"
              data-test-id={FreeTrialTestIds.StartFreeTrialButton}
              // eslint-disable-next-line react/jsx-no-bind
              onClick={onStartFreeTrial}
            >
              {isAddingFreeTrial ? (
                <Spinner centered small wrapperClassName={styles.spinner} />
              ) : (
                format(['try-business-class', 'cta'], {
                  dayCount: 14,
                })
              )}
            </Button>
          }
          trialLength={14}
          isStandardVariationEnabled={isStandardVariationEnabled}
          isRepackagedGtm={isRepackagedGtm}
        />
      );
    } else {
      children = (
        <UpsellOverlay
          // eslint-disable-next-line react/jsx-no-bind
          onCtaClick={onStartFreeTrial}
          isLoading={isAddingFreeTrial}
          orgId={orgId}
          // eslint-disable-next-line react/jsx-no-bind
          onLearnMore={() => setIsViewingPlan(true)}
        />
      );
    }
  } else if (!showDefault && isTrialActive) {
    children = (
      <FreeTrialPlanSelection
        type="have-business-class"
        cta={
          <ButtonLink
            isPrimary
            link="/business-class"
            className={
              isRepackagedGtm
                ? classNames(
                    styles.freeTrialPlanSelectionCtaButton,
                    styles.ctaButtonRebrand,
                  )
                : styles.freeTrialPlanSelectionCtaButton
            }
          >
            {formatPrompt('learn bc')}
          </ButtonLink>
        }
        orgId={orgId}
        trialLength={14}
        isStandardVariationEnabled={isStandardVariationEnabled}
        isRepackagedGtm={isRepackagedGtm}
      />
    );
  }

  return (
    <Overlay onClose={onClose} background={OverlayBackground.DARK}>
      <div
        className={classNames(
          styles.animation,
          styles.overlay,
          styles.overlayExistingTeams,
          (isTrialActive || isViewingPlan) && styles.overlayViewingPlan,
          isStandardVisible && styles.overlayExpanded,
          isFreeTrialModal && styles.overlayReduced,
        )}
        tabIndex={-1}
        // eslint-disable-next-line react/jsx-no-bind
        ref={(el) => {
          if (el) {
            // bring focus to overlay container
            el.focus();
          }
        }}
      >
        {isViewingPlan && (
          <button
            className={styles.back}
            title="Todo"
            aria-label="Todo"
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => goBackWithTracking()}
          >
            <BackIcon size="large" block />
          </button>
        )}
        <button
          className={styles.close}
          title={formatPrompt('close')}
          aria-label={formatPrompt('close')}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => closeOverlayWithTracking()}
        >
          <CloseIcon size="large" block />
        </button>
        {children}
      </div>
    </Overlay>
  );
};

export const PlanSelectionOverlayConnected: React.FunctionComponent<Props> = (
  props,
) => (
  <ComponentWrapper>
    <PlanSelectionOverlay {...props} />
  </ComponentWrapper>
);
