import { observer } from 'mobx-react-lite';
import { useComputedValue } from 'owa-react-hooks/lib/useComputed';
import { Spinner, SpinnerSize } from '@fluentui/react/lib/Spinner';
import { logUsage } from 'owa-analytics';
import { CategoryWell } from 'owa-categories';
import { isFeatureEnabled } from 'owa-feature-flags';
import { highlightTermsInHtmlElement } from 'owa-highlight';
import loc from 'owa-localize';
import { draftSenderPersonaPlaceholder } from 'owa-locstrings/lib/strings/draftsenderpersonaplaceholder.locstring.json';
import { externalLabel } from 'owa-locstrings/lib/strings/externalLabel.locstring.json';
import { CouponPreviewWell } from 'owa-mail-coupon-peek';
import listViewStore from 'owa-mail-list-store/lib/store/Store';
import {
    FolderTag,
    MailListItemMeetingInfo,
    MailListItemMeetingPreview,
    MailListItemDismissButton,
    MailListItemTxpInfo,
} from '../index';
import { lazyStartSearchWithCategory } from 'owa-mail-search';
import { ActionSource, ConversationItemParts, mailStore } from 'owa-mail-store';
import MailListItemSelectionSource from 'owa-mail-store/lib/store/schema/MailListItemSelectionSource';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import { formatRelativeDate } from 'owa-observable-datetime';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { getDensityModeString } from 'owa-fabric-theme';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { trace } from 'owa-trace';
import * as React from 'react';
import onMailListItemClickHandler from '../utils/onMailListItemClickHandler';
import type MailListItemDataProps from '../utils/types/MailListItemDataProps';
import type MailListTableProps from '../utils/types/MailListTableProps';
import MailListItemIconBar from './MailListItemIconBar';
import MailListItemRichPreviewWell from './MailListItemRichPreviewWell';
import MailListItemTwistyButton from './MailListItemTwistyButton';
import PersonaCheckbox from './PersonaCheckbox';
import { MailListItemUnsubscribe } from 'owa-mail-list-unsubscribe';
import { UnreadReadCountBadge } from 'owa-unreadread-count-badge';
import { getListViewColumnWidths } from 'owa-mail-layout';
import { getMessageListTextStyle } from '../utils/getMessageListTextStyle';

import styles from './MailListItem.scss';
import classnamesBind from 'classnames/bind';
const classNames = classnamesBind.bind(styles);
export interface MailListItemProps {
    mailListTableProps: MailListTableProps;
    mailListItemDataProps: MailListItemDataProps;
    styleSelectorAsPerUserSettings: string;
    isFirstLevelExpanded: boolean;
    isSecondLevelExpanded: boolean;
    isLoadingSecondLevelExpansion: boolean;
}

