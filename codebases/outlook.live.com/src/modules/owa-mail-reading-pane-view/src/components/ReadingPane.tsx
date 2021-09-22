import ConversationReadingPane from './ConversationReadingPane';
import EmptyStateReadingPane from './EmptyStateReadingPane';
import ItemReadingPane from './ItemReadingPane';
import NullReadingPane from './NullReadingPane';
import PrintItemReadingPane from './PrintItemReadingPane';
import PrintPanel from './PrintPanel';
import { observer } from 'mobx-react';
import { SelectionType } from 'owa-addins-core';
import type { ClientItemId } from 'owa-client-ids';
import { lazyInitializeGetItemManagerForRP } from 'owa-get-item-manager-initialization';
import { updateAddinOnItemNavigation } from 'owa-mail-addins';
import findInlineComposeViewState from 'owa-mail-compose-actions/lib/utils/findInlineComposeViewState';
import { isReadingPanePositionOff } from 'owa-mail-layout/lib/selectors/readingPanePosition';
import getInstrumentationContextsFromTableView from 'owa-mail-list-store/lib/utils/getInstrumentationContextsFromTableView';
import { getMailListLoadState } from 'owa-mail-list-store/lib/utils/getMailListLoadState';
import { MultiSelectReadingPane } from 'owa-mail-multiselect-reading-pane-view';
import setShouldShowMobileUpsellEmptyState from 'owa-mail-reading-pane-store/lib/actions/setShouldShowMobileUpsellEmptyState';
import type ReadingPaneStore from 'owa-mail-reading-pane-store/lib/store/schema/ReadingPaneStore';
import readingPaneStore from 'owa-mail-reading-pane-store/lib/store/Store';
import getConversationReadingPaneViewState from 'owa-mail-reading-pane-store/lib/utils/getConversationReadingPaneViewState';
import getItemReadingPaneViewState from 'owa-mail-reading-pane-store/lib/utils/getItemReadingPaneViewState';
import { MailListViewState } from 'owa-mail-store/lib/store/schema/MailListViewState';
import shouldShowUnstackedReadingPane from 'owa-mail-store/lib/utils/shouldShowUnstackedReadingPane';
import ReactListViewType from 'owa-service/lib/contract/ReactListViewType';
import { getActiveContentTab, TabType } from 'owa-tab-store';
import * as trace from 'owa-trace';
import * as React from 'react';
import { reactive } from 'satcheljs/lib/legacy/react';
import {
    getSelectedTableView,
    MailRowDataPropertyGetter,
    listViewStore,
} from 'owa-mail-list-store';
import {
    EmptyStateMobilePromoComponent,
    lazyShouldShowEmptyStateMobilePromo,
    OutlookMobileContainer,
} from 'owa-guided-setup-cards';
import {
    getHeaderImageData,
    getCurrentThemeId,
    getEdgeThemeProps,
    getEmptyStateBingLogo,
    isThemeofDayIconVisible,
} from 'owa-theme-legacy';
import { isPopout } from 'owa-popout-v2';
import ProjectionContext from 'owa-popout-v2/lib/context/ProjectionContext';
import isAnySxSVisibleInMainWindow from 'owa-sxs-store/lib/utils/isAnySxSVisibleInMainWindow';
import styles from './ReadingPane.scss';

export interface ReadingPaneProps {
    readingPaneStore?: ReadingPaneStore;
    isInVirtualSelectAllMode?: boolean;
    listViewType?: ReactListViewType;
    mailListViewState?: MailListViewState;
    selectedRowKeys?: string[];
    selectedItemPartsCount?: number;
    isDeeplink?: boolean;
    isDumpsterOrDumpsterSearchTable?: boolean;
    isNotesFolder?: boolean;
    itemId?: ClientItemId;
    isFromMainWindow?: boolean;
    isItemAttachment?: boolean;
}

@reactive({
    readingPaneStore: () => readingPaneStore,
    isInVirtualSelectAllMode: () =>
        getSelectedTableView() && getSelectedTableView().isInVirtualSelectAllMode,
    listViewType: () => getSelectedTableView() && getSelectedTableView().tableQuery.listViewType,
    mailListViewState: () => getMailListLoadState(),
    selectedRowKeys: () =>
        getSelectedTableView() && [...getSelectedTableView().selectedRowKeys?.keys()],
    selectedItemPartsCount: () =>
        listViewStore.expandedConversationViewState.selectedNodeIds.length,
})
@observer
export default class ReadingPane extends React.Component<ReadingPaneProps, {}> {
    static contextType = ProjectionContext;

