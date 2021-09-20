import React, { useCallback, useEffect, useState } from 'react';
import { forTemplate } from '@trello/i18n';
import {
  LazySpotlightManager,
  LazySpotlightTarget,
  LazySpotlightTransition,
  LazySpotlight,
  Pulse,
} from 'app/src/components/Onboarding';
import styles from './SpotlightLoomCommentButton.less';
import { useSpotlightLoomOneTimeMessagesDismissedQuery } from './SpotlightLoomOneTimeMessagesDismissedQuery.generated';
import { useAddSpotlightLoomOneTimeMessagesDismissedMutation } from './AddSpotlightLoomOneTimeMessagesDismissedMutation.generated';
import { sendErrorEvent } from '@trello/error-reporting';
import { Feature } from 'app/scripts/debug/constants';
import { useCommentInputFocused } from './useCommentInputFocused';
import { useLoomSDK } from './useLoomSDK';
import { pauseShortcuts, resumeShortcuts } from '@trello/keybindings';
import { trelloClipboard } from 'app/scripts/lib/trello-clipboard';
const format = forTemplate('loom_spotlight');

const SPOTLIGHT_NAME = 'loomCommentButtonSpotlight';
const LOOM_SPOTLIGHT_ONE_TIME_MESSAGE_DISMISSED_NAME =
  'loom-comment-button-spotlight';

interface SpotlightLoomCommentButtonProps {}

export const SpotlightLoomCommentButton: React.FC<SpotlightLoomCommentButtonProps> = (
  props,
) => {
  const {
    data,
    error: oneTimeMessagesDismissedError,
  } = useSpotlightLoomOneTimeMessagesDismissedQuery();
  const [
    dismissOneTimeMessage,
  ] = useAddSpotlightLoomOneTimeMessagesDismissedMutation();
  const [inputFocused] = useCommentInputFocused();
  const [showSpotlight, setShowSpotlight] = useState(false);
  const [loomSDK] = useLoomSDK();
  const loomLoadedSuccessfully = !!loomSDK?.status().success;

  const hasNotDismissedLoomSpotlight =
    data?.member?.oneTimeMessagesDismissed &&
    !data.member.oneTimeMessagesDismissed.includes(
      LOOM_SPOTLIGHT_ONE_TIME_MESSAGE_DISMISSED_NAME,
    );

  useEffect(() => {
    if (oneTimeMessagesDismissedError) {
      sendErrorEvent(oneTimeMessagesDismissedError, {
        tags: {
          ownershipArea: 'trello-teamplates',
          feature: Feature.VideoRecordButton,
        },
      });
    }
  }, [oneTimeMessagesDismissedError]);

  useEffect(() => {
    return function resumeShortcutsIfPaused() {
      if (showSpotlight) {
        trelloClipboard.resumeShortcuts();
        resumeShortcuts();
      }
    };
  }, [showSpotlight]);

  const openSpotlight = useCallback(() => {
    setShowSpotlight(true);
    trelloClipboard.pauseShortcuts();
    pauseShortcuts();
  }, [setShowSpotlight]);

  const closeSpotlight = useCallback(() => {
    setShowSpotlight(false);
    resumeShortcuts();
    trelloClipboard.resumeShortcuts();
    dismissOneTimeMessage({
      variables: {
        messageId: LOOM_SPOTLIGHT_ONE_TIME_MESSAGE_DISMISSED_NAME,
      },
    });
  }, [setShowSpotlight, dismissOneTimeMessage]);

  if (hasNotDismissedLoomSpotlight && inputFocused && loomLoadedSuccessfully) {
    return (
      <LazySpotlightManager>
        <LazySpotlightTarget name={SPOTLIGHT_NAME}>
          <Pulse
            onClick={openSpotlight}
            className={styles.spotlightContainer}
            spotlightOpen={showSpotlight}
          >
            {props.children}
          </Pulse>
        </LazySpotlightTarget>
        <LazySpotlightTransition>
          {showSpotlight && (
            <LazySpotlight
              actions={[
                {
                  onClick: closeSpotlight,
                  text: format('got-it'),
                },
              ]}
              dialogPlacement="right top"
              target={SPOTLIGHT_NAME}
              key={SPOTLIGHT_NAME}
              dialogWidth={275}
            >
              <p>{format('loom-comment-button-explanation')}</p>
            </LazySpotlight>
          )}
        </LazySpotlightTransition>
      </LazySpotlightManager>
    );
  }
  return <>{props.children}</>;
};
