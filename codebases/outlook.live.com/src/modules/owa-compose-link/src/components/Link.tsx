import { observer } from 'mobx-react-lite';
import { Icon } from '@fluentui/react/lib/Icon';
import { assertNever } from 'owa-assert';
import {
    COMPOSE_ONLY_ATTACHMENT_CLASS_NAME,
    LINK_ENTITY_TYPE,
    OWA_AUTO_LINKS_CLASSNAME,
} from 'owa-attachment-link-common';
import { getPackageBaseUrl } from 'owa-config';
import { DATA_OG_STYLE_COLOR } from 'owa-content-colors-constants';
import { ControlIcons } from 'owa-control-icons';
import type { OperateContentType } from 'owa-editor';
import type EditorViewState from 'owa-editor/lib/store/schema/EditorViewState';
import { callEditorApi } from 'owa-editor/lib/utils/callApi';
import { isFeatureEnabled } from 'owa-feature-flags';
import {
    getAnchorElementId,
    LinkActionStatus,
    RecipientContainer,
    SharingLinkInfo,
    isFluidFile,
    isOneNoteFluidFile,
    oneNoteLinkTooltip,
} from 'owa-link-data';
import loc, { format } from 'owa-localize';
import { ORIGINALSRC_ATTTIBUTE_NAME, SHASH_ATTTIBUTE_NAME } from 'owa-safelinks-evaluator';
import { lazyPreloadIframeSharingDialogUrl } from 'owa-sharing-dialog-iframe';
import * as trace from 'owa-trace';
import type { TraceErrorObject } from 'owa-trace';
import * as React from 'react';
import { insertEntity } from 'roosterjs-editor-api';
import { Position } from 'roosterjs-editor-dom';
import { IEditor, PositionType } from 'roosterjs-editor-types';
import ComposeLinkPreviewMode from '../store/schema/ComposeLinkPreviewMode';
import type ComposeLinkViewState from '../store/schema/ComposeLinkViewState';
import {
    ANCHOR_TAG_NAME_LOWER_CASE,
    ATTRIBUTE_CONTENTEDITABLE_NAME,
    ATTRIBUTE_STYLE_NAME,
    BACKGROUND_COLOR_CONVERTED,
    BACKGROUND_COLOR_CONVERTED_CSS,
    BEAUTIFUL_LINK_COMPOSE_ONLY_ATTRIBUTE_NAME,
    CLICK_EVENT_NAME,
    CONTEXT_MENU_EVENT_NAME,
    SPAN_TAG_NAME,
    STYLE_SEPARATOR,
} from '../utils/constants';
import getLinkPreviewMode from '../utils/getLinkPreviewMode';
import { getHasSharingIssues, SharingIssueInfo } from '../utils/link/getHasSharingIssues';
import { SharingIssueLevel } from '../utils/link/SharingIssueLevel';
import styles from './Link.scss';
import { showLinkContextMenu } from './LinkContextMenu';
import { getIsDarkTheme } from 'owa-fabric-theme';
import { getClickableLinkTooltip } from 'owa-editor/lib/utils/getClickableLinkTooltip';
import { DirectionalHint } from '@fluentui/react/lib/Callout';
import { TooltipHost } from '@fluentui/react/lib/Tooltip';
import classnamesBind from 'classnames/bind';

const classNames = classnamesBind.bind(styles);

