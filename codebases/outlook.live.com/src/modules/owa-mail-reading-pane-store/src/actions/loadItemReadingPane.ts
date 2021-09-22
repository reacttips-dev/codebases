import initializeExtendedCardForItemReadingPane from './initializeExtendedCardForItemReadingPane';
import initializeExtendedStateForItemViewState from './initializeExtendedStateForItemViewState';
import setItemReadingPaneViewState from '../actions/setItemReadingPaneViewState';
import datapoints from '../datapoints';
import initializeInfoBarIdsForItem from '../infoBar/initializeInfoBarIdsForItem';
import { releaseOrphanedLoadedItemViewStates } from '../mutators/loadedItemViewStateMutators';
import { getStore } from '../store/Store';
import getItemReadingPaneViewState from '../utils/getItemReadingPaneViewState';
import { getItemReadingPaneStateDatapoint } from '../utils/getReadingPaneStateCustomData';
import hasMeetingPoll from '../utils/hasMeetingPoll';
import { isUnsupportedItem } from '../utils/unsupportedItemUtils';
import { isFeatureEnabled } from 'owa-feature-flags';
import createInfoBarHostViewState from 'owa-info-bar/lib/utils/createInfoBarHostViewState';
import createAmpViewState from 'owa-mail-amp-store/lib/utils/createAmpViewState';
import { getFolderIdForSelectedNode } from 'owa-mail-folder-forest-store';
import { lazyUpdateItemCLPInfo } from 'owa-mail-protection';
import getInitialOmeMessageState from 'owa-mail-revocation/lib/utils/getInitialOmeMessageState';
import { lazyLoadItem as loadItemAction } from 'owa-mail-store-actions';
import { getStore as getMailStore } from 'owa-mail-store/lib/store/Store';
import { lazyTrySetSmimeProperties } from 'owa-smime';
import { lazySmimeAdapter } from 'owa-smime-adapter';
import SmimeErrorStateEnum from 'owa-smime-adapter/lib/store/schema/SmimeErrorStateEnum';
import smimeStore from 'owa-smime-adapter/lib/store/store';
import isSmimeAdapterInitialized from 'owa-smime-adapter/lib/utils/isSmimeAdapterInitialized';
import isSmimeAdapterUsable from 'owa-smime-adapter/lib/utils/isSmimeAdapterUsable';
import doesItemNeedToBeFetchedAgain from 'owa-smime/lib/utils/doesItemNeedToBeFetchedAgain';
import doesMessageHaveSmimePrefix from 'owa-smime/lib/utils/doesMessageHaveSmimePrefix';
import getSmimeErrorState from 'owa-smime/lib/utils/getSmimeErrorState';
import getSmimeType from 'owa-smime/lib/utils/getSmimeType';
import isSmimeDecoded from 'owa-smime/lib/utils/isSmimeDecoded';
import isSMIMEItem from 'owa-smime/lib/utils/isSMIMEItem';
import { trace } from 'owa-trace';
import { mutatorAction } from 'satcheljs';
import type ItemReadingPaneViewState from '../store/schema/ItemReadingPaneViewState';
import type ItemViewState from '../store/schema/ItemViewState';
import type LoadingState from '../store/schema/LoadingState';
import type SmartPillViewState from '../store/schema/SmartPillViewState';
import type { ClientItemId } from 'owa-client-ids';
import type { ClientItem } from 'owa-mail-store';
import type { InstrumentationContext } from 'owa-search/lib/types/InstrumentationContext';
import {
    returnTopExecutingActionDatapoint,
    PerformanceDatapoint,
    DatapointStatus,
    logUsage,
    wrapFunctionForDatapoint,
} from 'owa-analytics';

const eventName = 'RPProcessSmimeItem';

const processSmimeProperties = (itemId: ClientItemId, wasReloaded: boolean): Promise<void> => {
    trace.info(
        'S/MIME: processing S/MIME message. isSmimeAdapterAlreadyUsable: ' + isSmimeAdapterUsable()
    );
    const processSmimeItemDatapoint = new PerformanceDatapoint(eventName, { isCore: true });
    return (
        lazyTrySetSmimeProperties
            .import()
            .then(trySetSmimeProperties => trySetSmimeProperties(itemId))
            .then(() => {
                endProcessSmimeItemDatapoint(itemId, processSmimeItemDatapoint, wasReloaded);
            })
            // TODO: use finally when ES2018 is available
            .catch(() => {
                endProcessSmimeItemDatapoint(itemId, processSmimeItemDatapoint, wasReloaded);
            })
    );
};