    constructor(props: ReadingPaneProps) {
        super(props);

        lazyShouldShowEmptyStateMobilePromo.import().then(shouldShowPromo => {
            shouldShowPromo().then(showMobilePromo => {
                setShouldShowMobileUpsellEmptyState(showMobilePromo);
            });
        });
        // Intialize the get item manager for reading pane.
        lazyInitializeGetItemManagerForRP.import().then(initializeGetItemManagerForRP => {
            initializeGetItemManagerForRP();
        });
    }

    render() {
        const {
            readingPaneStore,
            isInVirtualSelectAllMode,
            selectedRowKeys,
            itemId,
            mailListViewState,
            isDumpsterOrDumpsterSearchTable,
            isNotesFolder,
            selectedItemPartsCount,
            listViewType,
            isFromMainWindow,
            isItemAttachment,
        } = this.props;
        const {
            itemPrintPaneViewState,
            deeplinkId,
            shouldShowMobileUpsellEmptyState,
            primaryReadingPaneTabId,
        } = readingPaneStore;
        const itemReadingPaneViewState = getItemReadingPaneViewState(itemId?.Id);
        const conversationReadingPaneViewState = getConversationReadingPaneViewState();
        const activeTab = getActiveContentTab();
        const { emptyStateBg, emptyStateImgUrl } = getHeaderImageData(getCurrentThemeId());
        const { bingQueryButtonText } = getEdgeThemeProps();
        const targetWindow = this.context;

        let readingPaneContent: JSX.Element = <NullReadingPane />;

        // we render reading pane only if it is from main window with no SxS open, or, it is from a projection window
        if (!isFromMainWindow || !isAnySxSVisibleInMainWindow()) {
            if (deeplinkId) {
                // Deeplink UIs.
                readingPaneContent = deeplinkId.isPrint ? (
                    <PrintItemReadingPane
                        itemId={deeplinkId.id}
                        viewState={itemPrintPaneViewState}
                    />
                ) : (
                    <ItemReadingPane
                        itemId={{
                            mailboxInfo: deeplinkId.mailboxInfo,
                            Id: deeplinkId.id,
                        }}
                        itemReadingPaneViewState={itemReadingPaneViewState}
                        isPopout={true}
                        isItemAttachment={isItemAttachment}
                    />
                );
            } else if (itemId) {
                readingPaneContent = (
                    <ItemReadingPane
                        itemId={itemId}
                        itemReadingPaneViewState={itemReadingPaneViewState}
                        isPopout={isPopout(targetWindow)}
                        isItemAttachment={isItemAttachment}
                    />
                );
            } else if (activeTab && activeTab.type == TabType.SecondaryReadingPane) {
                const secondaryReadingPaneTabData = activeTab.data;
                switch (secondaryReadingPaneTabData.listViewType) {
                    case ReactListViewType.Conversation:
                        if (shouldShowUnstackedReadingPane()) {
                            readingPaneContent = (
                                <ItemReadingPane
                                    itemId={secondaryReadingPaneTabData.id}
                                    itemSubject={secondaryReadingPaneTabData.subject}
                                    itemReadingPaneViewState={getItemReadingPaneViewState(
                                        secondaryReadingPaneTabData.id?.Id
                                    )}
                                    isPopout={isPopout(targetWindow)}
                                    isItemAttachment={isItemAttachment}
                                />
                            );
                        } else {
                            if (secondaryReadingPaneTabData.id) {
                                readingPaneContent = (
                                    <ConversationReadingPane
                                        conversationId={secondaryReadingPaneTabData.id}
                                        conversationSubject={secondaryReadingPaneTabData.subject}
                                        conversationCategories={
                                            secondaryReadingPaneTabData.categories
                                        }
                                    />
                                );
                            } else {
                                trace.errorThatWillCauseAlert(
                                    'ReadingPane.render() secondaryReadingPaneTabData.id should not be null.'
                                );
                            }
                        }
                        break;
                    case ReactListViewType.Message:
                        readingPaneContent = (
                            <ItemReadingPane
                                itemId={secondaryReadingPaneTabData.id}
                                itemSubject={secondaryReadingPaneTabData.subject}
                                itemReadingPaneViewState={itemReadingPaneViewState}
                                isPopout={isPopout(targetWindow)}
                                isItemAttachment={isItemAttachment}
                            />
                        );
                        break;
                }
            } else if (
                conversationReadingPaneViewState?.conversationId &&
                findInlineComposeViewState(conversationReadingPaneViewState.conversationId.Id)
            ) {
                // If RP has inline compose open, render conversation in RP store.
                readingPaneContent = (
                    <ConversationReadingPane
                        conversationId={conversationReadingPaneViewState.conversationId}
                        conversationSubject={conversationReadingPaneViewState.conversationSubject}
                        conversationCategories={
                            conversationReadingPaneViewState.conversationCategories
                        }
                    />
                );
            } else if (
                selectedRowKeys?.length == 1 &&
                selectedItemPartsCount <= 1 &&
                !isInVirtualSelectAllMode &&
                !isDumpsterOrDumpsterSearchTable
            ) {
                // 1 row selected: display reading pane only if select all is not checked and not in dumpster or dumpster search
                const tableView = getSelectedTableView();
                const rowId = MailRowDataPropertyGetter.getRowIdToShowInReadingPane(
                    selectedRowKeys[0],
                    tableView
                );
                const rowSubject = MailRowDataPropertyGetter.getSubject(
                    selectedRowKeys[0],
                    tableView
                );
                const rowCategories = MailRowDataPropertyGetter.getCategories(
                    selectedRowKeys[0],
                    tableView
                );
                switch (listViewType) {
                    case ReactListViewType.Conversation:
                        if (shouldShowUnstackedReadingPane() && !!primaryReadingPaneTabId) {
                            readingPaneContent = (
                                <ItemReadingPane
                                    itemId={primaryReadingPaneTabId}
                                    itemSubject={rowSubject}
                                    itemReadingPaneViewState={getItemReadingPaneViewState()}
                                    isPopout={isPopout(targetWindow)}
                                    isItemAttachment={isItemAttachment}
                                />
                            );
                        } else {
                            if (rowId) {
                                const instrumentationContext = getInstrumentationContextsFromTableView(
                                    [selectedRowKeys[0]],
                                    tableView
                                )[0];

                                readingPaneContent = (
                                    <ConversationReadingPane
                                        conversationId={rowId}
                                        conversationSubject={rowSubject}
                                        conversationCategories={rowCategories}
                                        instrumentationContext={instrumentationContext}
                                    />
                                );
                            } else {
                                trace.errorThatWillCauseAlert(
                                    'ReadingPane.render() rowId should not be null.'
                                );
                            }
                        }
                        break;
                    case ReactListViewType.Message:
                        readingPaneContent = (
                            <ItemReadingPane
                                itemId={rowId}
                                itemSubject={rowSubject}
                                itemReadingPaneViewState={itemReadingPaneViewState}
                                isPopout={isPopout(targetWindow)}
                                isItemAttachment={isItemAttachment}
                            />
                        );
                        break;
                }
            } else if (
                isInVirtualSelectAllMode ||
                selectedRowKeys?.length > 0 ||
                selectedItemPartsCount > 1
            ) {
                // Multiple items selected or all items are selected
                readingPaneContent = (
                    <MultiSelectReadingPane
                        isDumpsterOrDumpsterSearchTable={isDumpsterOrDumpsterSearchTable}
                        isNotesFolder={isNotesFolder}
                    />
                );
            } else if (
                mailListViewState === MailListViewState.Loaded ||
                mailListViewState === MailListViewState.Empty ||
                readingPaneStore.shouldShowEmptyReadingPane
            ) {
                // Empty state.
                readingPaneContent = shouldShowMobileUpsellEmptyState ? (
                    <EmptyStateMobilePromoComponent
                        containerName={OutlookMobileContainer.ReadingPane}
                        onComponentUnmount={onOutlookMobileUnmount}
                    />
                ) : isThemeofDayIconVisible() && emptyStateBg ? (
                    <div className={styles.emptyStateBg}>
                        <img className={styles.emptyStateBgImg} src={emptyStateBg} />
                        <div className={styles.emptyStateBingDiv} onClick={onEmptyStateImageClick}>
                            <div className={styles.emptyStateBingLogo}>
                                <img src={getEmptyStateBingLogo()} />
                            </div>
                            <div className={styles.emptyStateBingDesc}>{bingQueryButtonText}</div>
                        </div>
                    </div>
                ) : (
                    <EmptyStateReadingPane
                        isDumpsterOrDumpsterSearchTable={isDumpsterOrDumpsterSearchTable}
                        mailListViewState={mailListViewState}
                    />
                );
            }
        }

        function onOutlookMobileUnmount() {
            setShouldShowMobileUpsellEmptyState(false);
        }

        function onEmptyStateImageClick() {
            window.open(emptyStateImgUrl);
        }

        return (
            <div key="readingPaneDiv" className={styles.absolutePosition}>
                {readingPaneContent}
                {itemPrintPaneViewState?.itemId && (
                    <PrintPanel
                        itemId={itemPrintPaneViewState.itemId}
                        viewState={itemPrintPaneViewState}
                    />
                )}
            </div>
        );
    }

    componentWillUnmount() {
        if (isReadingPanePositionOff()) {
            updateAddinOnItemNavigation(SelectionType.NotSupported);
        }
    }
}
