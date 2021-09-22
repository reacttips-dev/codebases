import getPreviewText from '../utils/getPreviewText';
import shouldShowMeetingFeed from '../utils/shouldShowMeetingFeed';
import { observer } from 'mobx-react-lite';
import { isStringNullOrWhiteSpace } from 'owa-localize';
import { highlightTermsInHtmlElement } from 'owa-mail-highlight-terms';
import type { ClientItem, ClientMessage } from 'owa-mail-store';
import { PreviewSummary } from 'owa-meeting-message';
import * as React from 'react';

import styles from './ConversationReadingPane.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);

export interface CollapsedPreviewProps {
    item: ClientItem;
    isNodePending: boolean;
    printAllowed: boolean;
}

const CollapsedPreview = observer(function CollapsedPreview(props: CollapsedPreviewProps) {
    if (shouldShowMeetingFeed(props.item)) {
        return (
            <PreviewSummary
                item={props.item}
                isNodePending={props.isNodePending}
                printAllowed={props.printAllowed}
                renderPreview={renderPreview}
            />
        );
    } else {
        return renderPreview(
            props.item,
            props.isNodePending,
            true /* defaultIfEmpty */,
            props.printAllowed
        );
    }
});

export default CollapsedPreview;

function renderPreview(
    item: ClientMessage,
    isNodePending: boolean,
    defaultIfEmpty: boolean,
    printAllowed: boolean
) {
    const previewText = getPreviewText(item, isNodePending, defaultIfEmpty);

    return (
        !isStringNullOrWhiteSpace(previewText) && (
            <div
                ref={ref => {
                    highlightTermsInHtmlElement(ref);
                }}
                className={classNames(styles.previewBody, printAllowed ? '' : 'noPrint')}>
                {previewText}
            </div>
        )
    );
}
