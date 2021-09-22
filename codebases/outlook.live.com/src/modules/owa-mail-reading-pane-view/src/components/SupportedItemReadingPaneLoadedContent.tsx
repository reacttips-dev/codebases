import { GlobalReplyBar } from './GlobalReplyBar';
import ItemHeader from './ItemHeader';
import itemReadingPaneStyles from './ItemReadingPane.scss';
import LoadFullBodyButton from './LoadFullBodyButton';
import MailMessageBodyWithAmp from './MailMessageBodyWithAmp';
import renderSmartPillBlock from '../utils/renderSmartPillBlock';
import classnamesBind from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { logUsage } from 'owa-analytics';
import { WideContentHost } from 'owa-controls-content-handler';
import { isFeatureEnabled } from 'owa-feature-flags';
import getDisplayedMessageBody from 'owa-mail-reading-pane-store/lib/utils/getDisplayedMessageBody';
import isMessageListSeparate from 'owa-mail-store/lib/utils/isMessageListSeparate';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import ProjectionContext from 'owa-popout-v2/lib/context/ProjectionContext';
import { getDensityModeString } from 'owa-fabric-theme';
import { lazyOverrideCustomZoomToDefault } from 'owa-custom-zoom';
import { trace } from 'owa-trace';
import * as React from 'react';
import type { ItemReadingPaneProps } from './ItemReadingPane';
import type IRMRestrictions from 'owa-mail-store/lib/store/schema/IRMRestrictions';
import type BodyContentType from 'owa-service/lib/contract/BodyContentType';

const classNames = classnamesBind.bind(itemReadingPaneStyles);

const newLineRegex = /(?:\r\n|\r|\n)/g;
const newLineHtml = '<br />';

export interface SupportedItemReadingPaneLoadedContentProps extends ItemReadingPaneProps {
    irmRestrictions: IRMRestrictions;
    isCurrentItemLoaded: boolean;
    isSingleLineListView?: boolean;
}

export default observer(function SupportedItemReadingPaneLoadedContent(
    props: SupportedItemReadingPaneLoadedContentProps
) {
    const targetWindow = React.useContext(ProjectionContext);
    const hasDensityNext = isFeatureEnabled('mon-densities');
    const densityMode = hasDensityNext ? getDensityModeString() : null;

    const renderSupportedItemReadingPaneLoadedContent = (): JSX.Element => {
        const { item, itemReadingPaneViewState, irmRestrictions } = props;
        const translatedBody: BodyContentType =
            isFeatureEnabled('rp-inlineTranslation-conversationViewOff') &&
            item.TranslationData &&
            item.TranslationData.isShowingTranslation
                ? { Value: item.TranslationData.translationText }
                : null;
        const displayedMessageBody = getDisplayedMessageBody(
            item.RightsManagementLicenseData,
            translatedBody || item.NormalizedBody
        );
        const itemViewState = itemReadingPaneViewState.itemViewState;
        const darkModeClassName = itemViewState.undoDarkMode
            ? itemReadingPaneStyles.undoDarkMode
            : '';
        const isReadonly = itemReadingPaneViewState.isReadonly;
        // Replace new lines with <br /> for text body as new-lines will be ignored by 'dangerouslySetInnerHTML'
        const shouldReplaceNlWithBr =
            item?.NormalizedBody &&
            item.NormalizedBody.BodyType === 'Text' &&
            (displayedMessageBody == item.NormalizedBody.Value ||
                displayedMessageBody == item.TranslationData.translationText);
        const showSmartPillsOnTop = isFeatureEnabled('mc-smartPillsMessageViewOnTop');
        const overrideCustomZoomToDefault = lazyOverrideCustomZoomToDefault.tryImportForRender();
        return (
            <div
                className={classNames(
                    overrideCustomZoomToDefault?.(),
                    densityMode,
                    itemReadingPaneStyles.contentContainer,
                    {
                        isItemAttachment: props.isItemAttachment,
                    },
                    darkModeClassName
                )}>
                <ItemHeader
                    item={item}
                    viewState={itemViewState}
                    isPopout={props.isPopout}
                    shouldIncludeFullInfo={true}
                    instrumentationContext={itemReadingPaneViewState.instrumentationContext}
                    isItemAttachment={props.isItemAttachment}
                    isReadonly={isReadonly}
                    isLatestNonDraft={true}
                    targetWindow={targetWindow}
                    isCurrentItemLoaded={props.isCurrentItemLoaded}
                    isSingleLineListView={props.isSingleLineListView}
                />

                {!isReadonly &&
                    showSmartPillsOnTop &&
                    !props.isItemAttachment &&
                    renderSmartPillBlock(item, itemViewState, true /* showOnTop */)}
                <MailMessageBodyWithAmp
                    className={classNames(
                        itemReadingPaneStyles.messageBody,
                        shouldShowUnstackedReadingPane() &&
                            itemReadingPaneStyles.unstackedReadingPane,
                        hasDensityNext &&
                            isMessageListSeparate() &&
                            itemReadingPaneStyles.unstackedReadingPane
                        // when ML is showing separate, RP must be separate, so style it as unstacked
                    )}
                    messageBody={
                        shouldReplaceNlWithBr ? nlToBr(displayedMessageBody) : displayedMessageBody
                    }
                    item={item}
                    copyAllowed={irmRestrictions.CopyAllowed}
                    printAllowed={irmRestrictions.PrintAllowed}
                    isLoading={itemViewState.loadingState.isLoading}
                    undoDarkMode={itemViewState.undoDarkMode}
                    actionableMessageCardInItemViewState={
                        itemViewState.actionableMessageCardInItemViewState
                    }
                    ampViewState={itemViewState.ampViewState}
                    measureReadTime={!props.isItemAttachment}
                />

                {item.NormalizedBody?.IsTruncated && (
                    <LoadFullBodyButton viewState={itemViewState} />
                )}

                {!isReadonly &&
                    !showSmartPillsOnTop &&
                    isFeatureEnabled('mc-smartPillsMessageView') &&
                    !props.isItemAttachment &&
                    renderSmartPillBlock(item, itemViewState)}
                {!shouldShowUnstackedReadingPane() && !isReadonly && (
                    <GlobalReplyBar
                        conversationId={null}
                        item={item}
                        instrumentationContext={itemReadingPaneViewState.instrumentationContext}
                        targetWindow={targetWindow}
                        densityMode={densityMode}
                    />
                )}
            </div>
        );
    };

    if (!props.item) {
        // VSTS: 41235. If the item has been removed from the mailStore, return null to avoid component errors.
        trace.warn("SupportedItemReadingPaneLoadedContent can't find item");
        logUsage('SupportedReadingPaneNoItem');
        return null;
    }
    return <WideContentHost>{renderSupportedItemReadingPaneLoadedContent()}</WideContentHost>;
});

function nlToBr(displayedMessageBody: string) {
    return displayedMessageBody.replace(newLineRegex, newLineHtml);
}
