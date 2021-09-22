import MailListItemExpansionLoadMoreButton from './MailListItemExpansionLoadMoreButton';
import MailListItemPart from './MailListItemPart';
import { observer } from 'mobx-react-lite';
import { AriaProperties, AriaRoles } from 'owa-accessibility';
import Draggable from 'owa-dnd/lib/components/Draggable';
import { DraggableItemTypes } from 'owa-dnd/lib/utils/DraggableItemTypes';
import loc from 'owa-localize';
import { noSubject } from 'owa-locstrings/lib/strings/nosubject.locstring.json';
import { BusStopState, listViewStore } from 'owa-mail-list-store';
import isHxForksEnabled from 'owa-mail-store-unstacked/lib/utils/isHxForksEnabled';
import getItemForMailList from 'owa-mail-store/lib/selectors/getItemForMailList';
import type ConversationItemParts from 'owa-mail-store/lib/store/schema/ConversationItemParts';
import mailStore from 'owa-mail-store/lib/store/Store';
import canConversationLoadMore from 'owa-mail-store/lib/utils/canConversationLoadMore';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import type { MailListItemPartDragData } from 'owa-mail-types/lib/types/MailListItemPartDragData';
import * as React from 'react';
import {
    MAIL_ITEM_DRAG_YOFFSET,
    MAIL_ITEM_DRAG_XOFFSET,
    getMailListDragPreview,
} from '../utils/mailListDragUtil';

import styles from './MailListItemPart.scss';

export interface MailListItemExpansionProps {
    conversationId: string;
    tableViewId: string;
    isSingleLine: boolean;
    tableViewSupportsFlagging: boolean;
    styleSelectorAsPerUserSettings: string;
    isFocusInMailList: () => boolean;
    onUnmount: () => void;
    isFirstLevelExpansion?: boolean;
    bigHoverAction: string;
}

export default observer(function MailListItemExpansion(props: MailListItemExpansionProps) {
    const { isFirstLevelExpansion, conversationId, isSingleLine } = props;
    // Hook for when component unmounts
    React.useEffect(() => {
        return () => {
            props.onUnmount();
        };
    }, []);

    const onGetDragData = React.useCallback(
        () => getMailListExpansionDragData(props.tableViewId, isFirstLevelExpansion),
        [props]
    );
    const canDrag = React.useCallback(() => {
        return !isFirstLevelExpansion
            ? listViewStore.expandedConversationViewState.selectedNodeIds.length > 0
            : listViewStore.expandedConversationViewState.forks.length > 0;
    }, [props]);

    const conversationItem = listViewStore.conversationItems.get(conversationId);
    const displayItemParts = conversationItem.globalMessageCount > 1;
    const conversationItemParts: ConversationItemParts = mailStore.conversations.get(
        conversationItem.id
    );

    // this can happen when the item parts have just all be deleted
    // For Hx powered experience, we use conversationItemParts only for second level expansion
    if (
        !displayItemParts ||
        ((!isFirstLevelExpansion || !isHxForksEnabled()) && !conversationItemParts)
    ) {
        return null;
    }

    const isNewestItemsOnBottom = isNewestOnBottom();
    const expansionContainerStyles = styles.expansionContainer;
    const conversationAriaProps: AriaProperties = {
        role: AriaRoles.list,
        level: 1,
    };
    // The position of the load more button has 4 possibe cases:
    // 1. On the top of the list: if this conversation doesn't have root node and it's newest on bottom.
    // 2. Under the first item: if this conversation has root node and it's newest on bottom.
    // 3. Before the last item: if this conversation has root node and it's newest on top.
    // 4. On the bottom of the list: if this conversation doesn't have root node and it's newest on top.
    const nodeIds = isFirstLevelExpansion
        ? listViewStore.expandedConversationViewState.forks.map(fork => fork.id)
        : conversationItemParts.conversationNodeIds;
    return (
        <div className={expansionContainerStyles}>
            <Draggable
                canDrag={canDrag}
                getDragData={onGetDragData}
                getDragPreview={getMailListDragPreview}
                xOffset={MAIL_ITEM_DRAG_XOFFSET}
                yOffset={MAIL_ITEM_DRAG_YOFFSET}
                ariaProps={conversationAriaProps}>
                {nodeIds?.length > 0 &&
                    nodeIds.map((nodeId, index) => {
                        const mailListItemPart = (
                            <MailListItemPart
                                key={nodeId}
                                setSize={nodeIds.length}
                                positionInSet={index + 1}
                                allNodeIds={nodeIds}
                                nodeId={nodeId}
                                isFocusInMailList={props.isFocusInMailList}
                                tableViewId={props.tableViewId}
                                isSingleLine={isSingleLine}
                                tableViewSupportsFlagging={props.tableViewSupportsFlagging}
                                styleSelectorAsPerUserSettings={
                                    props.styleSelectorAsPerUserSettings
                                }
                                isFirstLevelExpansion={isFirstLevelExpansion}
                                bigHoverAction={props.bigHoverAction}
                            />
                        );

                        if (isNewestItemsOnBottom && index == 0) {
                            return (
                                <React.Fragment key={nodeId + 'loadMoreBottom'}>
                                    {mailListItemPart}
                                    {renderLoadMoreButton(
                                        isFirstLevelExpansion,
                                        true /* isNewestOnBottom */,
                                        conversationItemParts,
                                        isSingleLine
                                    )}
                                </React.Fragment>
                            );
                        } else if (!isNewestItemsOnBottom && index == nodeIds.length - 1) {
                            return (
                                <React.Fragment key={nodeId + 'loadMoreTop'}>
                                    {renderLoadMoreButton(
                                        isFirstLevelExpansion,
                                        false /* isNewestOnBottom */,
                                        conversationItemParts,
                                        isSingleLine
                                    )}
                                    {mailListItemPart}
                                </React.Fragment>
                            );
                        }
                        return mailListItemPart;
                    })}
            </Draggable>
        </div>
    );
});