export default observer(function MailListItem(props: MailListItemProps) {
    const hasUnreadCountBadge = isFeatureEnabled('mon-tri-unreadCountBadgeWithBackground');
    const hasHighTwisty =
        isFeatureEnabled('mon-tri-mailItemTwisty') && !props.mailListTableProps.isSingleLine;
    const columnHeadersEnabled =
        isFeatureEnabled('mon-tri-columnHeadersSlv') && props.mailListTableProps.isSingleLine;
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const densityModeString = getDensityModeString();
    const isLoadingExpansion = useComputedValue((): boolean => {
        const expansionState = listViewStore.expandedConversationViewState;
        const conversationItemParts: ConversationItemParts = mailStore.conversations.get(
            props.mailListItemDataProps.conversationId
        );
        return (
            (props.isFirstLevelExpanded || props.isSecondLevelExpanded) &&
            (expansionState.forks == [] ||
                (conversationItemParts && conversationItemParts.loadingState.isLoading))
        );
    }, [props.isFirstLevelExpanded, props.isSecondLevelExpanded]);
    const renderUnreadCount = (unreadCount: number): JSX.Element => {
        const unreadCountClasses = classNames(styles.unreadCount, styles.flex00Auto);
        return unreadCount > 1 && <span className={unreadCountClasses}>({unreadCount})</span>;
    };
    const renderDraftsPlaceHolder = (): JSX.Element => {
        // For drafts we always prepend the placeholder [Drafts]{space}
        const draftsPlaceHolderText = loc(draftSenderPersonaPlaceholder) + ' ';
        return <span className={styles.draftText}>{draftsPlaceHolderText}</span>;
    };
    const renderCondensedRowText = (
        text: string,
        tooltipText: string | null,
        shouldShowDraftsIndicator: boolean
    ): JSX.Element => {
        return (
            <div
                className={classNames(
                    styles.condensedRowText,
                    hasDensityNext && getMessageListTextStyle('Major', densityModeString)
                )}>
                {shouldShowDraftsIndicator && renderDraftsPlaceHolder()}
                {renderLineText(text, tooltipText)}
            </div>
        );
    };
    const renderFirstLineText = (
        firstLineText: string,
        firstLineTooltipText: string | null,
        shouldShowDraftsIndicator: boolean,
        isUnread: boolean
    ): JSX.Element => {
        const { unreadCount } = props.mailListItemDataProps;
        const { isSingleLine } = props.mailListTableProps;
        const showUnreadCountBadge = unreadCount > 1 && hasUnreadCountBadge;
        const firstLineTextClasses = classNames(
            isUnread || (isFeatureEnabled('mon-tri-firstLineBoldText') && !isSingleLine)
                ? styles.firstLineTextUnread
                : styles.firstLineTextRead,
            showUnreadCountBadge && styles.hasCountBadge,
            hasDensityNext && getMessageListTextStyle('Major', densityModeString, true)
        );
        return (
            <>
                <div className={firstLineTextClasses}>
                    {shouldShowDraftsIndicator && renderDraftsPlaceHolder()}
                    {renderLineText(firstLineText, firstLineTooltipText)}
                </div>
                {showUnreadCountBadge && (
                    <UnreadReadCountBadge
                        count={unreadCount}
                        isSelected={true}
                        isListViewBadge={true}
                    />
                )}
            </>
        );
    };
    const renderSecondLineText = (
        secondLineText: string,
        secondLineTooltipText: string | null,
        addOverflowStyles?: boolean
    ): JSX.Element => {
        return renderLineText(secondLineText, secondLineTooltipText, addOverflowStyles);
    };
    const renderLineText = (
        text: string,
        tooltipText: string | null,
        addOverflowStyles?: boolean
    ): JSX.Element => {
        return (
            <span
                className={addOverflowStyles && styles.secondLineText}
                title={tooltipText}
                ref={highLightTerms}>
                {text}
            </span>
        );
    };
    const highLightTerms = (element: HTMLElement) => {
        highlightTermsInHtmlElement(
            element,
            props.mailListTableProps.highlightTerms,
            false /* separateWordSearch */,
            true /* matchPrefix */
        );
    };
    const renderPreviewDisplay = (previewDisplay: string): JSX.Element => {
        const { isNudged, latestItemId, rowKey, shouldShowRSVP } = props.mailListItemDataProps;
        const { tableViewId, highlightTerms } = props.mailListTableProps;

        if (shouldShowRSVP && !isFeatureEnabled('mon-tri-mailListMeetingInvite')) {
            return (
                <MailListItemMeetingPreview
                    highlightTerms={highlightTerms}
                    latestItemId={latestItemId}
                    originalPreview={previewDisplay}
                />
            );
        }

        return (
            <div
                className={classNames(
                    styles.previewContainer,
                    isNudged && styles.showDismissButton
                )}>
                <span
                    className={classNames(
                        styles.previewDisplayText,
                        isNudged && styles.isNudged,
                        hasDensityNext && getMessageListTextStyle('Major', densityModeString)
                    )}
                    ref={highLightTerms}>
                    {previewDisplay}
                </span>
                {isNudged && (
                    <MailListItemDismissButton rowKey={rowKey} tableViewId={tableViewId} />
                )}
            </div>
        );
    };
    const renderRichPreviewsWell = (): JSX.Element => {
        const { rowId } = props.mailListItemDataProps;
        const { isSingleLine, tableViewId } = props.mailListTableProps;
        return (
            <MailListItemRichPreviewWell
                isWideView={isSingleLine}
                rowId={rowId}
                onPreviewClick={onAttachmentClick}
                tableViewId={tableViewId}
            />
        );
    };
    const onAttachmentClick = (evt: React.MouseEvent<unknown>) => {
        onMailListItemClickHandler(
            evt,
            MailListItemSelectionSource.MailListItemRichPreview,
            props.mailListItemDataProps.rowKey,
            props.mailListTableProps.tableViewId
        );
    };

    const renderMeetingMessageInfo = (): JSX.Element => {
        const {
            latestItemId,
            conversationId,
            isSelected,
            itemClassIcon,
        } = props.mailListItemDataProps;
        const { isSingleLine, tableViewId, listViewType } = props.mailListTableProps;
        return (
            <MailListItemMeetingInfo
                latestItemId={latestItemId}
                isSingleLineView={isSingleLine}
                tableViewId={tableViewId}
                conversationId={conversationId}
                listViewType={listViewType}
                isSelected={isSelected}
                itemClassIcon={itemClassIcon}
            />
        );
    };
    const renderTxpInfo = (): JSX.Element => {
        const { latestItemId } = props.mailListItemDataProps;
        const { isSingleLine, tableViewId } = props.mailListTableProps;

        return (
            <MailListItemTxpInfo
                latestItemId={latestItemId}
                tableViewId={tableViewId}
                isSingleLineView={isSingleLine}
            />
        );
    };
    const renderUnsubscribe = (): JSX.Element => {
        if (
            !isFeatureEnabled('tri-unsubscribeLV') ||
            !props.mailListItemDataProps?.lastSender?.Mailbox
        ) {
            return null;
        }
        return (
            <MailListItemUnsubscribe
                senderMailbox={props.mailListItemDataProps.lastSender.Mailbox}
                isSingleLineView={props.mailListTableProps.isSingleLine}
            />
        );
    };
    const renderCouponPreviews = (): JSX.Element => {
        if (!isFeatureEnabled('tri-coupon-peek')) {
            return null;
        }
        const { rowId, validCouponIndexes } = props.mailListItemDataProps;
        const couponPeekPreviews: string[] = listViewStore.couponPeekPreviews.get(rowId);
        // validCouponIndexes can be undefined when item is not loaded via FindItem
        const hasValidCoupon = validCouponIndexes && validCouponIndexes.length > 0;
        return hasValidCoupon ? (
            <CouponPreviewWell
                couponContainerClass={
                    props.mailListTableProps.isSingleLine
                        ? styles.couponPreviewsSingleLine
                        : styles.couponPreviewsThreeColumn
                }
                couponPreviews={couponPeekPreviews}
                validCouponIndexes={validCouponIndexes}
            />
        ) : null;
    };
    const renderTwistyOrSpinner = (
        isExpanded: boolean,
        isCondensedView: boolean,
        shouldShowTwisty?: boolean
    ) => {
        const isSingleLine = props.mailListTableProps.isSingleLine;
        return isLoadingExpansion
            ? renderExpansionSpinner(isSingleLine)
            : renderTwisty(isExpanded, isCondensedView, shouldShowTwisty);
    };
    const renderExpansionSpinner = (isSingleLine: boolean) => {
        return (
            <Spinner
                // need to stop the event from bubbling up and causing the popout view
                onDoubleClick={stopPropagation}
                className={
                    isSingleLine
                        ? styles.loadingItemPartsSpinnerSingleLine
                        : styles.loadingItemPartsSpinnerThreeColumn
                }
                size={SpinnerSize.xSmall}
            />
        );
    };
    const renderTwisty = (
        isExpanded: boolean,
        isCondensedView: boolean,
        shouldShowTwisty?: boolean
    ) => {
        const { isSingleLine, tableViewId } = props.mailListTableProps;
        const { unreadCount } = props.mailListItemDataProps;
        const isUnread = unreadCount > 0;
        const twistyClasses = classNames(
            isSingleLine
                ? styles.twistySingleLine
                : classNames(
                      styles.twistyThreeColumn,
                      densityModeString,
                      hasHighTwisty && styles.highTwisty,
                      hasHighTwisty && !shouldShowTwisty && styles.hideTwisty
                  ),
            isUnread && styles.twistyUnread
        );
        const onClick = (evt: React.MouseEvent<unknown>) => {
            onMailListItemClickHandler(
                evt,
                MailListItemSelectionSource.MailListItemTwisty,
                props.mailListItemDataProps.rowKey,
                tableViewId
            );
            const tableView = listViewStore.tableViews.get(tableViewId);
            logUsage('MailListRowExpanded', [isCondensedView, tableView.tableQuery.type]);
        };
        return (
            <MailListItemTwistyButton
                className={twistyClasses}
                isSecondLevelExpanded={isExpanded}
                isFirstLevelExpanded={props.isFirstLevelExpanded}
                onClick={onClick}
                isSingleLine={isSingleLine}
            />
        );
    };
    /** This Function renders the IconBar. In Monarch single line view, we use the Icon bar component twice, the right most side to display hover actions
     * and the space after the sender name to display property Icons.
     * @param neverShowHoverIcons This param ensures that no hover icons will be shown. If it is not explicitly true, it will rely on mailListTableProps.supportsHoverIcons.
     * @param neverShowPropertyIcons This param ensures that no property icons will be shown
     */
    const renderIconBar = (neverShowHoverIcons?: boolean, neverShowPropertyIcons?: boolean) => {
        const { mailListTableProps, mailListItemDataProps } = props;
        return (
            <MailListItemIconBar
                mailListItemDataProps={mailListItemDataProps}
                mailListTableProps={mailListTableProps}
                neverShowHoverIcons={neverShowHoverIcons || !mailListTableProps.supportsHoverIcons}
                tableViewId={mailListTableProps.tableViewId}
                rowKey={mailListItemDataProps.rowKey}
                lastDeliveryTimestamp={mailListItemDataProps.lastDeliveryTimestamp}
                neverShowPropertyIcons={neverShowPropertyIcons}
                isRowExpanded={props.isFirstLevelExpanded || props.isSecondLevelExpanded}
            />
        );
    };
    const renderScheduleTime = () => {
        if (!props.mailListItemDataProps.returnTime) {
            return null;
        }
        const formattedDate = formatRelativeDate(props.mailListItemDataProps.returnTime);
        return (
            <span
                className={classNames(
                    styles.scheduleTime,
                    columnHeadersEnabled && styles.timestampSLVWithHeaders
                )}
                title={formattedDate}>
                {formattedDate}
            </span>
        );
    };
    const renderTimestamp = (isUnread: boolean) => {
        // Do not show lastDeliveryTime when the item has a returnTime
        if (props.mailListItemDataProps.returnTime) {
            return null;
        }
        // VSO: 26555 - Remove the extra tracing added to MailListItem to determine when lastDeliveryTime is undefined
        if (!props.mailListItemDataProps.lastDeliveryTimestamp) {
            const tableView = listViewStore.tableViews.get(props.mailListTableProps.tableViewId);
            const logSystemFolder = tableView.tableQuery.folderId
                ? folderIdToName(tableView.tableQuery.folderId)
                : null;
            trace.warn(
                'renderTimestamp: LastDeliveryTimeStamp is undefined,' +
                    ' folder ' +
                    logSystemFolder
            );
            return null;
        }
        const formattedDate = formatRelativeDate(props.mailListItemDataProps.lastDeliveryTimestamp);
        const timestampStyles = classNames(
            styles.timestamp,
            props.mailListTableProps.isSingleLine && styles.timestampSLV,
            !props.mailListTableProps.isSingleLine && isUnread && styles.timestampUnread,
            hasDensityNext &&
                (isUnread ? styles.timestampUnreadNext : styles.secondRowThreeColumnRead),
            hasDensityNext && getMessageListTextStyle('Minor', densityModeString),
            columnHeadersEnabled && styles.timestampSLVWithHeaders
        );
        return (
            <span className={timestampStyles} title={formattedDate}>
                {formattedDate}
            </span>
        );
    };
    const renderSLVThirdColumn = (isUnread: boolean) => {
        const { returnTime } = props.mailListItemDataProps;
        const { showFolderTag, tableViewId } = props.mailListTableProps;
        const usingHeaders = isFeatureEnabled('mon-tri-columnHeadersSlv');

        const receivedColumnWidth = getListViewColumnWidths(
            listViewStore.tableViews.get(tableViewId)
        ).receivedColumnWidth;
        const thirdColumnWidth = usingHeaders
            ? {
                  width: receivedColumnWidth,
                  maxWidth: receivedColumnWidth,
              }
            : {};

        const timeStamp = returnTime ? renderScheduleTime() : renderTimestamp(isUnread);
        const hasBigHoverAction = isFeatureEnabled('mon-tri-mailListItemHoverDeleteSlv');

        return (
            <div
                className={hasBigHoverAction && styles.slvBigHoverThirdColumn}
                style={thirdColumnWidth}>
                <div className={hasBigHoverAction && styles.slvBigHoverThirdColumnTextWrapper}>
                    {showFolderTag ? (
                        <div
                            className={classNames(
                                usingHeaders
                                    ? styles.thirdColumnWithFolderTagWithHeaders
                                    : styles.thirdColumnWithFolderTag,
                                hasDensityNext &&
                                    getMessageListTextStyle('Minor', densityModeString)
                            )}>
                            {renderFolderTag()}
                            {timeStamp}
                        </div>
                    ) : (
                        timeStamp
                    )}
                </div>
                {hasBigHoverAction && (
                    <div className={styles.thirdColumnIconBarWithHeaders}>
                        {renderIconBar(false, true)}
                    </div>
                )}
            </div>
        );
    };

    const externalLabelText = <span className={styles.externalText}>{loc(externalLabel)}</span>;
    const renderExternalMarker = () => {
        return (
            <span
                className={classNames(
                    styles.externalMarker,
                    props.mailListItemDataProps.isSelected && styles.externalSelected
                )}>
                {externalLabelText}
            </span>
        );
    };

    // Single line view mail list item structure. Everything is done via flexbox.
    //  Outer Container
    // ---------------------------------------------------------------------------------------------------
    // |  Single Line View Container                                                                     |
    // |  ---------------------------------------------------------------------------------------------  |
    // |  | First Row                                                                                 |  |
    // |  | ------------------------------------------   -------------------------------------------  |  |
    // |  | | First Column                           |   | Second Column                           |  |  |
    // |  | |                                        |   |                                         |  |  |
    // |  | |                                        |   |                                         |  |  |
    // |  | |                                        |   |                                         |  |  |
    // |  | ------------------------------------------   -------------------------------------------  |  |
    // |  ---------------------------------------------------------------------------------------------  |
    // |                                                 ----------------------------------------------  |
    // |                                                 | Attachment Previews Row                    |  |
    // |                                                 |                                            |  |
    // |                                                 ----------------------------------------------  |
    // |                                                 ----------------------------------------------  |
    // |                                                 | Coupon Previews Row                        |  |
    // |                                                 |                                            |  |
    // |                                                 ----------------------------------------------  |
    // ---------------------------------------------------------------------------------------------------
    const renderSingleLineViewMailListItem = () => {
        const {
            unreadCount,
            categories,
            showAttachmentPreview,
            showCondensedView,
            rowKey,
            lastSender,
            isNudged,
            isSelected,
            lastDeliveryTimestamp,
            isUnauthenticatedSender,
            firstLineText,
            firstLineTooltipText,
            showDraftsIndicator,
            secondLineText,
            secondLineTooltipText,
            thirdLineText,
            shouldShowTwisty,
            shouldShowRSVP,
            shouldShowTxpButton,
            shouldShowUnsubscribe,
            shouldShowExternalLabel,
        } = props.mailListItemDataProps;
        const {
            isFirstLevelExpanded,
            isSecondLevelExpanded,
            isLoadingSecondLevelExpansion,
        } = props;
        const { tableViewId, showPreviewText } = props.mailListTableProps;
        const isUnread = unreadCount > 0;
        const shouldShowCategories = categories?.length > 0 && !isNudged;
        const subjectClasses = classNames(
            isUnread ? styles.subjectUnread : styles.subject,
            isNudged && styles.shouldShrink,
            shouldShowCategories && styles.paddingLeftForSubjectInSingleLine,
            hasDensityNext && getMessageListTextStyle('Major', densityModeString)
        );
        const isCondensedView = showCondensedView;
        const showAttachmentPreviews = !isCondensedView && showAttachmentPreview;
        const tableView = listViewStore.tableViews.get(tableViewId);
        const isItemView = tableView.tableQuery.listViewType === ReactListViewType.Message;
        const showPreviews =
            !shouldShowUnstackedReadingPane() ||
            (!isFirstLevelExpanded && !isSecondLevelExpanded && !isLoadingSecondLevelExpansion);
        const usingColumHeaders = isFeatureEnabled('mon-tri-columnHeadersSlv');

        let firstColumnStyles;
        if (isItemView) {
            firstColumnStyles = usingColumHeaders
                ? styles.firstColumnWithHeaders
                : styles.firstColumn;
        } else {
            const stylesWithTwisty = usingColumHeaders
                ? styles.firstColumnWithHeaders
                : styles.firstColumn;
            const stylesWithoutTwisty = usingColumHeaders
                ? styles.firstColumnNoTwistyWithHeaders
                : styles.firstColumnNoTwisty;

            firstColumnStyles = shouldShowTwisty ? stylesWithTwisty : stylesWithoutTwisty;
        }

        const secondColumnStyle = usingColumHeaders
            ? styles.secondColumnWithHeaders
            : styles.secondColumn;

        const { senderColumnWidth, subjectColumnWidth } = getListViewColumnWidths(tableView);

        const firstColumnWidth = usingColumHeaders
            ? {
                  width: senderColumnWidth,
                  maxWidth: senderColumnWidth,
              }
            : {};

        const secondColumnWidth = usingColumHeaders
            ? {
                  width: subjectColumnWidth,
                  maxWidth: subjectColumnWidth,
                  paddingLeft: '16px',
              }
            : {};

        return (
            <div className={styles.singleLineViewContainer}>
                <div
                    className={classNames(
                        densityModeString,
                        usingColumHeaders ? styles.firstRowBase : styles.firstRow,
                        isFeatureEnabled('mon-densities') && styles.slvDensityNext
                    )}>
                    <div
                        className={classNames(
                            firstColumnStyles,
                            usingColumHeaders && getDensityModeString()
                        )}
                        style={firstColumnWidth}>
                        {shouldShowTwisty &&
                            renderTwistyOrSpinner(isSecondLevelExpanded, isCondensedView)}
                        <PersonaCheckbox
                            tableViewId={tableViewId}
                            isSelected={isSelected}
                            lastSender={lastSender}
                            rowKey={rowKey}
                            lastDeliveryTimestamp={lastDeliveryTimestamp}
                            isUnauthenticatedSender={isUnauthenticatedSender}
                            styleSelectorAsPerUserSettings={props.styleSelectorAsPerUserSettings}
                        />
                        {shouldShowExternalLabel && renderExternalMarker()}
                        {renderFirstLineText(
                            firstLineText,
                            firstLineTooltipText,
                            showDraftsIndicator,
                            isUnread
                        )}
                        {renderIconBar(
                            isFeatureEnabled('mon-tri-mailListItemHoverDeleteSlv'),
                            false
                        )}
                    </div>
                    <div className={secondColumnStyle} style={secondColumnWidth}>
                        <div className={styles.content}>
                            {shouldShowCategories &&
                                renderCategories(
                                    categories,
                                    styles.categoryWellSingleLine,
                                    styles.categoryContainerSingleLine
                                )}
                            <div className={subjectClasses}>
                                {renderSecondLineText(secondLineText, secondLineTooltipText)}
                                {!hasUnreadCountBadge && renderUnreadCount(unreadCount)}
                            </div>
                            {(showPreviewText || isNudged) && (
                                <div
                                    className={classNames(
                                        styles.previewDisplaySingleLine,
                                        isNudged && styles.isNudged
                                    )}>
                                    {showPreviews && renderPreviewDisplay(thirdLineText)}
                                </div>
                            )}
                        </div>
                        {shouldShowRSVP && renderMeetingMessageInfo()}
                        {shouldShowTxpButton && renderTxpInfo()}
                        {shouldShowUnsubscribe && renderUnsubscribe()}
                    </div>
                    {renderSLVThirdColumn(isUnread)}
                </div>
                {showPreviews && showAttachmentPreviews && renderRichPreviewsWell()}
                {renderCouponPreviews()}
            </div>
        );
    };
    const renderThreeColumnViewMailListItem = () => {
        return props.mailListItemDataProps.showCondensedView
            ? renderCondensedThreeColumnViewMailListItem()
            : renderFullThreeColumnViewMailListItem();
    };
    //  Outer Container
    // -------------------------------------------------------------------------
    // |  Three Column FULL View Container                                     |
    // |  ----------------  -------------------------------------------------  |
    // |  | First Column |  |  Second Column                                |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |  | First Row                               |  |  |
    // |  |              |  |  |                                         |  |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |                                               |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |  | Second Row                              |  |  |
    // |  |              |  |  |                                         |  |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |                                               |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |  | Third Row (if not disabled)             |  |  |
    // |  |              |  |  |                                         |  |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |                                               |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |  | Inline Previews                         |  |  |
    // |  |              |  |  |                                         |  |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |                                               |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |  | Coupon Previews                         |  |  |
    // |  |              |  |  |                                         |  |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |  | Meeting Message Info                    |  |  |
    // |  |              |  |  |                                         |  |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  ----------------  -------------------------------------------------  |
    // -------------------------------------------------------------------------
    const renderFullThreeColumnViewMailListItem = () => {
        const {
            unreadCount,
            categories,
            isNudged,
            isSelected,
            isTaggedForBigScreen,
            lastSender,
            rowKey,
            lastDeliveryTimestamp,
            isUnauthenticatedSender,
            firstLineText,
            firstLineTooltipText,
            showDraftsIndicator,
            secondLineText,
            secondLineTooltipText,
            thirdLineText,
            showAttachmentPreview,
            returnTime,
            shouldShowTwisty,
            shouldShowRSVP,
            shouldShowTxpButton,
            shouldShowUnsubscribe,
            shouldShowExternalLabel,
        } = props.mailListItemDataProps;
        const {
            isFirstLevelExpanded,
            isSecondLevelExpanded,
            isLoadingSecondLevelExpansion,
        } = props;
        const { tableViewId, showFolderTag, showPreviewText } = props.mailListTableProps;
        const isUnread = unreadCount > 0;
        const showCategories = categories?.length > 0 && !isNudged;
        const hasBigHoverAction = isFeatureEnabled('mon-tri-mailListItemHoverDelete');
        // category or folder tag are typically shown on the same line as preview text or nudged reason
        // when preview text and nudged reason are not shown,
        // an additional container is used to display category or folder tag
        const showLabelsContainer =
            !showPreviewText && !isNudged && (showCategories || showFolderTag);
        const showPreviews =
            !shouldShowUnstackedReadingPane() ||
            (!isFirstLevelExpanded && !isSecondLevelExpanded && !isLoadingSecondLevelExpansion);

        const showOnlyHeader = shouldShowUnstackedReadingPane() && isSecondLevelExpanded;
        const personaCheckbox = (
            <PersonaCheckbox
                tableViewId={tableViewId}
                isSelected={isSelected}
                lastSender={lastSender}
                rowKey={rowKey}
                lastDeliveryTimestamp={lastDeliveryTimestamp}
                isUnauthenticatedSender={isUnauthenticatedSender}
                styleSelectorAsPerUserSettings={props.styleSelectorAsPerUserSettings}
            />
        );

        if (showOnlyHeader) {
            return (
                <div
                    className={classNames(
                        hasHighTwisty && styles.highTwisty,
                        styles.topLevelSubject,
                        isUnread ? styles.secondRowThreeColumnUnread : styles.secondRowThreeColumn,
                        hasDensityNext && styles.secondRowThreeColumnPaddingNext
                    )}>
                    {hasHighTwisty &&
                        renderTwistyOrSpinner(
                            isSecondLevelExpanded,
                            false /* isCondensedView */,
                            shouldShowTwisty
                        )}
                    {personaCheckbox}
                    {!hasHighTwisty &&
                        shouldShowTwisty &&
                        renderTwistyOrSpinner(isSecondLevelExpanded, false /* isCondensedView */)}
                    <div
                        className={classNames(
                            styles.conversationHeaderContent,
                            hasDensityNext && getMessageListTextStyle('Major', densityModeString)
                        )}>
                        {showCategories &&
                            renderCategories(
                                categories,
                                styles.categoryWellConversationHeader,
                                classNames(
                                    hasDensityNext && densityModeString,
                                    styles.categoryContainerThreeColumn
                                )
                            )}
                        {renderFirstLineText(
                            secondLineText,
                            secondLineTooltipText,
                            showDraftsIndicator,
                            isUnread
                        )}
                        {renderIconBar()}
                    </div>
                </div>
            );
        }

        let firstRowStyle;
        if (isUnread) {
            firstRowStyle = hasDensityNext
                ? styles.firstRowThreeColumnUnreadNext
                : styles.firstRowThreeColumnUnread;
        } else {
            firstRowStyle = hasDensityNext
                ? styles.firstRowThreeColumnNext
                : styles.firstRowThreeColumn;
        }

        const showCategoriesInline = shouldShowUnstackedReadingPane() && isFirstLevelExpanded;

        return (
            <div
                className={classNames(
                    hasBigHoverAction && styles.bigHoverPadding,
                    densityModeString,
                    !hasDensityNext && styles.threeColumnViewContainer,
                    hasDensityNext && styles.threeColumnViewContainerNext
                )}>
                <div
                    className={classNames(
                        styles.firstColumnThreeColumn,
                        hasHighTwisty && styles.highTwisty
                    )}>
                    {hasHighTwisty &&
                        renderTwistyOrSpinner(
                            isSecondLevelExpanded,
                            false /* isCondensedView */,
                            shouldShowTwisty
                        )}
                    {personaCheckbox}
                </div>
                <div className={styles.column}>
                    <div className={firstRowStyle}>
                        {shouldShowExternalLabel && renderExternalMarker()}
                        {renderFirstLineText(
                            firstLineText,
                            firstLineTooltipText,
                            showDraftsIndicator,
                            isUnread
                        )}
                        {renderIconBar()}
                    </div>
                    <div
                        className={classNames(
                            isUnread
                                ? styles.secondRowThreeColumnUnread
                                : styles.secondRowThreeColumn,
                            hasDensityNext && !isUnread && styles.secondRowThreeColumnRead,
                            hasDensityNext && styles.secondRowThreeColumnPaddingNext
                        )}>
                        {!hasHighTwisty &&
                            shouldShowTwisty &&
                            renderTwistyOrSpinner(
                                isSecondLevelExpanded,
                                false /* isCondensedView */
                            )}
                        <div
                            className={classNames(
                                styles.secondLineTextThreeColumn,
                                hasDensityNext && densityModeString,
                                hasDensityNext &&
                                    getMessageListTextStyle('Major', densityModeString),
                                showCategoriesInline && styles.conversationHeaderContent
                            )}>
                            {showCategories &&
                                showCategoriesInline &&
                                renderCategories(
                                    categories,
                                    styles.categoryWellThreeColumn,
                                    styles.categoryContainerThreeColumn
                                )}
                            {renderSecondLineText(
                                secondLineText,
                                secondLineTooltipText,
                                showCategoriesInline
                            )}
                        </div>
                        {!hasUnreadCountBadge &&
                            !isFirstLevelExpanded &&
                            renderUnreadCount(unreadCount)}
                        {isTaggedForBigScreen ? (
                            <></> // TODO: Update this after get the proper message to display.
                        ) : returnTime ? (
                            renderScheduleTime()
                        ) : (
                            !isFirstLevelExpanded &&
                            !isSecondLevelExpanded &&
                            renderTimestamp(isUnread)
                        )}
                    </div>
                    {(showPreviewText || isNudged) && (
                        <div
                            className={classNames(
                                styles.previewDisplayThreeColumn,
                                hasDensityNext && densityModeString,
                                isNudged && styles.isNudged
                            )}>
                            <div
                                className={classNames(
                                    styles.previewDisplayThreeColumnCategories,
                                    isNudged && styles.isNudged
                                )}>
                                {showCategories &&
                                    !showCategoriesInline &&
                                    renderCategories(
                                        categories,
                                        styles.categoryWellThreeColumn,
                                        classNames(
                                            hasDensityNext && densityModeString,
                                            styles.categoryContainerThreeColumn
                                        )
                                    )}
                                {showPreviews && renderPreviewDisplay(thirdLineText)}
                            </div>
                            {showFolderTag && (
                                <div className={styles.threeColFolderTag}>{renderFolderTag()}</div>
                            )}
                        </div>
                    )}
                    {showLabelsContainer &&
                        renderLabelsContainer(showCategories, categories, showFolderTag)}
                    {showPreviews && showAttachmentPreview && renderRichPreviewsWell()}
                    {renderCouponPreviews()}
                    {shouldShowRSVP && renderMeetingMessageInfo()}
                    {shouldShowTxpButton && renderTxpInfo()}
                    {shouldShowUnsubscribe && renderUnsubscribe()}
                </div>
            </div>
        );
    };
    //  Outer Container
    // -------------------------------------------------------------------------
    // |  Three Column Condensed View Container                                |
    // |  ----------------  -------------------------------------------------  |
    // |  | First Column |  |  Second Column                                |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  |              |  |  | Subject                                 |  |  |
    // |  |              |  |  |                                         |  |  |
    // |  |              |  |  -------------------------------------------  |  |
    // |  ----------------  -------------------------------------------------  |
    // -------------------------------------------------------------------------
    const renderCondensedThreeColumnViewMailListItem = () => {
        const {
            unreadCount,
            categories,
            isSelected,
            lastSender,
            rowKey,
            lastDeliveryTimestamp,
            isUnauthenticatedSender,
            firstLineText,
            firstLineTooltipText,
            showDraftsIndicator,
            shouldShowTwisty,
            shouldShowExternalLabel,
        } = props.mailListItemDataProps;
        const { isFirstLevelExpanded, isSecondLevelExpanded } = props;
        const { tableViewId, showFolderTag } = props.mailListTableProps;
        const isUnread = unreadCount > 0;
        const showCategories = categories?.length > 0;
        const showLabelsContainer = showFolderTag || showCategories;
        const condensedItemFirstRowThreeColUnreadStyle = hasDensityNext
            ? styles.condensedItemFirstRowThreeColumnUnreadNext
            : styles.condensedItemFirstRowThreeColumnUnread;
        const condensedItemFirstRowThreeColStyle = hasDensityNext
            ? styles.condensedItemFirstRowThreeColumnNext
            : styles.condensedItemFirstRowThreeColumn;
        return (
            <div
                className={classNames(
                    densityModeString,
                    styles.isCondensedPinnedRow,
                    hasDensityNext && styles.pinnedCheckboxSize
                )}>
                {
                    <div
                        className={classNames(
                            styles.firstColumnThreeColumn,
                            hasHighTwisty && styles.condensedHighTwisty
                        )}>
                        {hasHighTwisty &&
                            renderTwistyOrSpinner(
                                isSecondLevelExpanded,
                                false /* isCondensedView */,
                                shouldShowTwisty
                            )}
                        <PersonaCheckbox
                            tableViewId={tableViewId}
                            isSelected={isSelected}
                            lastSender={lastSender}
                            rowKey={rowKey}
                            lastDeliveryTimestamp={lastDeliveryTimestamp}
                            isUnauthenticatedSender={isUnauthenticatedSender}
                            styleSelectorAsPerUserSettings={props.styleSelectorAsPerUserSettings}
                            isCondensedView={true}
                        />
                    </div>
                }
                <div className={styles.column}>
                    <div
                        className={
                            isUnread
                                ? condensedItemFirstRowThreeColUnreadStyle
                                : condensedItemFirstRowThreeColStyle
                        }>
                        {shouldShowTwisty &&
                            !hasHighTwisty &&
                            renderTwistyOrSpinner(
                                isSecondLevelExpanded,
                                true /* isCondensedView */
                            )}
                        {shouldShowExternalLabel && renderExternalMarker()}
                        <div className={styles.condensedItemFirstRowTextThreeColumn}>
                            {renderCondensedRowText(
                                firstLineText,
                                firstLineTooltipText,
                                showDraftsIndicator
                            )}
                        </div>
                        {!isFirstLevelExpanded && renderUnreadCount(unreadCount)}
                        {renderIconBar()}
                    </div>
                    {showLabelsContainer &&
                        renderLabelsContainer(showCategories, categories, showFolderTag)}
                </div>
            </div>
        );
    };
    const renderLabelsContainer = (showCategories, categories, showFolderTag): JSX.Element => {
        const labelsContainerWithCategoriesStyle = styles.labelsContainerWithCategories;
        const labelsContainerWithoutCategoriesStyle = styles.labelsContainerWithoutCategories;
        return (
            <div
                className={
                    showCategories
                        ? labelsContainerWithCategoriesStyle
                        : labelsContainerWithoutCategoriesStyle
                }>
                {showCategories &&
                    renderCategories(
                        categories,
                        styles.categoryWellThreeColumn,
                        styles.categoryContainerThreeColumn
                    )}
                {showFolderTag && renderFolderTag()}
            </div>
        );
    };
    /**
     * Renders a tag that shows user what folder mail item is actually in.
     */
    const renderFolderTag = (): JSX.Element => {
        const { showPreviewText, isSingleLine } = props.mailListTableProps;
        const { parentFolderId, isNudged } = props.mailListItemDataProps;
        return (
            <FolderTag
                folderId={parentFolderId}
                isPreviewTextOn={showPreviewText || isNudged}
                isSingleLine={isSingleLine}
            />
        );
    };
    const onCategoryClicked = async (
        ev: React.MouseEvent<unknown>,
        category: string,
        actionSource: ActionSource
    ) => {
        // Need stop propagation so the click doesn't bubble up to container, i.e list view item and reading pane subject
        ev.stopPropagation();
        const startSearchWithCategory = await lazyStartSearchWithCategory.import();
        startSearchWithCategory(actionSource, category);
    };
    const renderCategories = (
        categories: string[],
        categoryWellContainerClass: string,
        categoryContainerClass: string
    ): JSX.Element => {
        return (
            <CategoryWell
                key={props.mailListItemDataProps.rowId}
                categoryWellContainerClass={categoryWellContainerClass}
                categoryContainerClass={categoryContainerClass}
                categories={categories}
                onCategoryClicked={onCategoryClicked}
            />
        );
    };
    const stopPropagation = (evt: React.MouseEvent<unknown>) => {
        evt.stopPropagation();
    };
    const { isSingleLine } = props.mailListTableProps;
    return (
        <>
            {isSingleLine
                ? renderSingleLineViewMailListItem()
                : renderThreeColumnViewMailListItem()}
        </>
    );
});
