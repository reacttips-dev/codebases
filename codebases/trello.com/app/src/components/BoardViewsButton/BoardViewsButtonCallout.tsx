import React, { useEffect } from 'react';
import styles from './BoardViewsButtonCallout.less';
import { CloseIcon } from '@trello/nachos/icons/close';
import { BoardHeaderTestIds } from '@trello/test-ids';
import { Analytics } from '@trello/atlassian-analytics';
import { VisualizeInNewWaysCallout } from './VisualizeInNewWaysCallout';
import { TableViewCallout } from './TableViewCallout';

export interface BoardViewsButtonCalloutProps {
  onClose?: () => void;
  idBoard: string;
  idOrg?: string;
  callout?: CalloutType;
}

export enum CalloutType {
  VisualizeInNewWays = 'VisualizeInNewWays',
  TableView = 'TableView',
  None = 'None',
}
export const BoardViewsButtonCallout: React.FC<BoardViewsButtonCalloutProps> = ({
  onClose,
  idBoard,
  idOrg,
  callout = CalloutType.None,
}) => {
  useEffect(() => {
    if (callout !== CalloutType.None) {
      Analytics.sendViewedComponentEvent({
        componentType: 'overlay',
        componentName: 'boardViewSwitcherCalloutOverlay',
        containers: {
          board: {
            id: idBoard,
          },
          organization: {
            id: idOrg,
          },
        },
        attributes: {
          calloutName: callout,
        },
        source: 'boardScreen',
      });
    }
  }, [idBoard, idOrg, callout]);

  if (callout === CalloutType.None) {
    return null;
  }

  let calloutMarkup = null;
  switch (callout) {
    case CalloutType.TableView:
      calloutMarkup = <TableViewCallout />;
      break;
    case CalloutType.VisualizeInNewWays:
      calloutMarkup = (
        <VisualizeInNewWaysCallout idBoard={idBoard} idOrg={idOrg} />
      );
      break;
    default:
      break;
  }

  return (
    <>
      <div className={styles.boardViewsCalloutPointer} />
      <div
        className={styles.boardViewsCallout}
        data-test-id={BoardHeaderTestIds.BoardViewsSwitcherCallout}
      >
        {calloutMarkup}
        <div
          className={styles.calloutCloseButtonWrapper}
          onClick={onClose}
          data-test-id={BoardHeaderTestIds.BoardViewsSwitcherCalloutClose}
          role={'button'}
        >
          <CloseIcon
            dangerous_className={styles.calloutCloseButton}
            size="small"
          />
        </div>
      </div>
    </>
  );
};