const getMailListExpansionDragData = (
    tableViewId: string,
    isFirstLevelExpansion: boolean
): MailListItemPartDragData => {
    // Also rename this to getMailListRowDragData. May be get this information from the mailRowData getter api
    const itemIds = [];
    const subjects = [];
    const sizes = [];
    const expandedViewState = listViewStore.expandedConversationViewState;
    const selectedNodeIds = expandedViewState.selectedNodeIds;
    selectedNodeIds.forEach(nodeId => {
        const item = getItemForMailList(nodeId, isFirstLevelExpansion);
        if (item) {
            subjects.push(item.Subject ? item.Subject : loc(noSubject));
            itemIds.push(item.ItemId.Id);
            sizes.push(item.Size);
        }
    });

    return {
        itemType: DraggableItemTypes.MailListItemPart,
        tableViewId: tableViewId,
        subjects: subjects,
        itemIds: itemIds,
        nodeIds: selectedNodeIds,
        sizes: sizes,
    };
};

const renderLoadMoreButton = (
    isFirstLevelExpansion: boolean,
    isNewestItemsOnBottom: boolean,
    conversationItemParts: ConversationItemParts,
    isSingleLine: boolean
): JSX.Element => {
    if (
        !isFirstLevelExpansion &&
        canConversationLoadMore(conversationItemParts.conversationId.Id)
    ) {
        // load more bus stop is shown if the root node is showing a bus end
        const busStopStateMap = listViewStore.expandedConversationViewState.busStopStateMap;
        const conversationNodeIds = conversationItemParts.conversationNodeIds;
        const showBusStop = isNewestItemsOnBottom
            ? busStopStateMap.get(conversationNodeIds[0]) === BusStopState.BusEnd
            : busStopStateMap.get(conversationNodeIds[conversationNodeIds.length - 1]) ===
              BusStopState.BusEnd;
        return (
            <MailListItemExpansionLoadMoreButton
                conversationId={conversationItemParts.conversationId}
                isLoadMoreInProgress={conversationItemParts.isLoadMoreInProgress}
                isSingleLineView={isSingleLine}
                showBusStop={showBusStop}
            />
        );
    }

    return null;
};
