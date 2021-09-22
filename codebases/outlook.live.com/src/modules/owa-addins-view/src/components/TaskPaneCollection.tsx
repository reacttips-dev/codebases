import * as React from 'react';
import TaskPane from './TaskPane';
import { collapsePaneUnderlay, expandPaneUnderlay } from '../utils/appPaneUnderlayUtils';
import { getApp } from 'owa-config';
import { getExtensibilityState, getTaskPaneRunningInstance, TaskPaneType } from 'owa-addins-store';
import { isPersistentTaskpaneEnabled } from 'owa-addins-feature-flags';
import { observer } from 'mobx-react-lite';
import getProjection from 'owa-popout-v2/lib/utils/getProjection';
import ProjectionContext from 'owa-popout-v2/lib/context/ProjectionContext';
import { isAppPaneUnderlayExpanded } from 'owa-application';
import { findFrameworkComponentId } from '../utils/frameworkComponentUtils';
export interface TaskPaneCollectionProps {
    renderTaskPaneInPanel: boolean;
}

export default observer(function TaskPaneCollection(props: TaskPaneCollectionProps) {
    const targetWindow = React.useContext(ProjectionContext);
    const { taskPanes, frameworkComponentHostItemIndexMap } = getExtensibilityState();
    const frameworkComponentId = findFrameworkComponentId(targetWindow);
    const hostItemIndex = frameworkComponentHostItemIndexMap.get(frameworkComponentId);

    const setPaneUnderlayStatus = (): void => {
        if (getApp() === 'Mail') {
            const projection = getProjection(targetWindow);
            const underlay = projection?.underlay;

            const taskpaneForHostItemIndex = taskPanes.get(hostItemIndex);
            const isUnderlayExpanded = isAppPaneUnderlayExpanded(underlay);

            if (!isUnderlayExpanded && taskpaneForHostItemIndex?.size) {
                expandPaneUnderlay(underlay);
            } else if (isUnderlayExpanded && !taskpaneForHostItemIndex?.size) {
                collapsePaneUnderlay(underlay);
            }
        }
    };

    const renderTaskPane = (type: TaskPaneType) => {
        const instance = getTaskPaneRunningInstance(type, hostItemIndex);
        return (
            instance && (
                <TaskPane
                    key={instance.controlId}
                    type={type}
                    instance={instance}
                    renderInPanel={props.renderTaskPaneInPanel}
                />
            )
        );
    };

    setPaneUnderlayStatus();

    const persistentTaskPane =
        isPersistentTaskpaneEnabled() && renderTaskPane(TaskPaneType.Persistent);
    const nonPersistentTaskPane = renderTaskPane(TaskPaneType.NonPersistent);

    return <React.Fragment>{[persistentTaskPane, nonPersistentTaskPane]}</React.Fragment>;
});
