import React, {
  useState,
  useCallback,
  ReactNode,
  useMemo,
  useRef,
  useEffect,
} from 'react';
import {
  NudgeSpotlightV2,
  ExpandingBorderNudge,
} from '@atlassiansox/nudge-tooltip';
import { Analytics, formatContainers } from '@trello/atlassian-analytics';
import {
  SwitcherSpotlightCard,
  SwitcherSpotlightCardProps,
} from './SwitcherSpotlightCard';
import { forwardRefComponent } from 'app/src/forwardRefComponent';
import { ErrorBoundary } from 'app/src/components/ErrorBoundary';
import { Feature } from 'app/scripts/debug/constants';
import { SwitcherNudgeState } from './usePtSwitcherNudgeState';
import styles from './SwitcherSpotlight.less';
import { Key, getKey } from '@trello/keybindings';

export interface SwitcherSpotlightProps {
  nudgeState: SwitcherNudgeState;
  children: ReactNode;
}

const SwitcherSpotlightCore: React.FunctionComponent<SwitcherSpotlightProps> = ({
  nudgeState: {
    cardHidden,
    nudgeHidden,
    overlappingCollaborators,
    numOfCollaborators,
    currentBoardId,
    productName,
    cloudId,
    dismissCard,
    dismissNudge,
  },
  children,
}) => {
  const nudgeTestId = !nudgeHidden ? 'atlassian-app-switcher-nudge' : '';
  const autoShow = !cardHidden;

  const [toggleCardFn, setToggleCardFn] = useState<(show: boolean) => void>();
  const switcherContainerRef = useRef<HTMLDivElement>(null);

  const sendNudgeDisplayedEvent = useCallback(() => {
    Analytics.sendUIEvent({
      action: 'displayed',
      actionSubject: 'button',
      actionSubjectId: 'atlassianSwitcherHeaderNudgeButton',
      source: 'appHeader',
      containers: formatContainers({ idBoard: currentBoardId }),
    });
  }, [currentBoardId]);

  const sendNudgeDismissedEvent = useCallback(() => {
    Analytics.sendUIEvent({
      action: 'dismissed',
      actionSubject: 'button',
      actionSubjectId: 'atlassianSwitcherHeaderNudgeButton',
      source: 'appHeader',
      containers: formatContainers({ idBoard: currentBoardId }),
    });
  }, [currentBoardId]);

  const sendCardDisplayedEvent = useCallback(() => {
    Analytics.sendUIEvent({
      action: 'displayed',
      actionSubject: 'inlineDialog',
      actionSubjectId: 'atlassianSwitcherHeaderNudgeSpotlightInlineDialog',
      source: 'appHeader',
      containers: formatContainers({ idBoard: currentBoardId }),
      attributes: {
        autoShow,
        numOfCollaborators,
        productName,
        cloudId,
      },
    });
  }, [autoShow, cloudId, currentBoardId, numOfCollaborators, productName]);

  const sendCardDismissButtonClickedEvent = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'atlassianSwitcherHeaderNudgeSpotlightDismissButton',
      source: 'appHeader',
      containers: formatContainers({ idBoard: currentBoardId }),
      attributes: {
        autoShow,
        numOfCollaborators,
        productName,
        cloudId,
      },
    });
  }, [autoShow, cloudId, currentBoardId, numOfCollaborators, productName]);

  const sendCardDismissedByOutsideClickEvent = useCallback(() => {
    Analytics.sendDismissedComponentEvent({
      componentType: 'inlineDialog',
      componentName: 'atlassianSwitcherHeaderNudgeSpotlightInlineDialog',
      source: 'appHeader',
      containers: formatContainers({ idBoard: currentBoardId }),
      attributes: {
        autoShow,
        numOfCollaborators,
        productName,
        cloudId,
      },
    });
  }, [autoShow, cloudId, currentBoardId, numOfCollaborators, productName]);

  const onCardClose = useCallback(() => {
    dismissCard();
    toggleCardFn?.(false);
    sendCardDismissButtonClickedEvent();
  }, [dismissCard, sendCardDismissButtonClickedEvent, toggleCardFn]);

  const setNudgeHidden = useCallback(() => {
    dismissNudge();
    toggleCardFn?.(false);
  }, [dismissNudge, toggleCardFn]);

  const SpotlightCard = useMemo(
    () =>
      forwardRefComponent<HTMLDivElement, SwitcherSpotlightCardProps>(
        'SwitcherSpotlightCardWithData',
        (props, ref) => (
          <SwitcherSpotlightCard
            memberIds={overlappingCollaborators}
            product={productName}
            onClose={onCardClose}
            {...props}
            ref={ref}
          />
        ),
      ),
    [onCardClose, overlappingCollaborators, productName],
  );

  useEffect(() => {
    const focusHandler = (e: FocusEvent) => {
      if (e.target instanceof Node) {
        if (switcherContainerRef.current?.contains(e.target)) {
          toggleCardFn?.(true);
        }
      }
    };

    const keyHandler = (e: KeyboardEvent) => {
      if (getKey(e) === Key.Tab && e.target instanceof Node) {
        if (!switcherContainerRef.current?.contains(e.target)) {
          toggleCardFn?.(false);
        }
      }
    };

    document.addEventListener('focusin', focusHandler);
    document.addEventListener('keyup', keyHandler);

    return () => {
      document.removeEventListener('focusin', focusHandler);
      document.removeEventListener('keyup', keyHandler);
    };
  }, [toggleCardFn, onCardClose]);

  return (
    <NudgeSpotlightV2
      hidden={nudgeHidden}
      autoShow={autoShow}
      setHidden={setNudgeHidden}
      nudge={ExpandingBorderNudge}
      spotlight={SpotlightCard}
      onRender={sendNudgeDisplayedEvent}
      onShow={sendCardDisplayedEvent}
      onClick={sendNudgeDismissedEvent}
      onOutsideClick={sendCardDismissedByOutsideClickEvent}
      registerToggleCardFn={setToggleCardFn}
      position="bottom-start"
    >
      <div
        className={styles.E2E}
        data-test-id={nudgeTestId}
        ref={switcherContainerRef}
      >
        {children}
      </div>
    </NudgeSpotlightV2>
  );
};

// Using class component here, works better with fallback function
// Otherwise we see too many re-renders of the children
export class SwitcherSpotlight extends React.Component<SwitcherSpotlightProps> {
  fallback = () => <>{this.props.children}</>;

  render() {
    return (
      <ErrorBoundary
        tags={{
          ownershipArea: 'trello-workflowers',
          feature: Feature.PushTouchpointsSwitcherSpotlight,
        }}
        extraData={{ component: 'SwitcherSpotlightCore' }}
        errorHandlerComponent={this.fallback}
      >
        <SwitcherSpotlightCore {...this.props} />
      </ErrorBoundary>
    );
  }
}
