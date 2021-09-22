import { observer } from 'mobx-react-lite';
import { useComputedValue } from 'owa-react-hooks/lib/useComputed';
import * as React from 'react';
import getMailListItemDataProps from '../utils/getMailListItemDataProps';
import MailListItemContainer from './MailListItemContainer';
import type MailListTableProps from '../utils/types/MailListTableProps';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { getTableItemRelation, getTableConversationRelation } from 'owa-mail-list-store';
import { SpotlightIconTeachingMoment } from 'owa-mail-spotlight-view';
import { isSpotlightItem } from 'owa-mail-spotlight';
import { shouldShowListView } from 'owa-mail-layout/lib/selectors/shouldShowListView';
import { DirectionalHint } from '@fluentui/react/lib/Callout';

export interface MailListItemDataProviderProps {
    rowKey: string;
    mailListTableProps: MailListTableProps;
    resetListViewContentTabIndex: () => void;
    isFocusInMailList: () => boolean;
    styleSelectorAsPerUserSettings: string;
}

export default observer(function MailListItemDataProvider(props: MailListItemDataProviderProps) {
    const tableConversationRelation = useComputedValue(() => {
        return getTableConversationRelation(props.rowKey, props.mailListTableProps.tableViewId);
    }, [props.rowKey, props.mailListTableProps.tableViewId]);
    const tableItemRelation = useComputedValue(() => {
        return getTableItemRelation(props.rowKey, props.mailListTableProps.tableViewId);
    }, [props.rowKey, props.mailListTableProps.tableViewId]);

    // Remark: The reason we have this wrapper component around MailListItem is to minimize the number of re-renders.
    // Since getting mail list item data props will bind to all item props for the row, we don't want to do this in MailListContent and cause
    // the list of re-render when a single item's prop changes. We also don't want to do this inside MailListItem because we want to pass this as props
    // so that computed properties can use these properties for computed states.
    const mailListItemDataProps = useComputedValue(() => {
        // Bug 1051: Investigate mobx behavior of calling render for a single removed item before calling render on the list
        // For conversation we check for the tableRelation existence as both tableRelation and the conversation are deleted same time
        // For item we check for the tableRelation as well as the item's existence that are in separate stores
        // Mobx calls render on this item before calling the mail list's render.
        if (props.mailListTableProps.listViewType == ReactListViewType.Conversation) {
            if (!tableConversationRelation) {
                return null;
            }
        } else {
            if (!tableItemRelation) {
                return null;
            }
        }
        return getMailListItemDataProps(props.rowKey, props.mailListTableProps);
    }, [
        props.rowKey,
        props.mailListTableProps,
        props.mailListTableProps.listViewType,
        props.mailListTableProps.isSingleLine,
        tableConversationRelation,
        tableItemRelation,
    ]);

    // Spotlight Teaching Moment shows on LV item only in non SLV
    const spotlightTeachingMomentTarget =
        mailListItemDataProps?.isSelected &&
        shouldShowListView() &&
        isSpotlightItem({ rowKey: props.rowKey }) &&
        !props.mailListTableProps.isSingleLine &&
        document.getElementById(props.rowKey);

    return (
        // VSO 25058: Investigate why conversationItem not found in store in getMailListItemDataProps
        mailListItemDataProps && (
            <>
                <MailListItemContainer
                    mailListTableProps={props.mailListTableProps}
                    mailListItemDataProps={mailListItemDataProps}
                    resetListViewContentTabIndex={props.resetListViewContentTabIndex}
                    isFocusInMailList={props.isFocusInMailList}
                    styleSelectorAsPerUserSettings={props.styleSelectorAsPerUserSettings}
                />
                {spotlightTeachingMomentTarget && (
                    <SpotlightIconTeachingMoment
                        delay={300}
                        directionalHint={DirectionalHint.rightCenter}
                        target={spotlightTeachingMomentTarget}
                    />
                )}
            </>
        )
    );
});
