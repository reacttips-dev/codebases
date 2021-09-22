import CollapsedItemPart from './CollapsedItemPart';
import ExpandedItemPart from './ExpandedItemPart';
import FossilizedText from './FossilizedText';
import OofRollUp from './oofRollUp/OofRollUp';
import SentReceivedSavedTime from './SentReceivedSavedTime';
import { renderCollapsedItemPart, renderExpandedItemPart } from '../utils/readingPaneRenderChooser';
import shouldShowCollapsedMeetingMessage from '../utils/shouldShowCollapsedMeetingMessage';
/* tslint:disable:forbid-import */
import { autorun } from 'mobx';
/* tslint:enable:forbid-import */
import { logVerboseUsage } from 'owa-analytics';
import type { ClientItemId } from 'owa-client-ids';
import toggleSelectItemPart from 'owa-mail-reading-pane-store/lib/actions/toggleSelectItemPart';
import { FocusedItemArea } from 'owa-mail-reading-pane-store/lib/store/schema/FocusedItemPart';
import type ItemPartViewState from 'owa-mail-reading-pane-store/lib/store/schema/ItemPartViewState';
import getConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/utils/getConversationReadingPaneViewState';
import isNewestOnBottom from 'owa-mail-store/lib/utils/isNewestOnBottom';
import type { ClientItem } from 'owa-mail-store';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import type ConversationReadingPaneNode from 'owa-mail-store/lib/store/schema/ConversationReadingPaneNode';
import { LocalLieState } from 'owa-mail-store/lib/store/schema/LocalLieState';
import mailStore from 'owa-mail-store/lib/store/Store';
import getItemRightsManagementRestrictions from 'owa-mail-store/lib/utils/getItemRightsManagementRestrictions';
import { CollapsedMeetingMessage } from 'owa-meeting-message';
import * as React from 'react';
import { reactive } from 'satcheljs/lib/legacy/react';

import styles from './ConversationReadingPane.scss';

export interface ItemPartProps {
    instrumentationContext: InstrumentationContext;
    viewState: ItemPartViewState;
    item?: ClientItem;
    conversationNode?: ConversationReadingPaneNode;
    handleItemPartScrolling: (
        viewState: ItemPartViewState,
        itemPartDivElement: HTMLDivElement,
        hasFossilizedText: boolean,
        isDelayLoadCallback?: boolean
    ) => void;
    quotedBodyExpandedCallback: (quotedBodyOffsetTop: number) => void;
    fossilizedTextCollapsedCallback: (fossilizedTextOffsetTop: number) => void;
    isLatestNonDraft: boolean;
    focusedArea: FocusedItemArea;
    isFirstItemInConversation: boolean;
    isSingleItemConversation: boolean;
    calendarItemId: ClientItemId;
    shouldNotGrabFocus?: boolean;
    isSingleLineListView?: boolean;
}

@reactive({
    item: (props: ItemPartProps) => mailStore.items.get(props.viewState.itemId),
    conversationNode: (props: ItemPartProps) =>
        mailStore.conversationNodes.get(props.viewState.conversationNodeId),
})
export default class ItemPart extends React.Component<ItemPartProps, any> {
    private autorunDisposer: any;
    private itemPartDiv: HTMLDivElement;

    // These booleans are persisted as oposed to using `previousProps` provided in component lifecyle hooks so that
    // they can be used in the @autorun
    private previousIsExpanded: boolean;
    private previousIsOofRollupExpanded: boolean;

    public componentDidUpdate(prevProps: ItemPartProps) {
        // Focus on the itemPart if:
        // - Focus is not in itemPart
        // - It changed from unfocused to focused
        // - It is focused but changed expanded/collapsed state
        // - Item part should grab focus
        if (
            this.itemPartDiv &&
            !this.isFocusInItemPart() &&
            !this.props.shouldNotGrabFocus &&
            ((prevProps.focusedArea != FocusedItemArea.Item &&
                this.props.focusedArea == FocusedItemArea.Item) ||
                (this.props.focusedArea == FocusedItemArea.Item &&
                    this.previousIsExpanded != this.props.viewState.isExpanded))
        ) {
            this.itemPartDiv.focus();
        }

        // If the ItemPart or its OOF rollup has just been expanded
        if (
            this.props.viewState.isExpanded != this.previousIsExpanded ||
            this.props.viewState.oofRollUpViewState.isOofRollUpExpanded !=
                this.previousIsOofRollupExpanded
        ) {
            if (
                this.props.viewState.isExpanded ||
                this.props.viewState.oofRollUpViewState.isOofRollUpExpanded
            ) {
                this.props.handleItemPartScrolling(
                    this.props.viewState,
                    this.itemPartDiv,
                    this.hasFossilizedText()
                );
            }

            this.previousIsExpanded = this.props.viewState.isExpanded;
            this.previousIsOofRollupExpanded = this.props.viewState.oofRollUpViewState.isOofRollUpExpanded;
        }
    }

