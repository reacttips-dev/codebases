import React, {
  useRef,
  useEffect,
  useLayoutEffect,
  useCallback,
  useState,
} from 'react';
import classNames from 'classnames';
import { VideoIcon } from '@trello/nachos/icons/video';
import { IconColor } from '@trello/nachos/icon';
import { Tooltip } from '@trello/nachos/tooltip';
import { forTemplate } from '@trello/i18n';
import { Analytics, SourceType } from '@trello/atlassian-analytics';
import { getRecordSDK } from './getRecordSDK';

import styles from './VideoRecordButton.less';
import { useLoomSDK } from './useLoomSDK';
import { pauseShortcuts, resumeShortcuts } from '@trello/keybindings';
import { trelloClipboard } from 'app/scripts/lib/trello-clipboard';
import { isEdgeLegacy, isYandex } from '@trello/browser';

const format = forTemplate('list');

type LoomState =
  | 'closed'
  | 'pre-recording'
  | 'active-recording'
  | 'post-recording'
  | undefined;

export interface VideoRecordButtonProps {
  id: string;
  insert: (url: string) => (() => void) | Promise<() => void>;
  analyticsSource: SourceType;
  analyticsContainers: object;
  iconColor?: IconColor;
  className?: string;
  showTooltip?: boolean;
}

export const VideoRecordButton: React.FunctionComponent<VideoRecordButtonProps> = ({
  id,
  insert,
  analyticsSource,
  analyticsContainers,
  iconColor,
  className = '',
  showTooltip,
}) => {
  const [loomSDK, setLoomSDK] = useLoomSDK();
  const [runPolling, setRunPolling] = useState(false);
  const [loomState, setLoomState] = useState<LoomState>();
  const buttonRef = useRef(null);

  useEffect(() => {
    let intervalId: number;
    if (runPolling) {
      const POLL_INTERVAL = 500;
      intervalId = window.setInterval(() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const state: LoomState = (loomSDK as any)?.status().state;
        setLoomState(state);
        if (state === 'closed') {
          clearInterval(intervalId);
          setRunPolling(false);
        }
      }, POLL_INTERVAL);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [runPolling, loomSDK]);

  useEffect(() => {
    if (loomState) {
      if (loomState === 'closed' || loomState === 'active-recording') {
        resumeShortcuts();
        trelloClipboard.resumeShortcuts();
      } else {
        pauseShortcuts();
        trelloClipboard.pauseShortcuts();
      }
    }

    return () => {
      resumeShortcuts();
      trelloClipboard.resumeShortcuts();
    };
  }, [loomState]);

  useEffect(() => {
    // Loom's SDK does not yet filter out legacy Edge & Yandex.
    // Legacy Edge does not support modern JS syntax (like object spread)
    // nor does it support the MediaRecord API so we need to avoid calling setup
    // in the SDK to avoid errors being thrown.
    if (isEdgeLegacy() || isYandex()) {
      return;
    }

    async function fetchLoom() {
      const loomInstance = await getRecordSDK()?.waitOnInstance();

      if (!loomSDK) {
        setLoomSDK(loomInstance);
      }
    }

    fetchLoom();
  }, [loomSDK, setLoomSDK]);

  useLayoutEffect(() => {
    if (buttonRef?.current && loomSDK) {
      let traceId: string = '';
      loomSDK?.configureButton({
        element: buttonRef.current,
        hooks: {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onInsertClicked: (oembed: any) => {
            Promise.resolve(insert(oembed.sharedUrl)).then(() => {
              // After inserting a recording, document.activeElement is the Loom iframe
              // inside the shadowRoot (loom-sdk-record-overlay-shadow-root-id). For
              // Trello's keyboard shortcuts to work, the activeElement needs to shift
              // back to something in the main Trello document.  Calling blur here causes
              // document.activeElement to be document.body and shortcuts begin working again.
              if (document.activeElement instanceof HTMLIFrameElement) {
                document.activeElement.blur();
              }
            });
            Analytics.sendClickedButtonEvent({
              buttonName: 'insertRecordingButton',
              source: 'loomRecordingModal',
              containers: analyticsContainers,
            });
          },
          onStart: () => {
            traceId = Analytics.startTask({
              taskName: 'loom-recording',
              source: 'loomRecordingModal',
              containers: analyticsContainers,
            });
          },
          onCancel: () => {
            Analytics.taskAborted({
              taskName: 'loom-recording',
              traceId,
              source: 'videoRecordButton',
              containers: analyticsContainers,
            });
          },
          onComplete: () => {
            Analytics.taskSucceeded({
              taskName: 'loom-recording',
              traceId,
              source: 'videoRecordButton',
              containers: analyticsContainers,
            });
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onError: (error: any) => {
            Analytics.taskFailed({
              taskName: 'loom-recording',
              traceId,
              source: 'videoRecordButton',
              containers: analyticsContainers,
              error: new Error(error),
            });
          },
        },
      });
    }
  }, [loomSDK, insert, analyticsContainers]);

  const onButtonClick = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      source: analyticsSource,
      buttonName: 'videoRecordButton',
      containers: analyticsContainers,
    });
    setRunPolling(true);
  }, [analyticsSource, analyticsContainers, setRunPolling]);

  if (!loomSDK?.status().success) {
    return null;
  }

  const recordButton = (
    <button
      id={id}
      className={classNames(styles.recordButton, {
        [className]: !!className,
      })}
      ref={buttonRef}
      type="button"
      title={!showTooltip ? format('record-loom-video-beta') : ''}
      onClick={onButtonClick}
    >
      <VideoIcon size="small" color={iconColor} />
    </button>
  );

  // on the card back we don't use Nachos tooltip it's just the elements title
  if (!showTooltip) {
    return recordButton;
  }

  return (
    <Tooltip
      content={format('record-loom-video-beta')}
      delay={100}
      hideTooltipOnMouseDown
    >
      {recordButton}
    </Tooltip>
  );
};
