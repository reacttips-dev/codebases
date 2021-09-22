import renderActionButton from '../utils/renderActionButton';
import { observer } from 'mobx-react-lite';
import { logUsage } from 'owa-analytics';
import type { ClientItemId } from 'owa-client-ids';
import loc from 'owa-localize';
import { itemHeaderForward } from 'owa-locstrings/lib/strings/itemheaderforward.locstring.json';
import { itemHeaderReply } from 'owa-locstrings/lib/strings/itemheaderreply.locstring.json';
import { itemHeaderReplyAll } from 'owa-locstrings/lib/strings/itemheaderreplyall.locstring.json';
import { lazyOpenCompose, lazyForwardMessage } from 'owa-mail-compose-actions';
import onReplyReplyAllInternal from 'owa-mail-reading-pane-item-actions-view/lib/handlers/onReplyReplyAllInternal';
import checkItemReplyForwardDisabled from 'owa-mail-reading-pane-item-actions/lib/utils/checkItemReplyForwardDisabled';
import isLastestItemLocalLie from 'owa-mail-reading-pane-store/lib/utils/isLastestItemLocalLie';
import type { ClientItem } from 'owa-mail-store';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import isReplyToAll from 'owa-readonly-recipient-well/lib/utils/isReplyToAll';
import type Item from 'owa-service/lib/contract/Item';
import { isFeatureEnabled } from 'owa-feature-flags';
import { IIconProps, ThemeProvider, PartialTheme } from '@fluentui/react';
import { getReplyButtonTheme } from 'owa-mail-densities/lib/utils/getReplyButtonTheme';
import ArrowReplyRegular from 'owa-fluent-icons-svg/lib/icons/ArrowReplyRegular';
import ArrowReplyAllRegular from 'owa-fluent-icons-svg/lib/icons/ArrowReplyAllRegular';
import ArrowForwardRegular from 'owa-fluent-icons-svg/lib/icons/ArrowForwardRegular';
import isMessageListSeparate from 'owa-mail-store/lib/utils/isMessageListSeparate';
import * as React from 'react';
import {
    shouldSuppressServerMarkReadOnReplyOrForward,
    getSelectedTableView,
} from 'owa-mail-list-store';

import styles from './GlobalReplyBar.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);
const hasReplyButtonsNext = isFeatureEnabled('mon-tri-replyButtons');
const hasDensityNext = isFeatureEnabled('mon-densities');

interface GlobalReplyBarProps {
    conversationId: ClientItemId;
    item: ClientItem;
    instrumentationContext: InstrumentationContext;
    targetWindow?: Window;
    densityMode?: string;
}

const Datapoint = {
    ReplyAction: 'GlobalReplyAction',
    ReplyAllAction: 'GlobalReplyAllAction',
    ForwardAction: 'GlobalForwardAction',
};

export const GlobalReplyBar = observer(function GlobalReplyBar(props: GlobalReplyBarProps) {
    const { item, conversationId, instrumentationContext, targetWindow, densityMode } = props;
    const message = item as Item;
    const isMessageView = !conversationId;
    const [replyDisabled, replyAllDisabled, forwardDisabled] = checkItemReplyForwardDisabled(
        message,
        !isMessageView /* isConversationItemPart */
    );
    const isSingleRecipient = !isReplyToAll(message);
    const importOpenCompose = () => {
        lazyOpenCompose.import();
    };

    const onReply = (event?: React.MouseEvent<unknown>) => {
        handleActionClicked(Datapoint.ReplyAction, isMessageView, event);
        onReplyReplyAllInternal(
            false /* isReplyAll */,
            !isMessageView /* isConversationItemPart */,
            item,
            instrumentationContext,
            targetWindow
        );
    };
    const onReplyAll = (event?: React.MouseEvent<unknown>) => {
        handleActionClicked(Datapoint.ReplyAllAction, isMessageView, event);
        onReplyReplyAllInternal(
            true /* isReplyAll */,
            !isMessageView /* isConversationItemPart */,
            item,
            instrumentationContext,
            targetWindow
        );
    };
    const onForward = (event?: React.MouseEvent<unknown>) => {
        handleActionClicked(Datapoint.ForwardAction, isMessageView, event);
        lazyForwardMessage.importAndExecute(
            props.item,
            item.MailboxInfo,
            'ReadingPane',
            [instrumentationContext],
            shouldSuppressServerMarkReadOnReplyOrForward(getSelectedTableView()),
            { targetWindow: targetWindow }
        );
    };

    const actionButtonClassName = classNames(
        styles.globalReplyAction,
        !hasDensityNext && styles.globalReplyActionHeight,
        densityMode,
        hasReplyButtonsNext && styles.monarchReplyBar
    );
    const isGroupItem = item?.MailboxInfo?.type === 'GroupMailbox';
    const replyBarClassName = classNames(
        styles.globalReplyBar,
        densityMode,
        hasDensityNext && isMessageListSeparate() && styles.unstacked
    );

    return isMessageView || !isLastestItemLocalLie(conversationId.Id) ? (
        <div tabIndex={-1} className={replyBarClassName} onMouseOver={importOpenCompose}>
            {!isGroupItem &&
                renderButton(
                    loc(itemHeaderReply),
                    onReply,
                    replyDisabled,
                    actionButtonClassName,
                    densityMode,
                    hasReplyButtonsNext && ArrowReplyRegular,
                    !hasReplyButtonsNext /* addSeparator */
                )}

            {!isSingleRecipient &&
                renderButton(
                    loc(itemHeaderReplyAll),
                    onReplyAll,
                    replyAllDisabled,
                    actionButtonClassName,
                    densityMode,
                    hasReplyButtonsNext && ArrowReplyAllRegular,
                    !hasReplyButtonsNext /* addSeparator */
                )}

            {renderButton(
                loc(itemHeaderForward),
                onForward,
                forwardDisabled,
                actionButtonClassName,
                densityMode,
                hasReplyButtonsNext && ArrowForwardRegular
            )}
        </div>
    ) : null;
});

function renderButton(
    name: string,
    onclick: (event?: React.MouseEvent<unknown>) => void,
    disabled: boolean,
    className: string,
    densityMode?: string,
    icon?: string,
    addSeparator?: boolean
): JSX.Element {
    let buttonTheme: PartialTheme | {} = {};

    if (hasDensityNext) {
        buttonTheme = getReplyButtonTheme(densityMode);
    }

    const iconProps: IIconProps = { iconName: icon };

    return (
        <>
            <ThemeProvider theme={buttonTheme}>
                {renderActionButton(name, onclick, disabled, className, iconProps)}
            </ThemeProvider>
            {addSeparator && <div className={styles.verticalSeparator} />}
        </>
    );
}

/**
 * Helper function to stop event propagation and log datapoints
 */
function handleActionClicked(
    datapoint: string,
    isMessageView: boolean,
    event?: React.MouseEvent<unknown>
) {
    event?.stopPropagation();
    logUsage(datapoint);

    if (isMessageView) {
        logUsage(datapoint + 'MessageView');
    }
}
