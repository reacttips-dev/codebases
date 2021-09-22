import { observer } from 'mobx-react-lite';
import type { IPoint } from '@fluentui/react/lib/Utilities';
import type { ActionSource } from 'owa-analytics-types';
import loc from 'owa-localize';
import { MailRowDataPropertyGetter } from 'owa-mail-list-store';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import * as lazyTriageActions from 'owa-mail-triage-action';
import { getAnchorForContextMenu } from 'owa-positioning';
import type FlagStatus from 'owa-service/lib/contract/FlagStatus';
import { trace } from 'owa-trace';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {
    flagCompleteToday,
    flagCompleteTomorrow,
    flagCompleteThisWeek,
    flagCompleteNextWeek,
    flagCompleteNoDate,
    flagCompleteMarkComplete,
    flagCompleteClearComplete,
    flagCompleteClearFlag,
} from './FlagContextMenu.locstring.json';
import getFlagCompleteState, {
    FlagCompleteEnum,
} from 'owa-mail-triage-action/lib/actions/helpers/getFlagCompleteState';
import {
    ContextualMenu,
    DirectionalHint,
    IContextualMenuItem,
} from '@fluentui/react/lib/ContextualMenu';
import type Message from 'owa-service/lib/contract/Message';
import { isFirstLevelExpanded } from 'owa-mail-list-store/lib/selectors/isConversationExpanded';
import getItemForMailList from 'owa-mail-store/lib/selectors/getItemForMailList';

export interface FlagContextMenuProps {
    rowKey: string;
    tableViewId: string;
    target: IPoint;
    item: Message;
    actionSource: ActionSource;
    flagStatus: FlagStatus;
}

const FlagContextMenu = observer(function FlagContextMenu(props: FlagContextMenuProps) {
    const { rowKey, tableViewId, flagStatus, target, item, actionSource } = props;
    return (
        <ContextualMenu
            target={target}
            items={getFlagMenuItems(rowKey, tableViewId, flagStatus, item, actionSource)}
            directionalHint={DirectionalHint.bottomLeftEdge}
            onDismiss={closeFlagContextMenu}
        />
    );
});

function getFlagMenuItems(
    rowKey: string,
    tableViewId: string,
    flagStatus: FlagStatus,
    item: Message,
    actionSource: ActionSource
): IContextualMenuItem[] {
    const flagMenuItems: any = [
        {
            key: loc(flagCompleteToday),
            name: loc(flagCompleteToday),
            onClick: () => {
                setFlagState(
                    rowKey,
                    tableViewId,
                    item,
                    FlagCompleteEnum.today,
                    actionSource,
                    true // override
                );
            },
        },
        {
            key: loc(flagCompleteTomorrow),
            name: loc(flagCompleteTomorrow),
            onClick: () => {
                setFlagState(
                    rowKey,
                    tableViewId,
                    item,
                    FlagCompleteEnum.tomorrow,
                    actionSource,
                    true // override
                );
            },
        },
        {
            key: loc(flagCompleteThisWeek),
            name: loc(flagCompleteThisWeek),
            onClick: () => {
                setFlagState(
                    rowKey,
                    tableViewId,
                    item,
                    FlagCompleteEnum.thisWeek,
                    actionSource,
                    true // override
                );
            },
        },
        {
            key: loc(flagCompleteNextWeek),
            name: loc(flagCompleteNextWeek),
            onClick: () => {
                setFlagState(
                    rowKey,
                    tableViewId,
                    item,
                    FlagCompleteEnum.nextWeek,
                    actionSource,
                    true // override
                );
            },
        },
        {
            key: loc(flagCompleteNoDate),
            name: loc(flagCompleteNoDate),
            onClick: () => {
                setFlagState(
                    rowKey,
                    tableViewId,
                    item,
                    FlagCompleteEnum.noDate,
                    actionSource,
                    true // override
                );
            },
        },
        {
            key: loc(flagCompleteMarkComplete),
            name: loc(flagCompleteMarkComplete),
            disabled: flagStatus == 'Complete',
            onClick: () => {
                setFlagState(rowKey, tableViewId, item, FlagCompleteEnum.complete, actionSource);
            },
        },
    ];

    // Clear option depends on current context (Complete|Flagged)
    if (flagStatus == 'Complete') {
        flagMenuItems.push({
            key: loc(flagCompleteClearComplete),
            name: loc(flagCompleteClearComplete),
            onClick: () => {
                setFlagState(rowKey, tableViewId, item, FlagCompleteEnum.clear, actionSource);
            },
        });
    } else {
        flagMenuItems.push({
            key: loc(flagCompleteClearFlag),
            name: loc(flagCompleteClearFlag),
            disabled: flagStatus == null || flagStatus == 'NotFlagged',
            onClick: () => {
                setFlagState(rowKey, tableViewId, item, FlagCompleteEnum.clear, actionSource);
            },
        });
    }
    return flagMenuItems;
}

function setFlagState(
    rowKey: string,
    tableViewId: string,
    item: Message,
    flagCompleteValue: FlagCompleteEnum,
    actionSource: ActionSource,
    override?: boolean
) {
    const flagType = getFlagCompleteState(flagCompleteValue);
    if (flagType) {
        trace.warn(JSON.stringify(flagType));
    }
    // performing operation on an item part
    if (item) {
        lazyTriageActions.lazySetItemsFlagStateFromItemIds.importAndExecute(
            [item.ItemId.Id],
            null,
            flagType,
            tableViewId,
            actionSource
        );
        // performing operation on a mail list row
    } else {
        lazyTriageActions.lazySetMailListRowsFlagState.importAndExecute(
            [rowKey],
            tableViewId,
            flagType,
            actionSource,
            override
        );
    }
}

function closeFlagContextMenu() {
    if (contextMenuDiv) {
        ReactDOM.unmountComponentAtNode(contextMenuDiv);
        contextMenuDiv.parentNode.removeChild(contextMenuDiv);
        contextMenuDiv = null;
    }
}

let contextMenuDiv: HTMLDivElement = null;
export default function getFlagContextMenu(
    rowKey: string,
    tableViewId: string,
    nodeId: string,
    actionSource: ActionSource,
    evt: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>
) {
    const item = getItemForMailList(nodeId, isFirstLevelExpanded(rowKey));
    const tableView = listViewStore.tableViews.get(tableViewId);
    const flagStatus = item
        ? item.Flag.FlagStatus
        : MailRowDataPropertyGetter.getFlagStatus(rowKey, tableView);

    contextMenuDiv = document.createElement('div');
    document.body.appendChild(contextMenuDiv);

    ReactDOM.render(
        <React.StrictMode>
            <FlagContextMenu
                flagStatus={flagStatus}
                rowKey={rowKey}
                tableViewId={tableViewId}
                item={item}
                actionSource={actionSource}
                target={getAnchorForContextMenu(evt)}
            />
        </React.StrictMode>,
        contextMenuDiv
    );
}