interface SharingLinkProps {
    viewState: ComposeLinkViewState;
    getRecipientWells: () => RecipientContainer[];
    fromAddress: string;
    sharingLink: SharingLinkInfo;
    fileIcon: string;
    hasValidFileName: boolean;
    editor: IEditor | undefined;
    composeEditorViewState: EditorViewState | undefined;
    operateContent: OperateContentType;
    originalElement: HTMLElement;
    composeId: string;
    isLinkPreviouslyBeautified: boolean;
    shouldBeautify: boolean;
    // containerDiv is added as part of the new flow to create fluid components
    // without using an editor but an HTMLDivElement. We need to beautify the
    // fluid link which would be present in the containerDiv.
    containerDiv?: HTMLDivElement;
    reactContainer: HTMLElement;
    linksContainerId: string; // Is used only in composeScenario
}
export const Link = observer(function Link(props: SharingLinkProps) {
    // VSO 105488 - figure out a better solution for beautiful link icons for fluid files.
    // We shouldn't have special treatment for them. in this file
    const isFluidHeaderLink = isFluidFile(props.sharingLink.fileName);

    React.useEffect((): React.EffectCallback | void => {
        copyStyleFromOriginalAnchor();
        // Make beautiful link readonly & handle the click event
        if (props.viewState.isLinkBeautified) {
            link.current.setAttribute(ATTRIBUTE_CONTENTEDITABLE_NAME, 'false');
        }

        // Set this attribute to control some compose only CSS
        link.current.setAttribute(BEAUTIFUL_LINK_COMPOSE_ONLY_ATTRIBUTE_NAME, '');

        // For dark mode link with sharing issues, the inline css will be removed during mail send after we set this attribute
        link.current.setAttribute(DATA_OG_STYLE_COLOR, '');

        link.current.addEventListener(CLICK_EVENT_NAME, onClickOrContextMenu);
        link.current.addEventListener(CONTEXT_MENU_EVENT_NAME, onClickOrContextMenu);

        preloadIframeSharingDialogUrl(link.current.ownerDocument.defaultView);
        if (props.containerDiv) {
            const replaceTarget = document.getElementById(props.originalElement.id);
            if (replaceTarget) {
                replaceTarget.textContent = '';
                replaceTarget.appendChild(link.current);
            }
        } else if (props.composeEditorViewState) {
            props.operateContent(props.composeEditorViewState, (editor, range, domUtils) => {
                const replaceTargets: HTMLElement[] = editor.queryElements(
                    '#' + props.originalElement.id
                );
                let shouldResetSelection: boolean = false;
                if (replaceTargets && replaceTargets.length === 1) {
                    trace.trace.info('operateContent replacing node with beautiful link');

                    // We need to replace the child only so we keep any text typed under the parent element before the new anchor
                    editor.replaceNode(replaceTargets[0], props.reactContainer);

                    // When it's a newly pasted link, guarantee the cursor is after the pasted link. If opening a draft, do not set the cursor location.
                    const selectionRange = editor.getSelectionRange();
                    if (
                        editor.hasFocus() &&
                        selectionRange &&
                        selectionRange.startContainer === selectionRange.endContainer &&
                        selectionRange.startContainer === props.reactContainer.parentNode
                    ) {
                        shouldResetSelection = true;
                    }

                    if (props.shouldBeautify) {
                        insertEntity(
                            editor,
                            LINK_ENTITY_TYPE,
                            props.reactContainer,
                            false /*isBlock*/,
                            true /* isReadOnly */,
                            new Position(props.reactContainer, PositionType.End)
                        );
                    }
                } else if (replaceTargets && replaceTargets.length >= 1) {
                    const error: TraceErrorObject = new Error('BeautifulLinkWithMoreThanOne');
                    error.diagnosticInfo = props.originalElement.id;
                    trace.errorThatWillCauseAlert(error);
                } else {
                    const error: TraceErrorObject = new Error('BeautifulLinkWithNoTarget');
                    error.diagnosticInfo = props.originalElement.id;
                    trace.errorThatWillCauseAlert(error);
                }

                return shouldResetSelection
                    ? domUtils.createRange(props.reactContainer.parentNode, PositionType.After)
                    : null;
            });
        }
        return () => {
            if (link.current) {
                link.current.removeEventListener(CLICK_EVENT_NAME, onClickOrContextMenu);
                link.current.removeEventListener(CONTEXT_MENU_EVENT_NAME, onClickOrContextMenu);
            }
        };
    }, []);
    const link = React.useRef<HTMLAnchorElement>();
    const linkPreviewMode = React.useRef<ComposeLinkPreviewMode>();
    const copyStyleFromOriginalAnchor = () => {
        if (
            !props.originalElement ||
            props.originalElement.tagName.toLowerCase() !== ANCHOR_TAG_NAME_LOWER_CASE
        ) {
            // We don't want to copy the style from the link placeholder.
            return;
        }

        // Pass the style from old link to new link.
        let style: string = getFilteredStyleFromOriginalElement(props.originalElement);
        style += link.current.getAttribute(ATTRIBUTE_STYLE_NAME);

        // If the original anchor is a beautiful link, we need to check whether it has a span defining the font-size.
        if (props.isLinkPreviouslyBeautified) {
            const spanElement = props.originalElement.querySelector(SPAN_TAG_NAME);
            if (spanElement) {
                const spanStyle = spanElement.getAttribute(ATTRIBUTE_STYLE_NAME);
                if (spanStyle) {
                    if (spanStyle.lastIndexOf('width:') >= 0) {
                        trace.errorThatWillCauseAlert(`Ignore dangerous Span style ${spanStyle}`);
                    } else {
                        style += spanStyle;
                    }
                }
            }
        }
        link.current.setAttribute(ATTRIBUTE_STYLE_NAME, style);

        setSafeLinkAttributes(props.originalElement, link.current);
    };
    const renderEditIcon = () => {
        // VSO 94115: Find the root cause of this icon appearing for fluid when not editing the file
        if (
            props.viewState.isLinkBeautified &&
            isFeatureEnabled('doc-SxS-jsApi-ODB-Links') &&
            linkPreviewMode.current === ComposeLinkPreviewMode.Edit
        ) {
            return (
                <React.Fragment>
                    <span className={COMPOSE_ONLY_ATTACHMENT_CLASS_NAME}>
                        <Icon className={styles.editLinkIcon} iconName={ControlIcons.Edit} />
                    </span>
                </React.Fragment>
            );
        } else {
            return null;
        }
    };
    // Error Icon is only shown in beautiful link
    // In non-beautiful link, we just change the color of link when it has sharing issue.
    const renderErrorIcon = (sharingIssueLevel: SharingIssueLevel) => {
        if (props.viewState.isLinkBeautified) {
            return (
                <React.Fragment>
                    <span className={COMPOSE_ONLY_ATTACHMENT_CLASS_NAME}>
                        <img
                            alt=""
                            role="presentation"
                            src={getErrorIcon(sharingIssueLevel)}
                            hidden={sharingIssueLevel === SharingIssueLevel.None}
                            style={getErrorIconStyle()}
                        />
                    </span>
                </React.Fragment>
            );
        } else {
            return null;
        }
    };
    const getAnchorStyle = (sharingIssueLevel: SharingIssueLevel): React.CSSProperties => {
        let isDarkMode: boolean = getIsDarkMode(props.composeEditorViewState, props.containerDiv);

        let style: React.CSSProperties = {};
        if (props.viewState.isLinkBeautified) {
            // Highlighted Background
            style = {
                padding: '0 1px',
                borderRadius: '2px',
                userSelect: 'all',
            };

            if (!isFluidHeaderLink) {
                style = {
                    ...style,
                    backgroundColor: 'rgb(244,244,244)',
                };
            }
        }
        if (sharingIssueLevel === SharingIssueLevel.Error && isDarkMode) {
            style = {
                ...style,
                color: styles.linkErrorColor,
            };
        }
        return style;
    };
    const getAnchorTextColor = (sharingIssueLevel: SharingIssueLevel): string | undefined => {
        let isDarkMode: boolean = getIsDarkMode(props.composeEditorViewState, props.containerDiv);
        if (props.containerDiv && isDarkMode) {
            return styles.containerDivDarkMode;
        }
        if (sharingIssueLevel === SharingIssueLevel.Error && !isDarkMode) {
            return styles.linkWithSharingIssueAttribute;
        }
        return undefined;
    };
    /*
    We have to use inline CSS style: background-color for it to work in different clients such as gmail.
    Since inline CSS style has higher preference than class, we can't use :hover as it would be just ignored.
    So we have to hook to these two events to change the hover background color.
    */
    const onMouseOver = () => {
        if (link.current && props.viewState.isLinkBeautified && !isFluidHeaderLink) {
            link.current.style.backgroundColor = 'rgb(237,235,233)';
        }
    };
    const onMouseLeave = () => {
        if (link.current && props.viewState.isLinkBeautified && !isFluidHeaderLink) {
            link.current.style.backgroundColor = 'rgb(243,242,241)';
        }
    };

    let sharingIssueInfo: SharingIssueInfo = null;
    let sharingIssueLevel: SharingIssueLevel = SharingIssueLevel.None;
    if (props.viewState) {
        sharingIssueInfo = getHasSharingIssues(
            props.viewState.linkId,
            props.getRecipientWells,
            props.fromAddress
        );
        sharingIssueLevel = sharingIssueInfo.sharingIssueLevel;
    }

    const onClickOrContextMenu = (event: MouseEvent) => {
        if (props.editor) {
            showLinkContextMenu(
                link.current,
                props.composeEditorViewState,
                props.operateContent,
                props.composeId,
                props.getRecipientWells(),
                props.fromAddress,
                props.linksContainerId
            );
            event.preventDefault();
        }
    };

    if (isFeatureEnabled('doc-SxS-jsApi-ODB-Links')) {
        linkPreviewMode.current = getLinkPreviewMode(props.sharingLink.linkId);
    } else {
        linkPreviewMode.current = ComposeLinkPreviewMode.None;
    }
    const conditionalStyles = {
        attachingAsACopy:
            props.sharingLink.linkActionStatus === LinkActionStatus.attachingAsACopy ||
            props.sharingLink.linkActionStatus === LinkActionStatus.pendingAttachAsACopy,
        link: props.viewState.isLinkBeautified,
    };
    conditionalStyles[getComposeLinkStyle(linkPreviewMode.current)] = true;

    // VSO 84086 - remove the isIconHidden property from the link.
    // We hide the icon if it is a fluid link, and the componentUX flight is on.
    const showFileIcon =
        props.viewState.isLinkBeautified && props.hasValidFileName && !isFluidHeaderLink;

    const href = props.sharingLink.url;
    const linkId = getAnchorElementId(props.sharingLink.linkId, props.sharingLink.permissionLevel);

    const containerDivLinkTooltip = generateContainerDivLinkToolTip(
        props.containerDiv,
        href,
        props.sharingLink.fileName,
        sharingIssueInfo
    );

    const displayName = containerDivLinkTooltip ? (
        <TooltipHost
            content={containerDivLinkTooltip}
            id={`containerDivLinkTooltipId-${linkId}`}
            directionalHint={DirectionalHint.topCenter}>
            {props.viewState.displayName}
        </TooltipHost>
    ) : (
        props.viewState.displayName
    );

    return (
        <a
            ref={ref => (link.current = ref)}
            href={href}
            target={props.containerDiv ? '_blank' : undefined}
            onMouseOver={onMouseOver}
            onMouseLeave={onMouseLeave}
            style={getAnchorStyle(sharingIssueLevel)}
            id={linkId}
            className={classNames(
                OWA_AUTO_LINKS_CLASSNAME,
                getAnchorTextColor(sharingIssueLevel),
                conditionalStyles
            )}>
            {renderEditIcon()}
            {showFileIcon && (
                <img src={props.fileIcon} style={getFileIconStyle()} alt="" role="presentation" />
            )}
            {displayName}
            {renderErrorIcon(sharingIssueLevel)}
        </a>
    );
});

