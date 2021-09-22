import { lazyOperateContent, OperateContentType } from 'owa-editor';
import type EditorViewState from 'owa-editor/lib/store/schema/EditorViewState';
import type { RecipientContainer, SharingLinkInfo } from 'owa-link-data';
import { trace } from 'owa-trace';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import type { IEditor } from 'roosterjs-editor-types';
import { updateComposeLinkViewState } from '../actions/internalActions';
import getComposeLinkViewState from '../selectors/getComposeLinkViewState';
import getText from '../utils/getText';
import { getDisplayName } from '../utils/link/getDisplayName';
import { getFileIcon } from '../utils/link/getFileIcon';
import { Link } from './Link';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';
import ProjectionContext from 'owa-popout-v2/lib/context/ProjectionContext';

export async function createSharingLinkView(
    editor: IEditor | undefined,
    composeEditorViewState: EditorViewState | undefined,
    getRecipientWells: () => RecipientContainer[],
    fromAddress: string,
    composeId: string,
    originalElement: HTMLElement,
    sharingLinkInfo: SharingLinkInfo,
    sharingLinkInfoHasValidFileName: boolean,
    shouldBeautify: boolean,
    isLinkPreviouslyBeautified: boolean,
    targetWindow: Window,
    linksContainerId: string,
    containerDiv?: HTMLDivElement
) {
    trace.info(
        `createSharingLinkView for id=${originalElement.id} isLinkPreviouslyBeautified=${isLinkPreviouslyBeautified}`
    );

    const shouldShowBeautifiedLink = shouldBeautify || isLinkPreviouslyBeautified;
    const hasValidFileName = sharingLinkInfoHasValidFileName || isLinkPreviouslyBeautified; // Previous beautified link has the file name as the inner text

    // to get the file icon, use the original name that came from the response, as the text filename could have been modified for display
    const fileIcon = getFileIcon(
        isLinkPreviouslyBeautified ? getText(originalElement) : sharingLinkInfo.fileName,
        shouldShowBeautifiedLink,
        sharingLinkInfo.mimeType
    );

    const document = (targetWindow || window).document;
    const anchorContainer = document.createElement('span');
    document.body.appendChild(anchorContainer);
    const displayName = getDisplayName(
        originalElement,
        sharingLinkInfo,
        hasValidFileName,
        shouldBeautify,
        isLinkPreviouslyBeautified
    );

    updateComposeLinkViewState(sharingLinkInfo.linkId, displayName, shouldShowBeautifiedLink);
    const operateContent: OperateContentType = await lazyOperateContent.import();

    ReactDOM.render(
        <React.StrictMode>
            <WindowProvider window={targetWindow || window}>
                <ProjectionContext.Provider value={targetWindow || window}>
                    <Link
                        viewState={getComposeLinkViewState(sharingLinkInfo.linkId)}
                        getRecipientWells={getRecipientWells}
                        fromAddress={fromAddress}
                        sharingLink={sharingLinkInfo}
                        fileIcon={fileIcon}
                        hasValidFileName={hasValidFileName}
                        editor={editor}
                        composeEditorViewState={composeEditorViewState}
                        originalElement={originalElement}
                        composeId={composeId}
                        isLinkPreviouslyBeautified={isLinkPreviouslyBeautified}
                        shouldBeautify={shouldBeautify}
                        operateContent={operateContent}
                        containerDiv={containerDiv}
                        reactContainer={anchorContainer}
                        linksContainerId={linksContainerId}
                    />
                </ProjectionContext.Provider>
            </WindowProvider>
        </React.StrictMode>,
        anchorContainer
    );
}
