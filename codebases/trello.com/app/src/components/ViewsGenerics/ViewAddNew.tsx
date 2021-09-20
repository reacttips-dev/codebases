import React from 'react';
import { Analytics } from '@trello/atlassian-analytics';

import { Button } from '@trello/nachos/button';
import { AddIcon } from '@trello/nachos/icons/add';
import { usePopover, Popover } from '@trello/nachos/popover';

import { forTemplate } from '@trello/i18n';
import { Feature } from 'app/scripts/debug/constants';

import { AddNewType, GroupByOption, ZoomLevel } from './types';

import styles from './ViewAddNew.less';

const format = forTemplate('views');

interface ViewAddNewProps {
  onSelect: (type: AddNewType) => void;
  overrideStyles?: CSSModule;
  grouping?: GroupByOption;
  zoom?: ZoomLevel;
  idOrg: string | null;
  idBoard: string | null;
  idEnterprise: string | null;
  feature: Feature;
}

export const ViewAddNew = React.forwardRef<HTMLButtonElement, ViewAddNewProps>(
  (
    {
      onSelect,
      overrideStyles = {},
      grouping,
      zoom,
      idOrg,
      idBoard,
      idEnterprise,
      feature,
    },
    ref,
  ) => {
    const {
      toggle,
      triggerRef,
      popoverProps,
      hide,
    } = usePopover<HTMLButtonElement>();

    const onOptionSelect = (type: AddNewType) => {
      onSelect(type);
      hide();
    };

    const onKeyUp = (e: React.KeyboardEvent<Element>, type: AddNewType) => {
      switch (e.which) {
        case 32: // space bar
          e.preventDefault(); // stop the document from scrolling
        // fallthrough
        case 13: // enter
          onOptionSelect(type);
          break;
        default:
          break;
      }
    };
    const source =
      feature === Feature.TimelineView
        ? 'timelineViewScreen'
        : 'calendarViewScreen';
    const addNewButton =
      feature === Feature.TimelineView
        ? 'timelineAddNewButton'
        : 'calendarAddNewButton';
    const addCardButton =
      feature === Feature.TimelineView
        ? 'timelineAddCardButton'
        : 'calendarAddCardButton';
    const addListButton =
      feature === Feature.TimelineView
        ? 'timelineAddListButton'
        : 'calendarAddListButton';

    return (
      <>
        <button
          ref={ref}
          className={styles.popoverPositioner}
          tabIndex={-1}
        ></button>
        <Button
          ref={triggerRef}
          // eslint-disable-next-line react/jsx-no-bind
          onClick={() => {
            Analytics.sendClickedButtonEvent({
              buttonName: addNewButton,
              source,
              containers: {
                organization: { id: idOrg },
                board: { id: idBoard },
                enterprise: { id: idEnterprise },
              },
              attributes: {
                groupBy: grouping,
                zoomLevel: zoom,
              },
            });
            toggle();
          }}
          iconBefore={<AddIcon size="small" />}
          className={overrideStyles.addNewButton}
        >
          {format('add')}
        </Button>
        <Popover {...popoverProps} size="small">
          <ul className="pop-over-list inline-check">
            <li key="card">
              <a
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => {
                  Analytics.sendClickedButtonEvent({
                    buttonName: addCardButton,
                    source,
                    containers: {
                      organization: { id: idOrg },
                      board: { id: idBoard },
                      enterprise: { id: idEnterprise },
                    },
                    attributes: {
                      groupBy: grouping,
                      zoomLevel: zoom,
                    },
                  });
                  onOptionSelect(AddNewType.CARD);
                }}
                // eslint-disable-next-line react/jsx-no-bind
                onKeyUp={(e) => onKeyUp(e, AddNewType.CARD)}
                role="button"
                className="pop-over-list-item"
                tabIndex={0}
              >
                {format('card')}
              </a>
            </li>
            <li key="list">
              <a
                // eslint-disable-next-line react/jsx-no-bind
                onClick={() => {
                  Analytics.sendClickedButtonEvent({
                    buttonName: addListButton,
                    source,
                    containers: {
                      organization: { id: idOrg },
                      board: { id: idBoard },
                      enterprise: { id: idEnterprise },
                    },
                    attributes: {
                      groupBy: grouping,
                      zoomLevel: zoom,
                    },
                  });
                  onOptionSelect(AddNewType.LIST);
                }}
                // eslint-disable-next-line react/jsx-no-bind
                onKeyUp={(e) => onKeyUp(e, AddNewType.LIST)}
                role="button"
                className="pop-over-list-item"
                tabIndex={0}
              >
                {format('list')}
              </a>
            </li>
          </ul>
        </Popover>
      </>
    );
  },
);