function generateContainerDivLinkToolTip(
    containerDiv: HTMLDivElement,
    href: string,
    fileName: string,
    sharingIssueInfo: SharingIssueInfo
) {
    if (!(containerDiv && href)) {
        return undefined;
    }

    if (sharingIssueInfo?.sharingIssues?.length > 0) {
        return sharingIssueInfo.sharingIssues[0].sharingTipString;
    }

    const containerDivLinkTooltip = isOneNoteFluidFile(fileName)
        ? loc(oneNoteLinkTooltip)
        : getClickableLinkTooltip(href);

    return containerDivLinkTooltip;
}

function getFileIconStyle() {
    return {
        width: '16px',
        height: '16px',
        verticalAlign: 'middle',
        padding: '1px 2px 2px 0',
    };
}

function getErrorIconStyle() {
    return {
        width: '12px',
        height: '12px',
        verticalAlign: 'top',
    };
}

function getErrorIcon(shairngIssueLevel: SharingIssueLevel) {
    if (shairngIssueLevel === SharingIssueLevel.Error) {
        return format('{0}{1}', getPackageBaseUrl(), 'resources/images/redinfo_24.png');
    } else if (shairngIssueLevel === SharingIssueLevel.Warning) {
        return format('{0}{1}', getPackageBaseUrl(), 'resources/images/greyinfo_24.png');
    }
    return '';
}

