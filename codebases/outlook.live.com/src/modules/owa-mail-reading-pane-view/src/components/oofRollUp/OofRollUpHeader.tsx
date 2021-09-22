import { observer } from 'mobx-react-lite';
import {
    singleItemOofText,
    doubleItemsOofText,
    oofItemsNOthersText,
    multipleItemsOofText,
    deleteAllOofMessagesButtonAriaText,
} from './OofRollUpHeader.locstring.json';
import loc, { format, formatToArray } from 'owa-localize';
import { IconButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
import { logUsage } from 'owa-analytics';
import { ControlIcons } from 'owa-control-icons';
import { MailIcons } from 'owa-mail-icons';
import type { ClientItem } from 'owa-mail-store';
import type { ItemPartViewState } from 'owa-mail-reading-pane-store';
import toggleSelectItemPart from 'owa-mail-reading-pane-store/lib/actions/toggleSelectItemPart';
import truncateCountForDataPointAggregation from 'owa-mail-store/lib/utils/truncateCountForDataPointAggregation';
import { lazyDeleteItems } from 'owa-mail-triage-action';
import type Message from 'owa-service/lib/contract/Message';
import type SingleRecipientType from 'owa-service/lib/contract/SingleRecipientType';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getDensityModeString } from 'owa-fabric-theme';
import { ThemeProvider } from '@fluentui/react/lib/utilities/ThemeProvider';
import { getAutomaticReplyTheme } from 'owa-mail-densities/lib/utils/getAutomaticReplyTheme';
import * as React from 'react';

import styles from './OofRollUp.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface OofRollUpHeaderProps {
    oofItems: ClientItem[];
    onClickOofRollUpHeader: () => void;
    parentItemPartViewState: ItemPartViewState;
}

export default observer(function OofRollUpHeader(props: OofRollUpHeaderProps) {
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const summarizeOofRecipientsInfo = (): JSX.Element => {
        const { oofItems } = props;
        let summarizeTextElement: (string | JSX.Element)[];
        if (oofItems.length === 1) {
            const firstRecipientNameBold = getBoldRecipientNameFromMessage(oofItems[0]);
            summarizeTextElement = formatToArray(loc(singleItemOofText), firstRecipientNameBold);
        } else if (oofItems.length === 2) {
            const firstRecipientNameBold = getBoldRecipientNameFromMessage(oofItems[0]);
            const secondRecipientNameBold = getBoldRecipientNameFromMessage(oofItems[1]);
            summarizeTextElement = formatToArray(
                loc(doubleItemsOofText),
                firstRecipientNameBold,
                secondRecipientNameBold
            );
        } else {
            const firstRecipientNameBold = getBoldRecipientNameFromMessage(oofItems[0]);
            const secondRecipientNameBold = getBoldRecipientNameFromMessage(oofItems[1]);
            const thirdPlaceholderBold =
                oofItems.length === 3 ? (
                    getBoldRecipientNameFromMessage(oofItems[2])
                ) : (
                    <span className={styles.summaryPlaceHolderText}>
                        {format(loc(oofItemsNOthersText), oofItems.length - 2)}
                    </span>
                );
            summarizeTextElement = formatToArray(
                loc(multipleItemsOofText),
                firstRecipientNameBold,
                secondRecipientNameBold,
                thirdPlaceholderBold
            );
        }
        return (
            <span
                className={classNames(
                    hasDensityNext && getDensityModeString(),
                    styles.summarizeText
                )}>
                {summarizeTextElement}
            </span>
        );
    };
    const deleteOofItems = evt => {
        const itemIds = props.oofItems.map(item => item.ItemId.Id);
        lazyDeleteItems.importAndExecute(itemIds, 'SoftDelete', []);
        evt.preventDefault();
        evt.stopPropagation();
        logUsage('RPOofFilterDeleteAllMessages', [
            truncateCountForDataPointAggregation(itemIds.length),
        ]);
        toggleSelectItemPart(
            props.oofItems[0].ConversationId?.Id,
            props.parentItemPartViewState,
            false /*toggleExpandCollapse*/
        );
    };
    const { onClickOofRollUpHeader } = props;
    return (
        <ThemeProvider theme={getAutomaticReplyTheme(hasDensityNext && getDensityModeString())}>
            <div
                className={classNames(
                    hasDensityNext && getDensityModeString(),
                    styles.oofRollUpHeader
                )}
                onClick={onClickOofRollUpHeader}>
                <Icon
                    className={!hasDensityNext && styles.oofIcon}
                    iconName={MailIcons.OutOfOffice}
                />
                {summarizeOofRecipientsInfo()}

                {!hasDensityNext && (
                    <IconButton
                        ariaLabel={loc(deleteAllOofMessagesButtonAriaText)}
                        className={styles.deleteIcon}
                        onClick={deleteOofItems}
                        iconProps={{
                            iconName: ControlIcons.Delete,
                        }}
                    />
                )}
            </div>
        </ThemeProvider>
    );
});

function getBoldRecipientNameFromMessage(message: Message): JSX.Element {
    if (message) {
        const from: SingleRecipientType = message.From ? message.From : message.Sender;
        return (
            <span key={from.Mailbox.Name} className={styles.summaryPlaceHolderText}>
                {from.Mailbox.Name}
            </span>
        );
    }
    return null;
}
