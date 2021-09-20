import React, { FunctionComponent, useCallback } from 'react';
import { Popover, usePopover } from '@trello/nachos/popover';
import classnames from 'classnames';
import styles from './CheckItemOverflowMenu.less';
import { Analytics, tracingCallback } from '@trello/atlassian-analytics';
import { forNamespace, forTemplate } from '@trello/i18n';
import { Key, getKey } from '@trello/keybindings';
import { ChecklistTestIds, TestId } from '@trello/test-ids';

const formatButtons = forTemplate('check_item_menu');
const formatTitle = forNamespace('view title');

interface CheckItemOverflowMenuProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: any; //temporary hold since backbone model is passed in
  editableView?: boolean;
  testid?: TestId;
}

export const CheckItemOverflowMenu: FunctionComponent<CheckItemOverflowMenuProps> = ({
  model,
  editableView,
}) => {
  //Use Anchor Element for Easier Styling Compatibility with Old Stack.
  const {
    triggerRef,
    toggle,
    hide,
    popoverProps,
  } = usePopover<HTMLAnchorElement>();

  const convertToCard = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'convertCheckItemToCardButton',
      source: 'checkItemMenuInlineDialog',
    });

    hide();

    const traceId = Analytics.startTask({
      taskName: 'create-card/checkItem',
      source: 'checkItemMenuInlineDialog',
    });

    model.api(
      { method: 'convertToCard', traceId },
      tracingCallback(
        {
          taskName: 'create-card/checkItem',
          source: 'checkItemMenuInlineDialog',
          traceId,
        },
        (err) => {
          if (!err) {
            Analytics.sendTrackEvent({
              action: 'created',
              actionSubject: 'card',
              source: 'checkItemMenuInlineDialog',
              attributes: {
                taskId: traceId,
              },
            });
          }
        },
      ),
    );
    model.getChecklist().checkItemList.remove(model);

    return;
  }, [hide, model]);

  const deleteCheckitem = useCallback(() => {
    Analytics.sendClickedButtonEvent({
      buttonName: 'deleteCheckItemButton',
      source: 'checkItemMenuInlineDialog',
    });

    hide();

    const traceId = Analytics.startTask({
      taskName: 'delete-checkItem',
      source: 'checkItemMenuInlineDialog',
    });

    model.destroyWithTracing(
      { traceId },
      tracingCallback(
        {
          taskName: 'delete-checkItem',
          source: 'checkItemMenuInlineDialog',
          traceId,
        },
        (err) => {
          if (!err) {
            Analytics.sendTrackEvent({
              action: 'deleted',
              actionSubject: 'checkItem',
              source: 'checkItemMenuInlineDialog',
              attributes: {
                taskId: traceId,
              },
            });
          }
        },
      ),
    );

    return;
  }, [hide, model]);

  const togglePopover = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      Analytics.sendClickedButtonEvent({
        buttonName: 'checkItemMenuButton',
        source: 'cardDetailScreen',
      });

      toggle();
    },
    [toggle],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLAnchorElement>) => {
      if (getKey(e) === Key.Enter) {
        e.preventDefault();
        toggle();
      }
    },
    [toggle],
  );

  return (
    <>
      <a
        className={
          editableView ? styles.editableViewLink : styles.inlineEditViewLink
        }
        ref={triggerRef}
        onClick={togglePopover}
        role="button"
        tabIndex={0}
        onKeyDown={onKeyDown}
        data-test-id={ChecklistTestIds.ChecklistItemOverflowMenuButton}
      >
        <span className="icon-sm icon-overflow-menu-horizontal" />
      </a>
      <Popover
        {...popoverProps}
        title={formatTitle('check item')}
        noHorizontalPadding
        noVerticalPadding
      >
        <button
          className={classnames('convertButton', styles.overflowButton)}
          onClick={convertToCard}
          tabIndex={0}
          data-test-id={ChecklistTestIds.ChecklistItemConvertButton}
        >
          {formatButtons('convert-to-card')}
        </button>
        <button
          className={classnames('deleteButton', styles.overflowButton)}
          onClick={deleteCheckitem}
          tabIndex={0}
          data-test-id={ChecklistTestIds.ChecklistItemDeleteButton}
        >
          {formatButtons('delete')}
        </button>
      </Popover>
    </>
  );
};
