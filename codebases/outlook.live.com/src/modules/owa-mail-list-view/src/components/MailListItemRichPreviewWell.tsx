import { observer } from 'mobx-react-lite';

import { logVerboseUsage } from 'owa-analytics';
import { AttachmentCompactView } from 'owa-attachment-compact-view';
import loc, { format } from 'owa-localize';
import {
    getListViewDimensions,
    getListViewColumnWidths,
    shouldRenderColumnHeaders,
    getStore as getMailListLayoutStore,
} from 'owa-mail-layout';
import type AttachmentPreviewWellView from 'owa-mail-list-store/lib/store/schema/AttachmentPreviewWellView';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import { getDensityModeString } from 'owa-fabric-theme';
import * as React from 'react';
import { plusMoreInlinePreviews } from './MailListItemRichPreviewWell.locstring.json';
import { isFeatureEnabled } from 'owa-feature-flags';
import { getMessageListTextStyle } from '../utils/getMessageListTextStyle';
import classNamesBind from 'classnames/bind';

import styles from './MailListItemRichPreviewWell.scss';
const classNames = classNamesBind.bind(styles);
import mailListItemStyles from './MailListItem.scss';
const mailListItemClassNames = classNamesBind.bind(mailListItemStyles);

const LV_LEFT_RIGHT_PADDING: number = 28; // list view left and right padding when in 3 column
const WIDTH_PERSONA_ICON: number = 48; // width of the persona icon div in 3 column
const SCROLL_BAR_WIDTH: number = 18; // custom scroll bar width
const WIDTH_ALLOC_FOR_DOC: number = 136; // 132: width + 4: margin-right
const WIDTH_ALLOC_FOR_IMAGE: number = 68; // 64: width + 4: margin-right
const WIDTH_OF_PLUS_MORE_DIV: number = 34; // This needs to be same as width for plus more div in scss file

export interface MailListItemRichPreviewWellProps {
    rowId: string;
    isWideView: boolean;
    onPreviewClick: (ev: React.MouseEvent<unknown>) => void;
    tableViewId: string;
}

export interface PreviewWellViewState {
    shouldShowPlusMore: boolean;
    numDocToShow: number;
    numImageToShow: number;
}

