import React from 'react';
import cx from 'classnames';
import { produce } from 'immer';
import { Command, CommandType } from '@atlassian/butler-command-parser';
import { Analytics, SourceType } from '@trello/atlassian-analytics';
import { Button } from '@trello/nachos/button';
import { CloseIcon } from '@trello/nachos/icons/close';
import { forNamespace } from '@trello/i18n';
import { CloseButton } from 'app/src/components/CloseButton';
import {
  formatActionCategory,
  formatTriggerCategory,
  getActionIcon,
  getTriggerIcon,
  getTriggerType,
  IconComponent,
} from 'app/src/components/Butler/CommandMetadata';
import { useAvailableActions } from './AvailableActions';
import { renderActionEditor } from './ActionEditors/renderActionEditor';
import { renderTriggerEditor } from './TriggerEditors/renderTriggerEditor';
import { EditorContext } from './types';
import styles from './CommandEditor.less';

const format = forNamespace(['butler', 'command editor']);

interface CommandEditorProps extends EditorContext {
  /**
   * The parsed command object. This should be stored & managed externally.
   * We currently don't have a flow for setting a trigger, so triggers must be
   * hydrated outside of this component.
   */
  command: Command;
  commandType: CommandType;
  source: SourceType;
  /**
   * Callback fired with an updated command draft produced via immer. Immer is
   * strongly recommended for managing the command state outside of this
   * component; the command draft emitted from this callback should be stored
   * as-is. The possible update events today are:
   * - Edit Trigger
   * - Edit Action
   * - Delete Action
   */
  onUpdateCommand: (updated: Command) => void;
  /**
   * Callback fired when the user clicks on the Add Action button; consumers
   * are responsible for providing their own Add Action screen.
   * (This is mostly because CreateListRulePopover lives in a legacy PopOver.)
   */
  onClickAddAction: () => void;
}

export const CommandEditor: React.FC<CommandEditorProps> = ({
  command,
  commandType,
  source,
  onUpdateCommand,
  onClickAddAction,
  ...context
}) => {
  const { TRIGGER: trigger, ACTION: actions } = command;
  const triggerType = getTriggerType(trigger);
  const availableActions = useAvailableActions(command, commandType);
  const canAddAction =
    actions.length < 10 &&
    availableActions.length &&
    (availableActions.length > 1 ||
      // If only one action is available and it's the same as the existing
      // action, dedupe it and omit the add flow.
      actions[0]?.type !== availableActions[0]);
  const canRemoveAction = actions.length > 1;

  const renderHeader = ({
    Icon,
    category,
    onClickRemove,
  }: {
    Icon: IconComponent;
    category: string;
    onClickRemove?: () => void;
  }) => (
    <div className={styles.header}>
      <div className={styles.category}>
        <Icon dangerous_className={styles.icon} />
        {/* eslint-disable-next-line -- category can have an ampersand char */}
        <span dangerouslySetInnerHTML={{ __html: category }}></span>
      </div>
      {onClickRemove ? (
        <CloseButton
          className={styles.removeButton}
          closeIcon={<CloseIcon color="quiet" size="xsmall" />}
          onClick={onClickRemove}
        />
      ) : null}
    </div>
  );

  return (
    <div className={styles.grid}>
      {trigger && triggerType ? (
        <>
          <p className={styles.sectionLabel}>{format('when')}</p>
          <div className={styles.trigger}>
            {renderHeader({
              Icon: getTriggerIcon(triggerType),
              category: formatTriggerCategory(triggerType),
            })}
            <div className={styles.editor}>
              {renderTriggerEditor({
                trigger,
                update: (updater) => {
                  onUpdateCommand(
                    produce(command, (draft) => {
                      updater(draft.TRIGGER!);
                    }),
                  );
                },
                ...context,
              })}
            </div>
          </div>
          <hr className={cx(styles.thread, styles['thread--md'])} />
          <p className={styles.sectionLabel}>{format('then')}</p>
          <hr className={cx(styles.thread, styles['thread--lg'])} />
        </>
      ) : (
        <p className={styles.sectionLabel}>{format('actions')}</p>
      )}

      {actions.map((action, index) => {
        const Icon = getActionIcon(action.type);
        return (
          <React.Fragment key={`butler-command-editor-action-${index}`}>
            <div className={styles.action}>
              {renderHeader({
                Icon,
                category: formatActionCategory(action.type),
                onClickRemove: canRemoveAction
                  ? () => {
                      onUpdateCommand(
                        produce(command, (draft) => {
                          draft.ACTION.splice(index, 1);
                        }),
                      );
                      Analytics.sendClickedButtonEvent({
                        buttonName: 'removeButlerActionButton',
                        source,
                      });
                    }
                  : undefined,
              })}
              <div className={styles.editor}>
                {renderActionEditor({
                  action,
                  update: (updater) => {
                    onUpdateCommand(
                      produce(command, (draft) => {
                        updater(draft.ACTION[index]);
                      }),
                    );
                  },
                  index,
                  ...context,
                })}
              </div>
            </div>
            {canAddAction || index < actions.length - 1 ? (
              <hr className={cx(styles.thread, styles['thread--sm'])} />
            ) : null}
          </React.Fragment>
        );
      })}
      {canAddAction ? (
        <Button
          appearance={actions.length === 0 ? 'primary' : 'default'}
          className={styles.addActionButton}
          size="fullwidth"
          onClick={onClickAddAction}
        >
          + {format('add action')}
        </Button>
      ) : null}
    </div>
  );
};