    public componentWillUnmount() {
        this.autorunDisposer();
    }

    public componentDidMount() {
        this.props.handleItemPartScrolling(
            this.props.viewState,
            this.itemPartDiv,
            this.hasFossilizedText()
        );
        this.previousIsExpanded = this.props.viewState.isExpanded;
        this.previousIsOofRollupExpanded = this.props.viewState.oofRollUpViewState.isOofRollUpExpanded;

        // Log usage for initial load with FossilizedText.
        if (this.hasFossilizedText()) {
            logVerboseUsage('RPCountFossilizedText', [this.previousIsExpanded, isNewestOnBottom()]);
        }

        // Log usage for number of items with QuotedText
        if (this.props.conversationNode.hasQuotedText) {
            logVerboseUsage('RPCountHasQuotedText', [
                this.props.conversationNode.isQuotedTextChanged,
            ]);
        }

        this.autorunDisposer = autorun(() => {
            // Scrolling is usually handled from componentWillUpdate(cwu).
            // If the itemIdToScrollTo matches this itemPart's itemId, but viewState.isExpanded or viewState.isOofRollUpExpanded have
            // not changed, render and cwu will not be triggered.
            // Scrolling for that case is handled here using autorun.
            // If the itemPart or rollup is NOT expanded, the same action that sets the itemId will set viewState.isExpanded or viewState.isOofRollUpExpanded to be true
            // this itemPart/ OOF rollup and we'll scroll from componentDidUpdate.
            // Note that the action that sets itemIdToScrollTo also sets.
            if (
                // The conversationReadingPaneViewState is null when user switches from Conversation view to Message view
                getConversationReadingPaneViewState() &&
                getConversationReadingPaneViewState().itemIdToScrollTo ==
                    this.props.viewState.itemId &&
                this.previousIsExpanded === this.props.viewState.isExpanded &&
                this.previousIsOofRollupExpanded ===
                    this.props.viewState.oofRollUpViewState.isOofRollUpExpanded
            ) {
                this.props.handleItemPartScrolling(
                    this.props.viewState,
                    this.itemPartDiv,
                    this.hasFossilizedText()
                );
            }
        });
    }

    private isFocusInItemPart = (): boolean => {
        return (
            this.itemPartDiv &&
            (document.activeElement == this.itemPartDiv ||
                this.itemPartDiv.contains(document.activeElement))
        );
    };

    private hasFossilizedText() {
        return (
            this.props.conversationNode?.quotedTextList &&
            this.props.conversationNode.quotedTextList.length > 0
        );
    }

    private setItemPartDiv = (div: HTMLDivElement) => {
        if (div) {
            this.itemPartDiv = div;
        }
    };

    private onLazyMount = () => {
        // We need to caputure lazy components mounting and trigger scrolling again.
        this.props.handleItemPartScrolling(
            this.props.viewState,
            this.itemPartDiv,
            this.hasFossilizedText(),
            true /* isDelayLoadCallback */
        );
    };

    private onToggleExpandCollapseSelect = () => {
        const selection = window.getSelection();
        if (selection && selection.toString()) {
            return;
        }
        toggleSelectItemPart(
            this.props.item.ConversationId?.Id,
            this.props.viewState,
            true /*toggleExpandCollapsed*/
        );
    };

