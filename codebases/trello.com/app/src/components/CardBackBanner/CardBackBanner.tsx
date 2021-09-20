import React, { useCallback, useEffect } from 'react';
import { useCardBackBannerQuery } from './CardBackBannerQuery.generated';
import { ArchivedCardBanner } from './ArchivedCardBanner';
import { ArchivedListBanner } from './ArchivedListBanner';
import { TemplateCardBanner } from './TemplateCardBanner';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { Null } from 'app/src/components/Null';
import {
  useFeatureFlag,
  featureFlagClient,
  EvaluationReason,
} from '@trello/feature-flag-client';
import { getFreeTrialProperties } from '@trello/organizations';
import { useOrgFreeTrialQuery } from './OrgFreeTrialQuery.generated';
import { Auth } from 'app/scripts/db/auth';
import { ViewSuggestionByPriority } from './ViewSuggestionByPriority';
import { PersistentSharedState, useSharedState } from '@trello/shared-state';
import { memberId } from '@trello/session-cookie';

const viewsExposureEventState = new PersistentSharedState<{
  lastReason?: EvaluationReason;
  lastEventSent: number;
}>(
  {
    lastEventSent: 0,
  },
  {
    storageKey: `remarkable.bc-trial-views-upsells-${memberId ?? 'anonymous'}`,
  },
);

interface CardBackBannerProps {
  idCard: string;
  editable: boolean;
  idOrg?: string;
  setIdToDismiss: (id: string) => void;
  isBC?: boolean;
}

export const CardBackBanner: React.FunctionComponent<CardBackBannerProps> = ({
  idCard,
  editable,
  idOrg,
  setIdToDismiss,
  isBC,
}) => {
  const [exposureEventState, setExposureEventState] = useSharedState(
    viewsExposureEventState,
  );
  useEffect(() => {
    // We want to send an exposure event when a user comes across this feature
    // but we don't want to overload the system by sending one every time a
    // card back is opened. By using a persistent shared state, we can ensure
    // that an event is sent only once per user per reason
    const { lastReason, lastEventSent } = exposureEventState;

    // up to one event per hour
    if (isBC && lastEventSent < Date.now() - 1000 * 60 * 60) {
      const reason = featureFlagClient.atlassianClient.getFlagDetails(
        'remarkable.bc-trial-views-upsells',
        false,
      ).evaluationDetail?.reason;

      if (reason !== undefined && reason !== lastReason) {
        featureFlagClient.getTrackedVariation(
          'remarkable.bc-trial-views-upsells',
          false,
          {
            idOrg,
            memberId,
            location: 'card',
          },
        );

        setExposureEventState({
          lastReason: reason,
          lastEventSent: Date.now(),
        });
      }
    }
  }, [isBC, idOrg, setExposureEventState, exposureEventState]);

  const suggestedViewsEnabled = useFeatureFlag(
    'remarkable.bc-trial-views-upsells',
    false,
  );

  const { data, loading, error } = useCardBackBannerQuery({
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      idCard,
    },
  });

  const { data: orgCreditData } = useOrgFreeTrialQuery(
    idOrg && suggestedViewsEnabled && isBC
      ? {
          variables: {
            orgId: idOrg,
          },
        }
      : { skip: true },
  );

  const setIdToDismissCallback = useCallback((id) => setIdToDismiss(id), [
    setIdToDismiss,
  ]);

  const allSuggestedBannersDismissed =
    Auth.me().isDismissed(`timeline-view-suggestion-${idOrg}`) &&
    Auth.me().isDismissed(`calendar-view-suggestion-${idOrg}`);

  const card = data && data.card ? data.card : null;

  const hasActiveFreeTrial = useCallback(() => {
    const orgCredits = orgCreditData?.organization?.credits;
    const orgProducts = orgCreditData?.organization?.products;
    const freeTrialProperties =
      orgCredits && orgProducts
        ? getFreeTrialProperties(
            orgCredits,
            orgProducts,
            orgCreditData?.organization?.paidAccount?.trialExpiration || '',
          )
        : undefined;

    return freeTrialProperties?.isActive;
  }, [orgCreditData]);

  if (!card || loading || error) {
    return null;
  }

  const hasCover = !!(
    card.cover &&
    (card.cover.color ||
      card.cover.idAttachment ||
      card.cover.idUploadedBackground)
  );

  const hasStickers = card.stickers && card.stickers.length > 0;

  if (card.isTemplate) {
    return (
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-panorama',
          feature: Feature.TemplateCard,
        }}
        errorHandlerComponent={Null}
      >
        <TemplateCardBanner
          idCard={idCard}
          hasStickers={hasStickers}
          hasCover={hasCover}
          editable={editable}
        />
      </ErrorBoundary>
    );
  }

  if (card.closed) {
    return <ArchivedCardBanner />;
  }

  if (card.list.closed) {
    return <ArchivedListBanner />;
  }

  if (
    suggestedViewsEnabled &&
    idOrg &&
    hasActiveFreeTrial() &&
    !allSuggestedBannersDismissed
  ) {
    return (
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-panorama',
          feature: Feature.ViewSuggestionUpsell,
        }}
      >
        <ViewSuggestionByPriority
          idCard={idCard}
          idBoard={card.idBoard}
          idOrg={idOrg}
          hasStickers={hasStickers}
          hasCover={hasCover}
          setIdToDismiss={setIdToDismissCallback}
        />
      </ErrorBoundary>
    );
  }

  return null;
};
