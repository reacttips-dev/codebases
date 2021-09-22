import { FolderForestNodeType } from 'owa-favorites-types';
import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyGetSxSStoreViewState } from 'owa-group-files-hub-store/lib/lazyFunctions';
import { lazyGetSharePointItemsViewCurrentPath } from 'owa-group-fileshub-actions';
import { composeStore } from 'owa-mail-compose-store';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import { shouldShowReadingPane } from 'owa-mail-layout';
import getSelectedFolder from 'owa-mail-store/lib/utils/getSelectedFolder';
import { getCurrentOptionRoute } from 'owa-options-router';
import { isConsumer } from 'owa-session-store';
import folderIdToName from 'owa-session-store/lib/utils/folderIdToName';
import { getOrCreateSxSStoreData, getActiveSxSId } from 'owa-sxs-store';
import { PreviewPaneMode } from 'owa-sxsdata';
import {
    lazyGroupHeaderCommandBarStore,
    lazyGroupHeaderNavigationButton,
} from 'owa-group-header-actions';
import {
    getConversationReadingPaneViewState,
    getItemReadingPaneViewState,
} from 'owa-mail-reading-pane-store';

export function getCurrentRoute() {
    const route: string[] = [];

    const optionRoute = getCurrentOptionRoute();

    if (optionRoute.length) {
        route.push(...optionRoute);
        return route;
    }

    if (composeStore.primaryComposeId) {
        route.push('compose');
        const composeViewState = composeStore.viewStates.get(composeStore.primaryComposeId);

        if (composeViewState.itemId?.Id) {
            route.push(composeViewState.itemId.Id);
        }

        return route;
    }

    const selectedNode = getSelectedNode();
    const sxsId: string = getActiveSxSId(window);
    const sxsStore = getOrCreateSxSStoreData(sxsId);

    if (selectedNode.type === FolderForestNodeType.Persona) {
        if (selectedNode.id) {
            route.push('persons');
            route.push(selectedNode.id);
            return route;
        }
    } else if (
        selectedNode.type === FolderForestNodeType.PrivateDistributionList &&
        isFeatureEnabled('peo-favoritePdls')
    ) {
        if (selectedNode.id) {
            route.push('contactlists');
            route.push(selectedNode.id);
            return route;
        }
    } else if (selectedNode.type === FolderForestNodeType.Category) {
        if (selectedNode.id) {
            route.push('category');
            route.push(selectedNode.id);
            return route;
        }
    } else if (selectedNode.type === FolderForestNodeType.Group) {
        if (selectedNode.id) {
            const emailAddressParts = selectedNode.id.split('@');
            if (emailAddressParts.length != 2) {
                return route;
            }

            route.push('group');
            route.push(emailAddressParts[1]); // Domain part
            route.push(emailAddressParts[0]); // alias part

            const groupHeaderCommandBarStore = lazyGroupHeaderCommandBarStore.tryImportForRender();
            const groupHeaderNavigationButton = lazyGroupHeaderNavigationButton.tryImportForRender();

            if (groupHeaderCommandBarStore && groupHeaderNavigationButton) {
                switch (groupHeaderCommandBarStore.navigationButtonSelected) {
                    case groupHeaderNavigationButton.Email:
                        route.push('email');
                        break;
                    case groupHeaderNavigationButton.Files:
                        route.push('files');
                        const getGroupSxSStoreViewState = lazyGetSxSStoreViewState.tryImportForRender();

                        // SP file preview
                        if (getGroupSxSStoreViewState) {
                            const groupSxSStoreViewState = getGroupSxSStoreViewState();
                            if (
                                groupSxSStoreViewState?.previewPane &&
                                groupSxSStoreViewState.previewPane.mode != PreviewPaneMode.Blank
                            ) {
                                // Preview a SharePoint file using the new SxS
                                route.push('sxs');
                                route.push('sp');
                                route.push(groupSxSStoreViewState.previewPane.id);
                                break;
                            }
                        }

                        // attachment preview
                        if (sxsStore.extendedViewState.attachmentId && !isConsumer()) {
                            // The sxsStore.extendedViewState will never be null
                            route.push('sxs');
                            route.push('attachment');
                            route.push(sxsStore.extendedViewState.attachmentId.Id);
                            break;
                        }

                        // Items view navigation
                        const getSharePointItemsViewCurrentPath = lazyGetSharePointItemsViewCurrentPath.tryImportForRender();
                        if (getSharePointItemsViewCurrentPath) {
                            let path = getSharePointItemsViewCurrentPath(selectedNode.id);
                            if (path && path.length > 0) {
                                if (path.charAt(0) == '/') {
                                    path = path.substring(1);
                                }
                                const parts = path.split('/');
                                for (const p of parts) {
                                    route.push(p);
                                }
                            }
                        }

                        return route;
                }
            }
        }
    } else if (selectedNode.type === FolderForestNodeType.Search) {
        route.push('search');
    } else if (selectedNode.type === FolderForestNodeType.Folder) {
        const selectedFolder = getSelectedFolder();

        if (selectedFolder) {
            // We push a friendly name if it is a distinguished folder (ex: inbox, junkemail, etc.),
            // otherwise we push its folder id.
            const selectedFolderId = selectedFolder.FolderId.Id;

            route.push(
                selectedFolder.DistinguishedFolderId
                    ? folderIdToName(selectedFolderId)
                    : selectedFolderId
            );
        }
    }

    if (shouldShowReadingPane()) {
        const itemReadingPaneViewState = getItemReadingPaneViewState();
        const conversationReadingPaneViewState = getConversationReadingPaneViewState();
        if (conversationReadingPaneViewState) {
            route.push('id');
            route.push(conversationReadingPaneViewState.conversationId.Id);
        } else if (itemReadingPaneViewState) {
            route.push('id');
            route.push(itemReadingPaneViewState.itemId);
        }
    }

    if (sxsStore.extendedViewState.attachmentId) {
        route.push('sxs');
        route.push(sxsStore.extendedViewState.attachmentId.Id);
    }

    return route;
}