function createInitialItemState(
    itemId: ClientItemId,
    isPrint: boolean,
    isReadonly: boolean
): ItemReadingPaneViewState {
    const initialLoadingState: LoadingState = {
        isLoading: true,
        hasLoadFailed: false,
    };
    const initialItemState: ItemReadingPaneViewState = {
        itemId: itemId.Id,
        itemViewState: null,
        isPrint: isPrint,
        loadingState: initialLoadingState,
        currentSelectedFolderId: getFolderIdForSelectedNode(),
        isUnsupportedItem: false,
        instrumentationContext: null,
        extendedCardViewState: null,
        isReadonly: isReadonly,
    };
    return initialItemState;
}

function loadItemState(itemId: ClientItemId, item: ClientItem): ItemViewState {
    const initialLoadingState: LoadingState = {
        isLoading: false,
        hasLoadFailed: false,
    };
    const smartPillViewState: SmartPillViewState = {
        smartPillBlockVisible: false,
    };

    const itemViewState: ItemViewState = {
        ...createInfoBarHostViewState(itemId.Id, initializeInfoBarIdsForItem()),
        itemId: itemId.Id,
        isConversationItemPart: false,
        attachmentWell: null,
        meetingRequestViewState: null,
        loadingState: initialLoadingState,
        actionableMessageCardInItemViewState: {
            showBodyWithMessageCard: false,
            showCardLoading: true,
        },
        undoDarkMode: false,
        isLoadingFullBody: false,
        smartPillViewState: smartPillViewState,
        hideSmartReplyFeedbackDialog: true,
        ampViewState: createAmpViewState(item),
        hasMeetingPoll: hasMeetingPoll(item),
        omeMessageState: getInitialOmeMessageState(item),
    };
    return itemViewState;
}

function updateLoadedItemState(
    itemReadingPaneViewState: ItemReadingPaneViewState,
    itemId: ClientItemId,
    instrumentationContext: InstrumentationContext,
    datapoint: PerformanceDatapoint,
    isPrint?: boolean,
    isPreviewPane?: boolean
) {
    if (itemReadingPaneViewState.itemId != itemId.Id) {
        // If a different item has been loaded before promise callback, skip.
        return;
    }
    const loadedItem: ClientItem = itemId?.Id && getMailStore().items.get(itemId.Id);
    setReadpingPaneItemState(itemReadingPaneViewState, itemId, loadedItem, instrumentationContext);

    if (loadedItem) {
        // Add item state custom data in datapoint
        datapoint.addCustomData(
            getItemReadingPaneStateDatapoint(loadedItem, isPreviewPane, isPrint)
        );

        // Initialized/Update ItemCLPInfo in the ClientItem Object.
        lazyUpdateItemCLPInfo.import().then(updateItemCLPInfo => {
            updateItemCLPInfo(loadedItem);
        });

        if (isUnsupportedItem(loadedItem)) {
            setReadpingPaneUnuspportedItem(itemReadingPaneViewState);
        } else {
            initializeExtendedStateForItemViewState(itemReadingPaneViewState.itemViewState, false, {
                item: loadedItem,
            });

            initializeExtendedCardForItemReadingPane(itemReadingPaneViewState, loadedItem);
        }
    }
}

const setReadpingPaneItemState = mutatorAction(
    'setReadpingPaneItemState',
    (
        itemReadingPaneViewState: ItemReadingPaneViewState,
        itemId: ClientItemId,
        loadedItem: ClientItem,
        instrumentationContext: InstrumentationContext
    ) => {
        itemReadingPaneViewState.itemViewState = loadItemState(itemId, loadedItem);
        itemReadingPaneViewState.loadingState.isLoading = false;
        itemReadingPaneViewState.loadingState.hasLoadFailed = loadedItem ? false : true;
        itemReadingPaneViewState.instrumentationContext = instrumentationContext;
    }
);

const setReadpingPaneUnuspportedItem = mutatorAction(
    'setReadpingPaneUnuspportedItem',
    (itemReadingPaneViewState: ItemReadingPaneViewState) => {
        itemReadingPaneViewState.isUnsupportedItem = true;
    }
);

