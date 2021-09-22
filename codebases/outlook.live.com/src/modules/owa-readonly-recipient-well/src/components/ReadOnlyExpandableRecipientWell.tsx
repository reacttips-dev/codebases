import { observer } from 'mobx-react-lite';
import ReadOnlyRecipientWell from './ReadOnlyRecipientWell';
import ReadOnlyTruncatedRecipientWell from './ReadOnlyTruncatedRecipientWell';
import type ReadOnlyRecipientViewState from 'owa-recipient-types/lib/types/ReadOnlyRecipientViewState';
import sortSelfFirst from '../utils/sortSelfFirst';
import type { RecipientType } from 'owa-recipient-types/lib/types/RecipientType';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';
import * as React from 'react';

interface ExpandableRecipientWellProps {
    recipients: ReadOnlyRecipientViewState[];
    recipientsCount: number;
    hasMoreRecipientsOnServer: boolean;
    recipientType: RecipientType;
    getAllRecipientsHandler?: () => void;
    recipientPersonaRef?: (ref: HTMLElement) => void;
}

export default observer(function ReadOnlyExpandableRecipientWell(
    props: ExpandableRecipientWellProps
) {
    const [isTruncated, setIsTruncated] = React.useState(true);

    const onToggleIsTruncated = (e: React.MouseEvent<unknown>) => {
        const { getAllRecipientsHandler } = props;
        e.stopPropagation();
        if (isTruncated && getAllRecipientsHandler) {
            if (props.hasMoreRecipientsOnServer) {
                getAllRecipientsHandler();
            }
        }
        setIsTruncated(!isTruncated);
    };

    const { recipients, recipientsCount, recipientType } = props;
    if (!isTruncated) {
        return (
            <ReadOnlyRecipientWell
                recipientType={recipientType}
                recipients={recipients}
                recipientPersonaRef={props.recipientPersonaRef}
            />
        );
    } else {
        const sortedForSelfRecipients: ReadOnlyRecipientViewState[] = isConsumer()
            ? sortSelfFirst(recipients)
            : recipients;

        return (
            <ReadOnlyTruncatedRecipientWell
                recipientType={recipientType}
                recipients={sortedForSelfRecipients}
                totalRecipientCount={recipientsCount}
                onToggleIsTruncated={onToggleIsTruncated}
                renderSelf={isConsumer()}
                useButtonForTruncatedCount={true}
            />
        );
    }
});