export default observer(function MailListItemRichPreviewWell(
    props: MailListItemRichPreviewWellProps
) {
    const densityFlightEnabled = isFeatureEnabled('mon-densities');
    const didLogAttachmentDatapoint = React.useRef(false);
    let densityModeString = getDensityModeString();
    const renderAttachment = (
        attachmentViewStateId: string,
        isImage: boolean,
        onlyDocsInView: boolean
    ): JSX.Element => {
        const attachmentViewState = listViewStore.attachmentViewStates.get(attachmentViewStateId);
        return (
            <AttachmentCompactView
                onPreviewClick={props.onPreviewClick}
                key={attachmentViewState.attachmentId.Id}
                attachmentViewState={attachmentViewState}
                isImage={isImage}
                isShortDocView={onlyDocsInView}
                attachmentViewStateId={attachmentViewStateId}
            />
        );
    };
    const renderAttachments = (
        isImage: boolean,
        attachmentViewStateIds: string[],
        numberToRender: number,
        onlyDocsInView: boolean
    ): JSX.Element[] => {
        const renderedAttachments: JSX.Element[] = [];
        for (let i = 0; i < numberToRender; i++) {
            renderedAttachments.push(
                renderAttachment(attachmentViewStateIds[i], isImage, onlyDocsInView)
            );
        }
        return renderedAttachments;
    };
    /**
     * Calculate the number of previews that can be shown and whether to show the plus more div
     * @param numOfDocs - Number of doc present
     * @param numOfImages - Number of images present
     * @param containerWidth - the width available
     * @return The preview view state
     */
    const calculatePreviewWellViewState = (
        numOfDocs: number,
        numOfImages: number,
        containerWidth: number
    ): PreviewWellViewState => {
        // start empty
        const previewViewState: PreviewWellViewState = {
            shouldShowPlusMore: false,
            numDocToShow: 0,
            numImageToShow: 0,
        };
        let availableContainerWidth = containerWidth;
        // The total width required to accommodate the previews
        const totalRequiredWidth =
            numOfDocs * WIDTH_ALLOC_FOR_DOC + numOfImages * WIDTH_ALLOC_FOR_IMAGE;
        // We show plus more when we do not have enough space to accommodate the available previews.
        previewViewState.shouldShowPlusMore = totalRequiredWidth > availableContainerWidth;
        // Early return if we are not showing plus more
        if (!previewViewState.shouldShowPlusMore) {
            return {
                shouldShowPlusMore: false,
                numDocToShow: numOfDocs,
                numImageToShow: numOfImages,
            };
        }
        // If we show plus more then we have to allocate the space for it and hence the container width available should be reduced by the
        // space taken by the plus more div
        availableContainerWidth -= WIDTH_OF_PLUS_MORE_DIV;
        // calculate number of documents to show
        const numOfDocsThatCanFit = Math.floor(availableContainerWidth / WIDTH_ALLOC_FOR_DOC);
        previewViewState.numDocToShow = Math.min(numOfDocs, numOfDocsThatCanFit);
        availableContainerWidth =
            availableContainerWidth - previewViewState.numDocToShow * WIDTH_ALLOC_FOR_DOC;
        // calculate number of images to show
        const numOfImagesThatCanFit = Math.floor(availableContainerWidth / WIDTH_ALLOC_FOR_IMAGE);
        previewViewState.numImageToShow = Math.min(numOfImages, numOfImagesThatCanFit);
        return previewViewState;
    };
    /**
     * Calculates the available container width
     */
    const getContainerWidth = (): number => {
        let containerWidth = 0;
        if (shouldRenderColumnHeaders(props.tableViewId)) {
            containerWidth = getMailListLayoutStore().subjectColumnWidth - 20 /* Left Padding */;
        } else if (props.isWideView) {
            containerWidth = 500; // VSO-13179 - SLV, how to get container width and pass it before render.
        } else {
            const { listViewWidth } = getListViewDimensions();
            containerWidth =
                listViewWidth - LV_LEFT_RIGHT_PADDING - WIDTH_PERSONA_ICON - SCROLL_BAR_WIDTH;
        }
        return containerWidth;
    };
    const renderPreviewWell = (
        attachmentPreviewWellViewState: AttachmentPreviewWellView
    ): JSX.Element => {
        let nonEmptyPreviewContainerClasses = classNames(
            densityFlightEnabled && densityModeString,
            styles.wellHeights,
            ['disableTextSelection', styles.oneRowAttachmentPreviews]
        );
        const numOfDocs = attachmentPreviewWellViewState.documentViewStateIds.length;
        const numOfImages = attachmentPreviewWellViewState.imageViewStateIds.length;
        const totalNumberOfAttachmentPreviews = numOfDocs + numOfImages;
        // Calculate the number of previews that can be shown and whether to show the plus more div
        const previewViewState: PreviewWellViewState = calculatePreviewWellViewState(
            numOfDocs,
            numOfImages,
            getContainerWidth()
        );
        const onlyDocsInView = previewViewState.numImageToShow === 0;
        if (onlyDocsInView) {
            nonEmptyPreviewContainerClasses = classNames(
                densityFlightEnabled && densityModeString,
                styles.shortWellHeights,
                nonEmptyPreviewContainerClasses
            );
        }
        if (!didLogAttachmentDatapoint.current) {
            logVerboseUsage('MailListItemAttachmentPreview', [
                totalNumberOfAttachmentPreviews,
                previewViewState.numDocToShow +
                    previewViewState.numImageToShow /* total number of previews to show */,
                numOfDocs,
                numOfImages,
                previewViewState.numDocToShow,
                previewViewState.numImageToShow,
                previewViewState.shouldShowPlusMore,
            ]);
            didLogAttachmentDatapoint.current = true;
        }
        return (
            <div className={nonEmptyPreviewContainerClasses}>
                {renderAttachments(
                    false /* isImage */,
                    attachmentPreviewWellViewState.documentViewStateIds,
                    previewViewState.numDocToShow,
                    onlyDocsInView
                )}
                {renderAttachments(
                    true /* isImage */,
                    attachmentPreviewWellViewState.imageViewStateIds,
                    previewViewState.numImageToShow,
                    onlyDocsInView
                )}
                {previewViewState.shouldShowPlusMore && (
                    <div
                        className={classNames(
                            densityFlightEnabled && densityModeString,
                            densityFlightEnabled &&
                                getMessageListTextStyle('Major', densityModeString),
                            onlyDocsInView
                                ? styles.shortWellAndLineHeights
                                : styles.wellAndLineHeights,
                            styles.plusMoreNumber
                        )}>
                        {format(
                            loc(plusMoreInlinePreviews),
                            totalNumberOfAttachmentPreviews -
                                previewViewState.numDocToShow -
                                previewViewState.numImageToShow
                        )}
                    </div>
                )}
            </div>
        );
    };
    const { isWideView, rowId, tableViewId } = props;
    const attachmentPreviewWellViewState = listViewStore.rowAttachmentPreviewWellViews.get(rowId);
    const containerDivClasses = mailListItemClassNames(
        'disableTextSelection',
        !isWideView && densityModeString,
        isWideView
            ? mailListItemStyles.inlinePreviewsSingleLine
            : mailListItemStyles.inlinePreviewsThreeColumn
    );

    if (attachmentPreviewWellViewState) {
        const columnHeadersEnabled =
            isFeatureEnabled('mon-tri-columnHeadersSlv') && isWideView; /* SLV */

        const style = columnHeadersEnabled
            ? {
                  marginLeft: getListViewColumnWidths(listViewStore.tableViews.get(tableViewId))
                      .senderColumnWidth,
                  paddingLeft: '20px',
              }
            : {};

        return (
            <div className={containerDivClasses} style={style}>
                {renderPreviewWell(attachmentPreviewWellViewState)}
            </div>
        );
    }

    return null;
});