    render() {
        const { conversationNode, item, viewState, isLatestNonDraft, focusedArea } = this.props;
        if (!item || !conversationNode) {
            // Item can be null happen when soft delete an item.
            // Even though its view state has been removed in store, it still calls render one last time.
            //
            // ConversationNode shouldn't be null when rendering an itemPart, but if this happens, abort VSO #27360.
            return null;
        }
        const className = viewState.undoDarkMode ? styles.undoDarkMode : '';

        const orderedQuotedTextListUpdate =
            item.TranslationData?.isShowingForwardContentTranslation &&
            item.TranslationData.forwardContentTranslationText.length > 0
                ? item.TranslationData.forwardContentTranslationText
                : conversationNode.quotedTextList;

        const irmRestrictions = getItemRightsManagementRestrictions(item);
        let itemPartContainer: JSX.Element;
        const isNodePending = conversationNode.localLieState == LocalLieState.Pending;
        const fossilizedText = (
            <FossilizedText
                quotedTextList={orderedQuotedTextListUpdate}
                nodeId={viewState.conversationNodeId}
                fossilizedTextCollapsedCallback={this.props.fossilizedTextCollapsedCallback}
                isExpanded={viewState.isFossilizedTextExpanded}
                undoDarkMode={viewState.undoDarkMode}
                copyAllowed={irmRestrictions.CopyAllowed}
                printAllowed={irmRestrictions.PrintAllowed}
                isFocused={
                    focusedArea == FocusedItemArea.FossilizedText ||
                    (focusedArea == FocusedItemArea.Item && !isNewestOnBottom())
                }
                item={item}
            />
        );
        const oofContent = viewState.oofRollUpViewState.oofReplyNodeIds.length ? (
            <OofRollUp
                parentItemPartViewState={viewState}
                isExpanded={viewState.oofRollUpViewState.isOofRollUpExpanded}
                isFocused={focusedArea == FocusedItemArea.Oof}
                instrumentationContext={this.props.instrumentationContext}
            />
        ) : null;

        if (viewState.isExpanded) {
            itemPartContainer = renderExpandedItemPart(
                <ExpandedItemPart
                    item={item}
                    viewState={viewState}
                    refCallback={this.setItemPartDiv}
                    showQuotedBody={
                        !conversationNode.quotedTextList &&
                        conversationNode.hasQuotedText &&
                        !isNodePending
                    }
                    isQuotedTextChanged={conversationNode.isQuotedTextChanged}
                    quotedTextState={conversationNode.quotedTextState}
                    diffingInformation={conversationNode.diffingInformation}
                    quotedBodyExpandedCallback={this.props.quotedBodyExpandedCallback}
                    isNodePending={isNodePending}
                    onLazyMount={this.onLazyMount}
                    irmRestrictions={irmRestrictions}
                    instrumentationContext={this.props.instrumentationContext}
                    isLatestNonDraft={isLatestNonDraft}
                    isFocused={focusedArea == FocusedItemArea.Item}
                    isFirstItemInConversation={this.props.isFirstItemInConversation}
                    isSingleItemConversation={this.props.isSingleItemConversation}
                    calendarItemId={this.props.calendarItemId}
                    isSingleLineListView={this.props.isSingleLineListView}
                />,
                fossilizedText,
                oofContent
            );
        } else {
            const collapsedItemPart =
                this.props.calendarItemId && shouldShowCollapsedMeetingMessage(item) ? (
                    <CollapsedMeetingMessage
                        item={item}
                        refCallback={this.setItemPartDiv}
                        toggleExpandCollapse={this.onToggleExpandCollapseSelect}
                        isFocused={focusedArea == FocusedItemArea.Item}
                        timeStamp={
                            <SentReceivedSavedTime
                                time={item.DateTimeReceived}
                                treatAsDraft={false}
                            />
                        }
                        onDidMount={this.onLazyMount}
                    />
                ) : (
                    <CollapsedItemPart
                        item={item}
                        refCallback={this.setItemPartDiv}
                        instrumentationContext={this.props.instrumentationContext}
                        viewState={viewState}
                        isNodePending={isNodePending}
                        printAllowed={irmRestrictions.PrintAllowed}
                        isFocused={focusedArea == FocusedItemArea.Item}
                        toggleExpandCollapse={this.onToggleExpandCollapseSelect}
                    />
                );
            itemPartContainer = renderCollapsedItemPart(
                collapsedItemPart,
                fossilizedText,
                oofContent
            );
        }
        return <div className={className}>{itemPartContainer}</div>;
    }
}
