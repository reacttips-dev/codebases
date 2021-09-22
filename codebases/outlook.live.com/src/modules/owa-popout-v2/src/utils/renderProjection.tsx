import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from 'owa-application/lib/components/App';
import getProjection from './getProjection';
import getProjectionRoot from './getProjectionRoot';
import ProjectionContext from '../context/ProjectionContext';
import OneOutlookSuiteHeader from 'one-outlook-suite-header/lib/components/OneOutlookSuiteHeader';
import { Titlebar } from 'one-outlook-suite-header/lib/components/Titlebar';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { WindowProvider } from '@fluentui/react/lib/WindowProvider';

export default function renderProjection(tabId: string, content: JSX.Element, tabTitle?: string) {
    const projection = getProjection(tabId);
    const root = getProjectionRoot(projection);

    if (root && content) {
        if (root.firstChild) {
            // If there is already content unmount it before rerendering
            ReactDOM.unmountComponentAtNode(root);
        }

        ReactDOM.render(
            <App
                renderHeader={renderHeader(projection.window, tabId, tabTitle)}
                underlay={projection.underlay}>
                <ProjectionContext.Provider value={projection.window}>
                    <WindowProvider window={projection.window}>{content}</WindowProvider>
                </ProjectionContext.Provider>
            </App>,
            root
        );
    }
}

function renderHeader(windowObj, projectionTabId, title) {
    return () =>
        isHostAppFeatureEnabled('projectionCustomTitlebar') ? (
            <OneOutlookSuiteHeader
                window={windowObj}
                suiteHeader={<Titlebar title={title} />}
                windowId={projectionTabId}
            />
        ) : null;
}
