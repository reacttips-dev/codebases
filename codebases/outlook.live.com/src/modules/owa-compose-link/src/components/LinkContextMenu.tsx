import {
    ContextualMenu,
    DirectionalHint,
    IContextualMenuItem,
} from '@fluentui/react/lib/ContextualMenu';
import { useWindow, WindowProvider } from '@fluentui/react/lib/WindowProvider';
import classnamesBind from 'classnames/bind';
import { observer } from 'mobx-react-lite';
import { logUsage } from 'owa-analytics';
import { assertNever } from 'owa-assert';
import { getOpenInNewTabContextMenuItem } from 'owa-attachment-link-common';
import type { OperateContentType } from 'owa-editor';
import type EditorViewState from 'owa-editor/lib/store/schema/EditorViewState';
import {
    getLinkIdFromAnchorElementId,
    getSharingDataFromLink,
    getSharingLinkInfo,
    lazyGetSharingTipRecipientInfo,
    LinkActionStatus,
    RecipientContainer,
    recipientContainerIsRecipientWell,
} from 'owa-link-data';
import { lazyGetSharingIssuesForSharingData, SharingTipRecipientInfo } from 'owa-sharing-data';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { IEditor, PositionType } from 'roosterjs-editor-types';
import { resetIsContextMenuOpenForLinks, setIsContextMenuOpen } from '../actions/internalActions';
import getComposeLinkViewState from '../selectors/getComposeLinkViewState';
import type ComposeLinkViewState from '../store/schema/ComposeLinkViewState';
import { LINK_CONTEXT_MENU } from '../utils/constants';
import { getAttachACopyContextMenuItem } from '../utils/contextMenu/getAttachACopyContextMenuItem';
import { getChangePermissionContextMenuItem } from '../utils/contextMenu/getChangePermissionContextMenuItem';
import { getChangePermissionSharingDialogContextMenuItem } from '../utils/contextMenu/getChangePermissionSharingDialogContextMenuItem';
import { getCopyLinkContextMenuItem } from '../utils/contextMenu/getCopyLinkContextMenuItem';
import { getDividerForContextMenu } from '../utils/contextMenu/getDividerForContextMenu';
import { getEditLinkContextMenuItem } from '../utils/contextMenu/getEditLinkContextMenuItem';
import { getLinkPreviewContextMenuItem } from '../utils/contextMenu/getLinkPreviewContextMenuItem';
import { getRevertToFullUrlContextMenuItem } from '../utils/contextMenu/getRevertToFullUrlContextMenuItem';
import { getSharingTipContextMenuItems } from '../utils/contextMenu/getSharingTipContextMenuItems';
import getLinkContextMenuOptions, {
    LinkContextMenuOptions,
} from '../utils/contextMenu/LinkContextMenuOptions';
import styles from './LinkContextMenu.scss';

const classNames = classnamesBind.bind(styles);

interface LinkContextMenuProps {
    composeLinkViewState: ComposeLinkViewState;
    anchorElement: HTMLAnchorElement;
    composeEditorViewState: EditorViewState;
    operateContent: OperateContentType;
    composeId: string;
    recipientInfo: SharingTipRecipientInfo[];
    isCalendar: boolean;
    linksContainerId: string;
}

export const LinkContextMenu = observer(function LinkContextMenu(props: LinkContextMenuProps) {
    const targetWindow = useWindow();
    // When the context menu is shown & user uses Ctrl+Z to undo beautification,
    // the sharingLink associated with the linkId would be removed as the old linkId is considered as being removed.
    const sharingLinkInfo = getSharingLinkInfo(props.composeLinkViewState.linkId);
    // We do not show the context menu while attaching as a copy is in progress
    if (
        !sharingLinkInfo ||
        sharingLinkInfo.linkActionStatus === LinkActionStatus.attachingAsACopy ||
        sharingLinkInfo.linkActionStatus === LinkActionStatus.pendingAttachAsACopy
    ) {
        return null;
    }

    const [items, hasIcon] = getContextMenuItemsAndHasIcon(
        props.composeLinkViewState,
        props.anchorElement,
        props.composeEditorViewState,
        props.operateContent,
        props.composeId,
        props.recipientInfo,
        props.isCalendar,
        targetWindow,
        props.linksContainerId
    );
    // If the sharing dialog flight is on, the permission menu item will always have an icon
    const conditionalStyles = {
        conditionalPadding: hasIcon,
    };
    return (
        <ContextualMenu
            className={classNames(conditionalStyles)}
            target={props.anchorElement}
            shouldFocusOnMount={true}
            onDismiss={onDismissContextMenu}
            items={items}
            directionalHint={DirectionalHint.bottomLeftEdge}
            gapSpace={2}
        />
    );
});

