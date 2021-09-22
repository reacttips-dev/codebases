import { observer } from 'mobx-react-lite';
import { highlightTermsInHtmlElement } from 'owa-mail-highlight-terms';
import convertRecipientsToViewState from 'owa-recipient-create-viewstate/lib/util/convertRecipientsToViewState';
import { lazyLoadAllRecipientsForItem } from 'owa-mail-store-actions';
import mailStore from 'owa-mail-store/lib/store/Store';
import ReadOnlyExpandableRecipientWell from 'owa-readonly-recipient-well/lib/components/ReadOnlyExpandableRecipientWell';
import type ReadOnlyRecipientViewState from 'owa-recipient-types/lib/types/ReadOnlyRecipientViewState';
import { RecipientType } from 'owa-recipient-types/lib/types/RecipientType';
import type EmailAddressWrapper from 'owa-service/lib/contract/EmailAddressWrapper';
import type RecipientCountsType from 'owa-service/lib/contract/RecipientCountsType';
import { isFeatureEnabled } from 'owa-feature-flags';
import * as React from 'react';

import styles from './ConversationReadingPane.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface RecipientWellProps {
    toRecipients: EmailAddressWrapper[];
    ccRecipients: EmailAddressWrapper[];
    bccRecipients: EmailAddressWrapper[];
    itemId: string;
    recipientCounts: RecipientCountsType;
    isDeliveryReport: boolean;
    isV2RecipientWell?: boolean;
}

export default observer(function RecipientWell(props: RecipientWellProps) {
    const { toRecipients, ccRecipients, bccRecipients, recipientCounts } = props;
    const getAllRecipients = () => {
        lazyLoadAllRecipientsForItem.importAndExecute(mailStore.items.get(props.itemId));
    };
    const convertedToRecipients = convertRecipientsToViewState(toRecipients);
    const convertedCcRecipients = convertRecipientsToViewState(ccRecipients);
    const convertedBccRecipients = convertRecipientsToViewState(bccRecipients);

    const renderExpandableRecipientWell = (
        recipients: ReadOnlyRecipientViewState[],
        recipientsCount: number,
        recipientType: RecipientType
    ) => {
        if (!(recipients?.length > 0)) {
            return null;
        }

        const totalRecipients =
            !props.isDeliveryReport && recipientsCount > 0 ? recipientsCount : recipients.length;

        return (
            <ReadOnlyExpandableRecipientWell
                recipients={recipients}
                recipientsCount={totalRecipients}
                hasMoreRecipientsOnServer={!!(recipients.length < recipientsCount)}
                recipientType={recipientType}
                getAllRecipientsHandler={getAllRecipients}
                recipientPersonaRef={highlightTermsInHtmlElement}
            />
        );
    };

    const recipientWellContainerStyle = props.isV2RecipientWell
        ? styles.recipientWellV2
        : styles.recipientWell;

    const recipientWellClassNames = classNames(
        recipientWellContainerStyle,
        isFeatureEnabled('mon-tri-readingPaneRedlineUXUpdates') && styles.largerRecipientFontSize
    );

    return (
        <div className={recipientWellClassNames}>
            {renderExpandableRecipientWell(
                convertedToRecipients,
                recipientCounts?.ToRecipientsCount,
                RecipientType.To
            )}
            {renderExpandableRecipientWell(
                convertedCcRecipients,
                recipientCounts?.CcRecipientsCount,
                RecipientType.Cc
            )}
            {renderExpandableRecipientWell(
                convertedBccRecipients,
                recipientCounts?.BccRecipientsCount,
                RecipientType.Bcc
            )}
        </div>
    );
});