function getComposeLinkStyle(composeLinkPreviewMode: ComposeLinkPreviewMode): string {
    switch (composeLinkPreviewMode) {
        case ComposeLinkPreviewMode.Edit:
            return 'edit';
        case ComposeLinkPreviewMode.Selected:
            return 'selected';
        case ComposeLinkPreviewMode.None:
            return 'none';
        default:
            return assertNever(composeLinkPreviewMode);
    }
}

/* Light mode to dark mode conversion code will change "backgounrd-color: (244, 244, 244)" into "background-color: rgb(58, 58, 58) !important"
   We do not want this change and revert it during rehydration.
*/
function getFilteredStyleFromOriginalElement(originalElement: HTMLElement): string {
    let style: string = originalElement.getAttribute(ATTRIBUTE_STYLE_NAME);
    if (originalElement.style.backgroundColor === BACKGROUND_COLOR_CONVERTED) {
        style = style.replace(BACKGROUND_COLOR_CONVERTED_CSS, '');
    }

    if (style && style.length > 0 && style.lastIndexOf(STYLE_SEPARATOR) !== style.length - 1) {
        style += STYLE_SEPARATOR;
    }

    return style;
}

function getIsDarkMode(editorViewState: EditorViewState, containerDiv?: HTMLDivElement) {
    if (containerDiv) {
        return getIsDarkTheme();
    }
    // callEditorApi will return undefined if editor is not mounted. In that case we treat it as light mode.
    return (editorViewState && callEditorApi(editorViewState, 'isDarkMode')) || false;
}

function setSafeLinkAttributes(originalLink: HTMLElement, newLink: HTMLAnchorElement) {
    const originalSrc: string = originalLink.getAttribute(ORIGINALSRC_ATTTIBUTE_NAME);
    if (originalSrc && originalSrc.length > 0) {
        newLink.setAttribute(ORIGINALSRC_ATTTIBUTE_NAME, originalSrc);
    }

    const shash: string = originalLink.getAttribute(SHASH_ATTTIBUTE_NAME);
    if (shash && shash.length > 0) {
        newLink.setAttribute(SHASH_ATTTIBUTE_NAME, shash);
    }
}

async function preloadIframeSharingDialogUrl(targetWindow: Window) {
    const preloadIframeSharingDialogUrl = await lazyPreloadIframeSharingDialogUrl.import();
    preloadIframeSharingDialogUrl(targetWindow);
}