let contextMenuContainer: HTMLSpanElement = null;
export async function showLinkContextMenu(
    anchorElement: HTMLAnchorElement,
    composeEditorViewState: EditorViewState,
    operateContent: OperateContentType,
    composeId: string,
    recipientContainers: RecipientContainer[],
    fromAddress: string,
    linksContainerId: string
) {
    closeLinkContextMenu();

    const getSharingTipRecipientInfo = lazyGetSharingTipRecipientInfo.tryImportForRender();
    let recipientInfo: SharingTipRecipientInfo[] = [];
    if (getSharingTipRecipientInfo) {
        recipientInfo = getSharingTipRecipientInfo(recipientContainers, fromAddress);
    }
    const isCalendar = !recipientContainers.some(well => recipientContainerIsRecipientWell(well));

    const targetWindow = anchorElement.ownerDocument.defaultView;
    contextMenuContainer = targetWindow.document.createElement('span');
    contextMenuContainer.id = 'sharingLinkContextMenu';
    anchorElement.appendChild(contextMenuContainer);

    const linkId: string = getLinkIdFromAnchorElementId(anchorElement.id);

    ReactDOM.render(
        <React.StrictMode>
            <WindowProvider window={targetWindow || window}>
                <LinkContextMenu
                    composeLinkViewState={getComposeLinkViewState(linkId)}
                    anchorElement={anchorElement}
                    composeEditorViewState={composeEditorViewState}
                    operateContent={operateContent}
                    composeId={composeId}
                    recipientInfo={recipientInfo}
                    isCalendar={isCalendar}
                    linksContainerId={linksContainerId}
                />
            </WindowProvider>
        </React.StrictMode>,
        contextMenuContainer
    );

    setIsContextMenuOpen(linkId, true);

    // Note - we compute hasSharingIssues again for logging even though it is computed in the context menu because
    // we want getContextMenuItemsAndHasIcon to be in render, so that the menu will update when preview becomes available
    // or a sharingIssue is detected. We could locally store hasSharingIssue, but there is a risk of it being
    // out of sync.
    const getSharingIssuesForSharingData = await lazyGetSharingIssuesForSharingData.import();
    const sharingData = getSharingDataFromLink(linkId);
    const hasSharingIssues: boolean =
        getSharingIssuesForSharingData(sharingData, recipientInfo).length > 0;
    logUsage('LinkContextMenuOpened', { hasSharingIssue: hasSharingIssues, linkId: linkId });
}

