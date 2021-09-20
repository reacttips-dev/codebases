import React, { useEffect, useMemo } from 'react';
import {
  Action,
  ActionType,
  CommandType,
  Command,
} from '@atlassian/butler-command-parser';
import { Analytics } from '@trello/atlassian-analytics';
import { useFeatureFlag } from '@trello/feature-flag-client';
import {
  ACTION_METADATA,
  ActionContext,
  ActionMetadata,
  formatActionLabel,
  getActionIcon,
  getTriggerMetadata,
} from 'app/src/components/Butler/CommandMetadata';
import { hydrateAction } from './hydrateAction';
import styles from './AvailableActions.less';

export const useAvailableActions = (
  command: Command,
  commandType: CommandType,
): ActionType[] => {
  const triggerMetadata = getTriggerMetadata(command.TRIGGER);
  const currentActions = useMemo(
    () => new Set(command.ACTION?.map(({ type }) => type)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [command.ACTION.length],
  );
  const blocklist = useFeatureFlag<string[]>(
    'workflowers.bob-element-blocklist',
    [],
  );
  return useMemo(() => {
    const availableContexts: Set<ActionContext> = new Set();
    function addContext(context: ActionContext): void {
      availableContexts.add(context);
    }
    if (commandType === 'card-button') {
      addContext(ActionContext.Card);
    }

    if (triggerMetadata) {
      triggerMetadata.providedContext?.forEach(addContext);
    }

    currentActions.forEach((actionType) => {
      ACTION_METADATA[actionType]?.providedContext?.forEach(addContext);
    });

    return Object.entries(ACTION_METADATA).reduce(
      (acc, [type, data]: [ActionType, ActionMetadata]) => {
        const { requiredContext: rc } = data;
        if (
          (!blocklist?.includes(type) ?? true) &&
          (rc?.every(availableContexts.has.bind(availableContexts)) ?? true)
        ) {
          acc.push(type);
        }
        return acc;
      },
      [] as ActionType[],
    );
  }, [triggerMetadata, currentActions, blocklist, commandType]);
};

interface Props {
  command: Command;
  commandType: CommandType;
  onSelectAction: (action: Action) => void;
}

export const AvailableActions: React.FunctionComponent<Props> = ({
  command,
  commandType,
  onSelectAction,
}) => {
  useEffect(() => {
    Analytics.sendScreenEvent({
      name: 'addButlerActionInlineDialog',
      attributes: {
        commandType,
      },
    });
  }, [commandType]);

  const availableActions = useAvailableActions(command, commandType);

  const onClickAction = (actionType: ActionType) => {
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'menuItem',
      actionSubjectId: 'butlerActionMenuItem',
      source: 'addButlerActionInlineDialog',
      attributes: {
        actionType,
        commandType,
      },
    });
    const action = hydrateAction(actionType);
    onSelectAction(action);
  };

  return (
    <>
      {availableActions.flatMap((actionType) => {
        const label = formatActionLabel(actionType);
        if (!label) {
          return null;
        }
        const Icon = getActionIcon(actionType);
        return (
          <div
            key={`butler-actions-list-${actionType}`}
            className={styles.actionOption}
            // eslint-disable-next-line react/jsx-no-bind
            onClick={() => onClickAction(actionType)}
            role="button"
            style={{ cursor: 'pointer' }}
            tabIndex={0}
          >
            <Icon dangerous_className={styles.actionOptionIcon} />
            {label}
          </div>
        );
      })}
    </>
  );
};