const loadItem = (
    itemId: ClientItemId,
    datapoint: PerformanceDatapoint,
    isPreviewPane?: boolean,
    loadItemOverrideFunction?: (itemId: ClientItemId) => Promise<ClientItem>,
    isDiscovery?: boolean,
    scenarioName?: string
): Promise<ClientItem> => {
    return loadItemOverrideFunction
        ? loadItemOverrideFunction(itemId)
        : loadItemAction.importAndExecute(
              itemId,
              isPreviewPane ? 'LoadItemPreviewPane' : 'LoadItemReadingPane',
              datapoint,
              /**
               * shouldEnableSmimeHeader is defaulted to isSmimeAdapterUsable()
               * Note that isSmimeAdapterUsable() would return false if SmimeAdapter has not been initialized yet
               */
              isSmimeAdapterUsable() /* enableSmimeHeader */,
              isDiscovery,
              scenarioName
          );
};

// exported for tests only.
export const setSmimeProperties = (
    itemId: ClientItemId,
    datapoint: PerformanceDatapoint,
    loadedItem: ClientItem,
    isPreviewPane?: boolean,
    loadItemOverrideFunction?: (itemId: ClientItemId) => Promise<ClientItem>,
    scenarioName?: string
): Promise<void> => {
    if (isSMIMEItem(loadedItem)) {
        let wasItemReloaded;
        // SmimeAdapter will be initialized here if not already initialized.
        return lazySmimeAdapter
            .import()
            .then(() => {
                /**
                 * Item might need to be fetched again to get the p7m dataPackage in case this was a clear signed message,
                 * but ItemClass was not known before the first fetch.
                 * eg: in case of popout and deeplink
                 * */
                if (isSmimeAdapterUsable() && doesItemNeedToBeFetchedAgain(loadedItem)) {
                    wasItemReloaded = true;
                    return loadItem(
                        itemId,
                        datapoint,
                        isPreviewPane,
                        loadItemOverrideFunction,
                        null,
                        scenarioName
                    );
                }
                return loadedItem;
            })
            .then(() => processSmimeProperties(itemId, wasItemReloaded));
    }
    return Promise.resolve();
};

function endProcessSmimeItemDatapoint(
    itemId: ClientItemId,
    processSmimeItemDatapoint: PerformanceDatapoint,
    wasReloaded: boolean
) {
    const cachedItem = getMailStore().items.get(itemId?.Id);
    processSmimeItemDatapoint.addCustomData({
        smimeInstallationStatus: smimeStore.installationStatus,
        smimeType: getSmimeType(cachedItem),
        numAttachments: getNumberOfAttachments(cachedItem),
        wasReloaded,
    });
    isSmimeDecoded(cachedItem)
        ? processSmimeItemDatapoint.end()
        : processSmimeItemDatapoint.endWithError(
              DatapointStatus.ClientError,
              new Error(getSmimeErrorState(cachedItem).toString())
          );
}

function getNumberOfAttachments(cachedItem: ClientItem): string | number | boolean {
    return cachedItem?.Attachments?.length;
}

function loadAndUpdateItem(
    itemReadingPaneViewState: ItemReadingPaneViewState,
    itemId: ClientItemId,
    instrumentationContext: InstrumentationContext,
    datapoint: PerformanceDatapoint,
    isPrint?: boolean,
    isPreviewPane?: boolean,
    isDiscovery?: boolean,
    loadItemOverrideFunction?: (itemId: ClientItemId) => Promise<ClientItem>,
    scenarioName?: string
): Promise<void> {
    return loadItem(
        itemId,
        datapoint,
        isPreviewPane,
        loadItemOverrideFunction,
        isDiscovery,
        scenarioName
    )
        .then(loadedItem => {
            instrumentationContext?.dp?.addCheckpoint?.('LI_THEN');
            return setSmimeProperties(
                itemId,
                datapoint,
                loadedItem,
                isPreviewPane,
                loadItemOverrideFunction,
                scenarioName
            );
        })
        .then(() => {
            instrumentationContext?.dp?.addCheckpoint?.('LI_SMIME_THEN');
            return updateLoadedItemState(
                itemReadingPaneViewState,
                itemId,
                instrumentationContext,
                datapoint,
                isPrint,
                isPreviewPane
            );
        })
        .catch((error: Error) => {
            setItemReadingPaneOnError(itemReadingPaneViewState);
            return Promise.reject(error);
        });
}

