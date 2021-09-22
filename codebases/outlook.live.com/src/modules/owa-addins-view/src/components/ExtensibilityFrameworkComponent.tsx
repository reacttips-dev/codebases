import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ContextualCallout from './ContextualCallout';
import IFrameableDialog from './IFrameableDialog';
import TaskPaneCollection from './TaskPaneCollection';
import UILessAddinCommandsComponent from './UILessAddinCommandsComponent';
import { updateFrameworkComponentHostItemIndexMap } from 'owa-addins-store';
import {
    getNewFrameworkComponentId,
    findFrameworkComponentId,
} from '../utils/frameworkComponentUtils';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';
import ProjectionContext from 'owa-popout-v2/lib/context/ProjectionContext';

export function lazyInitializeExtensibilityFrameworkComponent(
    renderTaskPaneInPanel: boolean,
    hostItemIndex: string,
    targetWindow: Window = window
): void {
    const document = targetWindow.document;
    let frameworkComponentId = findFrameworkComponentId(targetWindow);
    let frameworkComponent = document.getElementById(frameworkComponentId);
    if (frameworkComponent != null) {
        updateFrameworkComponentHostItemIndexMap(frameworkComponentId, hostItemIndex);
        return;
    }

    frameworkComponentId = getNewFrameworkComponentId(targetWindow);
    frameworkComponent = document.createElement('div');
    frameworkComponent.id = frameworkComponentId;
    updateFrameworkComponentHostItemIndexMap(frameworkComponentId, hostItemIndex);
    document.body.appendChild(frameworkComponent);

    ReactDOM.render(
        <React.StrictMode>
            <WindowProvider window={targetWindow}>
                <ProjectionContext.Provider value={targetWindow}>
                    <ExtensibilityFrameworkComponent
                        renderTaskPaneInPanel={renderTaskPaneInPanel}
                    />
                </ProjectionContext.Provider>
            </WindowProvider>
        </React.StrictMode>,
        frameworkComponent
    );
}

export function removeExtensibilityFrameworkComponent(targetWindow: Window = window): void {
    // Remove only in case of childWindow. In case of mainWindow, we will be switching between items
    // and we will need to immediately create same container if we remove it.
    // In case of projection popout target window will always be there and it will not be equal to main window
    if (targetWindow != window) {
        const document = targetWindow.document;
        const frameworkComponentId = findFrameworkComponentId(targetWindow);
        let frameworkComponent = document.getElementById(frameworkComponentId);
        if (frameworkComponent == null) {
            return;
        }
        updateFrameworkComponentHostItemIndexMap(frameworkComponentId);
        ReactDOM.unmountComponentAtNode(frameworkComponent);
        document.body.removeChild(frameworkComponent);
    }
}

export interface ExtensibilityFrameworkComponentProps {
    renderTaskPaneInPanel: boolean;
}

export function ExtensibilityFrameworkComponent(props: ExtensibilityFrameworkComponentProps) {
    return (
        <>
            {props.renderTaskPaneInPanel && <TaskPaneCollection renderTaskPaneInPanel={true} />}
            <UILessAddinCommandsComponent />
            <ContextualCallout />
            <IFrameableDialog />
        </>
    );
}