function getContextMenuItemsAndHasIcon(
    composeLinkViewState: ComposeLinkViewState,
    anchorElement: HTMLAnchorElement,
    composeEditorViewState: EditorViewState,
    operateContent: OperateContentType,
    composeId: string,
    recipientInfo: SharingTipRecipientInfo[],
    isCalendar: boolean,
    targetWindow: Window,
    linksContainerId: string
): [IContextualMenuItem[], boolean] {
    let hasSharingTip: boolean = false;
    let hasChangePermissionIcon: boolean = false;

    const contextMenuItems: IContextualMenuItem[] = [];
    const contextMenuOptions = getLinkContextMenuOptions();

    const replaceLinkHandler: ReplaceLinkHandler = (url: string, displayText: string) => {
        operateContent(composeEditorViewState, editor => {
            editor.addUndoSnapshot(() => updateLink(editor, anchorElement, url, displayText));
            return null;
        });
    };

    contextMenuOptions.forEach(contextMenu => {
        switch (contextMenu) {
            case LinkContextMenuOptions.SharingTip:
                const sharingTipContextMenuItems = getSharingTipContextMenuItems(
                    composeLinkViewState,
                    recipientInfo,
                    composeId,
                    isCalendar
                );
                if (sharingTipContextMenuItems && sharingTipContextMenuItems.length > 0) {
                    hasSharingTip = true;
                    sharingTipContextMenuItems.forEach((item, index) => {
                        contextMenuItems.push(item);
                        contextMenuItems.push(getDividerForContextMenu(`divider_sharing ${index}`));
                    });
                }
                break;
            case LinkContextMenuOptions.OpenInNewTab:
                const OpenInNewTabMenuItem = getOpenInNewTabContextMenuItem(
                    getSharingLinkInfo(composeLinkViewState.linkId).url,
                    targetWindow,
                    () => {
                        closeLinkContextMenu();
                        logUsage(
                            'OpenInNewTab',
                            {
                                entryPoint: 'BeautifulLinkContextMenu',
                            },
                            {
                                isCore: true,
                            }
                        );
                    }
                );
                if (OpenInNewTabMenuItem) {
                    contextMenuItems.push(OpenInNewTabMenuItem);
                }
                break;
            case LinkContextMenuOptions.AttachACopy:
                const AttachACopyMenuItem = getAttachACopyContextMenuItem(
                    composeLinkViewState.linkId,
                    targetWindow
                );
                if (AttachACopyMenuItem) {
                    contextMenuItems.push(AttachACopyMenuItem);
                }
                break;
            case LinkContextMenuOptions.ChangePermission:
                const ChangePermissionSharingDialogMenuItem = getChangePermissionSharingDialogContextMenuItem(
                    composeLinkViewState.linkId,
                    composeId,
                    recipientInfo,
                    targetWindow,
                    isCalendar
                );
                if (ChangePermissionSharingDialogMenuItem) {
                    contextMenuItems.push(ChangePermissionSharingDialogMenuItem);
                    contextMenuItems.push(getDividerForContextMenu('divider_perms'));
                    hasChangePermissionIcon = true;
                } else {
                    // We only show the normal change permission menu item if the sharing dialog isn't available
                    const ChangePermissionMenuItem = getChangePermissionContextMenuItem(
                        composeLinkViewState,
                        composeId,
                        recipientInfo,
                        isCalendar
                    );
                    if (ChangePermissionMenuItem) {
                        contextMenuItems.push(ChangePermissionMenuItem);
                        contextMenuItems.push(getDividerForContextMenu('divider_perms'));
                    }
                }
                break;
            case LinkContextMenuOptions.EditLink:
                const EditLinkContextMenuItem = getEditLinkContextMenuItem(
                    composeLinkViewState,
                    anchorElement,
                    replaceLinkHandler,
                    targetWindow
                );
                if (EditLinkContextMenuItem) {
                    contextMenuItems.push(EditLinkContextMenuItem);
                }

                break;
            case LinkContextMenuOptions.RevertToFullUrl:
                const RevertToFullUrlContextMenuItem = getRevertToFullUrlContextMenuItem(
                    composeLinkViewState,
                    anchorElement,
                    replaceLinkHandler
                );
                if (RevertToFullUrlContextMenuItem) {
                    contextMenuItems.push(RevertToFullUrlContextMenuItem);
                }

                break;
            case LinkContextMenuOptions.Preview:
                const linkPreviewContextMenuItem: IContextualMenuItem | null = getLinkPreviewContextMenuItem(
                    isCalendar,
                    composeLinkViewState.linkId,
                    targetWindow,
                    composeLinkViewState.isLinkBeautified,
                    linksContainerId
                );

                if (linkPreviewContextMenuItem) {
                    contextMenuItems.push(linkPreviewContextMenuItem);
                }
                break;
            case LinkContextMenuOptions.CopyLinkToClipboard:
                const CopyLinkContextMenuItem = getCopyLinkContextMenuItem(
                    anchorElement,
                    targetWindow
                );
                if (CopyLinkContextMenuItem) {
                    contextMenuItems.push(CopyLinkContextMenuItem);
                }
                break;
            default:
                assertNever(contextMenu);
        }
    });

    return [contextMenuItems, hasSharingTip || hasChangePermissionIcon];
}

export function closeLinkContextMenu() {
    if (contextMenuContainer) {
        ReactDOM.unmountComponentAtNode(contextMenuContainer);
        if (contextMenuContainer.parentNode) {
            contextMenuContainer.parentNode.removeChild(contextMenuContainer);
        }
        contextMenuContainer = null;
    }

    resetIsContextMenuOpenForLinks();
}

function updateLink(
    editor: IEditor,
    anchorElement: HTMLAnchorElement,
    url: string,
    displayText: string
) {
    // Remove the anchor element & insert a new anchor element
    ReactDOM.unmountComponentAtNode(anchorElement);
    const newAnchor: HTMLAnchorElement = document.createElement('a');
    newAnchor.href = url;
    newAnchor.innerText = displayText;
    editor.replaceNode(anchorElement, newAnchor);
    editor.select(newAnchor, PositionType.After);
    editor.triggerContentChangedEvent(LINK_CONTEXT_MENU);
}

export type ReplaceLinkHandler = (url: string, displayText: string) => void;

function onDismissContextMenu(ev: any) {
    closeLinkContextMenu();
}
