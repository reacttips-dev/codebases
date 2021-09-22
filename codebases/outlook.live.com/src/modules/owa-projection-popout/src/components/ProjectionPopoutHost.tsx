import * as React from 'react';
import { observer } from 'mobx-react-lite';

import { Module } from 'owa-workloads/lib/store/schema/Module';
import { getStore } from 'owa-tab-store/lib/store/tabStore';
import { TabState } from 'owa-tab-store/lib/store/schema/TabViewState';
import setIsProjectionAvailable from 'owa-popout-v2/lib/actions/setIsProjectionAvailable';

import isBrowserSupportProjection from '../utils/isBrowserSupportProjection';
import isProjectionFlightEnabled from '../utils/isProjectionFlightEnabled';
import ProjectionPopout from './ProjectionPopout';

// Import the orchestrator here to make sure projection popout can work well
import 'owa-tab-store/lib/orchestrators/startProjectionOrchestrator';
import 'owa-tab-store/lib/orchestrators/transferProjectionOrchestrator';
import 'owa-tab-store/lib/orchestrators/onProjectionBlurOrchestrator';
import 'owa-tab-store/lib/orchestrators/onBeforeCloseMainWindowOrchestrator';
export interface ProjectionPopoutHostProps {
    module: Module;
}

export default observer(function ProjectionPopoutHost(props: ProjectionPopoutHostProps) {
    const popoutTabs = getStore().tabs.filter(viewState => viewState.state === TabState.Popout);
    const isProjectionEnabled =
        isProjectionFlightEnabled(props.module) && isBrowserSupportProjection();

    React.useEffect(() => {
        setIsProjectionAvailable(isProjectionEnabled /*isAvailable*/);
        return () => {
            setIsProjectionAvailable(false /*isAvailable*/);
        };
    }, []);

    return (
        <>
            {isProjectionEnabled &&
                popoutTabs.map(tab => <ProjectionPopout key={tab.id} viewState={tab} />)}
        </>
    );
});
