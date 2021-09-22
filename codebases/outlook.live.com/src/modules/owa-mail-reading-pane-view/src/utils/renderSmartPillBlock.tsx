import { isFeatureEnabled } from 'owa-feature-flags';
import { isSelf } from 'owa-mail-compose-actions/lib/utils/isSelf';
import type { ItemViewState } from 'owa-mail-reading-pane-store';
import { MailSmartPillBlock } from 'owa-mail-smart-pill';
import { FlightNames } from 'owa-mail-smart-pill-features';
import type { ClientItem } from 'owa-mail-store';
import type Message from 'owa-service/lib/contract/Message';
import getUserConfiguration from 'owa-session-store/lib/actions/getUserConfiguration';
import * as React from 'react';

export default function renderSmartPillBlock(
    item: ClientItem,
    viewState: ItemViewState,
    showOnTop?: boolean
): JSX.Element {
    // "mc-smartReply" is the master flight switch.
    const smartReplyFlightEnabled: boolean = isFeatureEnabled(FlightNames.SmartReply);

    if (smartReplyFlightEnabled) {
        const message = item as Message;

        // Don't show smart pills on messages in which recipient is the sender.
        const isSelfSender: boolean = message.Sender ? isSelf(message.Sender.Mailbox) : false;

        if (!isSelfSender) {
            // If UserOptions does not exist, just turn off the feature.
            const isSmartReplyOptionEnabled: boolean = getUserConfiguration()?.UserOptions
                ?.WebSuggestedRepliesEnabledForUser;

            if (isSmartReplyOptionEnabled) {
                return (
                    <MailSmartPillBlock
                        item={item}
                        viewState={viewState.smartPillViewState}
                        showOnTop={showOnTop}
                    />
                );
            }
        }
    }
    return null;
}
