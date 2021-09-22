import ReadOnlyRecipientWell from './ReadOnlyRecipientWell';
import type ReadOnlyRecipientViewState from 'owa-recipient-types/lib/types/ReadOnlyRecipientViewState';
import { observer } from 'mobx-react-lite';
import { RecipientType } from 'owa-recipient-types/lib/types/RecipientType';
import * as React from 'react';

export interface ReadOnlyPrintRecipientWellProps {
    toRecipients: ReadOnlyRecipientViewState[];
    ccRecipients: ReadOnlyRecipientViewState[];
    bccRecipients: ReadOnlyRecipientViewState[];
}

const ReadOnlyPrintRecipientWell = observer(function ReadOnlyPrintRecipientWell(
    props: ReadOnlyPrintRecipientWellProps
) {
    return (
        <span>
            <ReadOnlyRecipientWell
                recipientType={RecipientType.To}
                recipients={props.toRecipients}
                includeEmailAddressByDefault={true}
                showPlainText={true}
            />
            <ReadOnlyRecipientWell
                recipientType={RecipientType.Cc}
                recipients={props.ccRecipients}
                includeEmailAddressByDefault={true}
                showPlainText={true}
            />
            <ReadOnlyRecipientWell
                recipientType={RecipientType.Bcc}
                recipients={props.bccRecipients}
                includeEmailAddressByDefault={true}
                showPlainText={true}
            />
        </span>
    );
});
export default ReadOnlyPrintRecipientWell;