const setItemReadingPaneOnError = mutatorAction(
    'setItemReadingPaneOnError',
    (itemReadingPaneViewState: ItemReadingPaneViewState) => {
        itemReadingPaneViewState.loadingState.isLoading = false;
        itemReadingPaneViewState.loadingState.hasLoadFailed = true;
    }
);

export default wrapFunctionForDatapoint(
    datapoints.RPPerfLoadItemReadingPane,
    function loadItemReadingPane(
        itemId: ClientItemId,
        instrumentationContext?: InstrumentationContext,
        storeViewState?: (viewState: ItemReadingPaneViewState) => void,
        isPrint?: boolean,
        isPreviewPane?: boolean,
        isReadonly?: boolean,
        isDiscovery?: boolean,
        scenarioName?: string,
        loadItemOverrideFunction?: (itemId: ClientItemId) => Promise<ClientItem>
    ): Promise<void> {
        // Update current item reading pane state to be initial state.
        let viewState = createInitialItemState(itemId, isPrint, !!isReadonly);
        releaseOrphanedLoadedItemViewStates();
        setItemReadingPaneViewState(viewState);
        if (storeViewState) {
            storeViewState(viewState);
        }

        // Get the reference from the store (http://aka.ms/mobx4)
        if (!!isPrint) {
            viewState = getStore().itemPrintPaneViewState;
        } else {
            viewState = getItemReadingPaneViewState(itemId.Id);
        }

        const datapoint = returnTopExecutingActionDatapoint((dp: PerformanceDatapoint) => {
            return dp.eventName == datapoints.RPPerfLoadItemReadingPane.name;
        });

        const cachedItem = getMailStore().items.get(itemId.Id);

        // This datapoint is used to collect the items count in mailstore in SDF
        if (isFeatureEnabled('ring-dogfood') && !isPrint && !isPreviewPane) {
            logUsage('RPMailStoreItemsCount', { count: getMailStore().items.size });
        }

        const shouldReloadItemToGetSmimeInfo = doesItemNeedToBeFetchedAgain(cachedItem);
        const isSmime = isSMIMEItem(cachedItem);

        // User tries to decode a S/MIME mail which was earlier failed
        // setting ErrorState to NoError
        if (isSmime && cachedItem.Smime && !isSmimeDecoded(cachedItem)) {
            cachedItem.Smime.ErrorState = SmimeErrorStateEnum.NoError;
        }

        // When the smime item attachment content is fetched from control, it returns NormalizedBody as null
        // but we still don't make a server call and need to process the smime properties of the item itself
        // Hence, we need the doesMessageHaveSmimePrefix check
        if (
            cachedItem &&
            ((cachedItem.NormalizedBody && !shouldReloadItemToGetSmimeInfo) ||
                doesMessageHaveSmimePrefix(cachedItem))
        ) {
            if (isSmime && !isSmimeDecoded(cachedItem)) {
                const processSmimeItemDatapoint = new PerformanceDatapoint(eventName);
                processSmimeItemDatapoint.addCustomData({
                    wasItemReloaded: false,
                });
                return processSmimeProperties(itemId, false).then(() => {
                    instrumentationContext?.dp?.addCheckpoint?.('LIRP_SMIME');
                    return updateLoadedItemState(
                        viewState,
                        itemId,
                        instrumentationContext,
                        datapoint,
                        isPrint,
                        isPreviewPane
                    );
                });
            } else {
                updateLoadedItemState(
                    viewState,
                    itemId,
                    instrumentationContext,
                    datapoint,
                    isPrint,
                    isPreviewPane
                );
                return Promise.resolve();
            }
        } else {
            /**
             * If the item is an S/MIME message, initialize the S/MIME extension before loading it
             * so that the item can be fetched with correct SMIME_INSTALLED_HEADER_KEY header
             *  */
            return new Promise(resolve => {
                if (isSmime && shouldReloadItemToGetSmimeInfo && !isSmimeAdapterInitialized()) {
                    return lazySmimeAdapter.import().then(resolve);
                }
                return resolve(undefined);
            }).then(() => {
                instrumentationContext?.dp?.addCheckpoint?.('LIRP_THEN');
                return loadAndUpdateItem(
                    viewState,
                    itemId,
                    instrumentationContext,
                    datapoint,
                    isPrint,
                    isPreviewPane,
                    isDiscovery,
                    loadItemOverrideFunction,
                    scenarioName
                );
            });
        }
    }
);
