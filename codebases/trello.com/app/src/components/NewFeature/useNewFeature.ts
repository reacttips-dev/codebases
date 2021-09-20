import { useCallback, useEffect, useMemo, useRef } from 'react';
import moment from 'moment';
import {
  Analytics,
  SourceType,
  getScreenFromUrl,
} from '@trello/atlassian-analytics';
import { idToDate } from '@trello/dates';
import { PersistentSharedState, useSharedState } from '@trello/shared-state';
import { useAcknowledgeNewFeatureMutation } from './AcknowledgeNewFeatureMutation.generated';
import {
  FeatureId,
  FeatureRolloutConfig,
  MOMENT_FORMAT,
} from './FeatureRolloutConfig';
import { useNewFeatureQuery } from './NewFeatureQuery.generated';

/**
 * Formats an ID to be stored in oneTimeMessagesDismissed. Retains the feature
 * ID and expiration date in ms, for the sake of potentially cleaning up
 * oneTimeMessagesDismissed after expiration dates.
 * @param featureId
 * @returns {string} messageId
 */
export const getOneTimeMessageId = (featureId: FeatureId) => {
  const [, expirationDate] = FeatureRolloutConfig[featureId];
  const expirationDateInMs = moment(expirationDate, MOMENT_FORMAT).valueOf();
  return `ack-new-feature-${featureId}-${expirationDateInMs}`;
};

export const seenFeaturesSessionKey = 'newFeaturesSeen';
type SeenFeaturesState = Partial<Record<FeatureId, boolean>>;
// eslint-disable-next-line @trello/no-module-logic
const seenFeaturesState = new PersistentSharedState<SeenFeaturesState>(
  {},
  { storageKey: seenFeaturesSessionKey, session: true },
);

interface UseNewFeatureHookResult {
  isNewFeature: boolean;
  acknowledgeNewFeature: (options: {
    source: SourceType;
    explicit?: boolean;
  }) => void;
}

/**
 * Determines whether a given feature is "new" for the current user, usually
 * for the sake of in-app messaging or bucketing. Uses a combination of the
 * user's start date (i.e. whether the user is newer than the feature),
 * a predetermined length of time for a feature to be marked as new,
 * and the user's oneTimeMessagesDismissed, which indicates whether they've
 * seen or interacted with the feature.
 *
 * Recently seen features remain marked new for the duration of the session
 * via SessionStorage unless explicitly dismissed.
 * @param featureId
 */
export const useNewFeature = (
  featureId: FeatureId,
): UseNewFeatureHookResult => {
  const { data } = useNewFeatureQuery();
  const [mutate] = useAcknowledgeNewFeatureMutation();
  const [seenFeatures, setSeenFeatures] = useSharedState(seenFeaturesState);

  const isNewFeature: boolean = useMemo(() => {
    if (!data?.member?.id) {
      // Default to false; this should always be a noncritical enhancement.
      return false;
    }
    const { id, oneTimeMessagesDismissed } = data.member;
    const signupDate = idToDate(id);
    const [releaseDate, expirationDate] = FeatureRolloutConfig[featureId];
    if (
      // If the feature rolled out before the user joined, return false;
      // this feature is as new as the rest of Trello is to them.
      moment(releaseDate, MOMENT_FORMAT).isBefore(signupDate) ||
      // The feature is no longer new!
      moment(expirationDate, MOMENT_FORMAT).isBefore(Date.now())
    ) {
      return false;
    }
    const messageId = getOneTimeMessageId(featureId);
    return !(oneTimeMessagesDismissed ?? []).includes(messageId);
  }, [data, featureId]);

  const hasSentOperationalEvent = useRef(false);
  useEffect(() => {
    if (isNewFeature && !hasSentOperationalEvent.current) {
      Analytics.sendOperationalEvent({
        action: 'exposed',
        actionSubject: 'newFeature',
        source: getScreenFromUrl(),
        attributes: { featureId },
      });
      hasSentOperationalEvent.current = true;
    }
  }, [featureId, isNewFeature, hasSentOperationalEvent]);

  const acknowledgeNewFeature = useCallback<
    UseNewFeatureHookResult['acknowledgeNewFeature']
  >(
    async ({ source, explicit = false }) => {
      const { [featureId]: hasSeenFeature, ...rest } = seenFeatures ?? {};
      if (isNewFeature) {
        const messageId = getOneTimeMessageId(featureId);
        await mutate({ variables: { messageId } });
        setSeenFeatures({ ...rest, [featureId]: !explicit });
      } else if (explicit && hasSeenFeature === true) {
        // An explicit acknowledgement can supercede previous implicit acks.
        setSeenFeatures({ ...rest, [featureId]: false });
      } else {
        // Don't fire analytics event if this was a noop.
        return;
      }
      Analytics.sendTrackEvent({
        action: 'acknowledged',
        actionSubject: 'newFeature',
        source,
        attributes: {
          featureId,
          explicit,
        },
      });
    },
    [featureId, isNewFeature, mutate, seenFeatures, setSeenFeatures],
  );

  return {
    // If the feature was only seen this session (and not explicitly dismissed),
    // it's still new for the duration of the session.
    isNewFeature: isNewFeature || !!seenFeatures?.[featureId],
    acknowledgeNewFeature,
  };
};
