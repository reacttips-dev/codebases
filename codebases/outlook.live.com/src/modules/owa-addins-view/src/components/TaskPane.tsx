import { observer } from 'mobx-react-lite';
import { extensionContainerAriaLabel } from './TaskPane.locstring.json';
import loc, { format } from 'owa-localize';
import classNames from 'classnames';
import * as React from 'react';

import TaskPaneError from './TaskPaneError';
import TaskPaneHeader, { TaskPaneHeaderHandle } from './TaskPaneHeader';
import { AddinCommandsManifestCacheProvider } from 'owa-addins-osf-facade';
import { AddinPanel } from './AddinPanel';
import { closeTaskPaneAddinCommandByControlId } from 'owa-addins-apis';
import { ExtensibilityModeEnum } from 'owa-addins-types';

import { isDeepLink } from 'owa-url';
import { OsfHostContainer } from '../components/OsfHostContainer';
import 'owa-addins-osfruntime';
import {
    AddinCommand,
    TaskPaneRunningInstance,
    TaskPaneType,
    TaskPaneErrorType,
    toggleTaskPaneType,
} from 'owa-addins-store';
import {
    setPersistedAddin,
    addinSupportsPersistence,
    createPersistedAddin,
} from 'owa-addins-persistent';
import { setNavigationState, resetNavigationState } from '../utils/navigations/NavigationState';

import styles from './TaskPane.scss';

export interface TaskPaneProps {
    type: TaskPaneType;
    instance: TaskPaneRunningInstance;
    renderInPanel?: boolean;
}

export default observer(function TaskPane(props: TaskPaneProps) {
    const taskPaneHeader = React.useRef<TaskPaneHeaderHandle>();
    const focusTaskPaneHeader = (): void => {
        if (taskPaneHeader.current) {
            taskPaneHeader.current.focusCloseButton();
        }
    };
    const renderError = (): JSX.Element => {
        const { errorType } = props.instance;
        return hasError() && <TaskPaneError errorType={errorType} />;
    };
    const renderOsfHostContainer = (): JSX.Element => {
        const { hostItemIndex, controlId, addinCommand } = props.instance;
        const notifyHostActions = {};
        notifyHostActions[OSF.AgaveHostAction.EscExit] = focusTaskPaneHeader;
        notifyHostActions[OSF.AgaveHostAction.TabExitShift] = focusTaskPaneHeader;
        notifyHostActions[OSF.AgaveHostAction.TabExit] = focusTaskPaneHeader;
        return (
            <OsfHostContainer
                addinCommand={addinCommand}
                controlId={controlId}
                className={classNames([styles.extensionHost, hasError() && styles.hide])}
                hostItemIndex={hostItemIndex}
                manifestCacheProvider={AddinCommandsManifestCacheProvider}
                notifyHostActions={notifyHostActions}
            />
        );
    };
    const supportsPersisted = () => {
        return addinSupportsPersistence(props.instance.addinCommand as AddinCommand);
    };
    const isCalendar = () => {
        return (
            props.instance.mode === ExtensibilityModeEnum.AppointmentAttendee ||
            props.instance.mode === ExtensibilityModeEnum.AppointmentOrganizer
        );
    };
    const isPersisted = () => {
        return props.type === TaskPaneType.Persistent;
    };
    const hasError = (): boolean => {
        const { errorType } = props.instance;
        return errorType !== TaskPaneErrorType.None;
    };
    const close = (): void => {
        const { mode, controlId } = props.instance;
        if (isPersisted()) {
            setPersistedAddin(mode, null /* PersistedAddinCommand */);
        }
        closeTaskPaneAddinCommandByControlId(controlId);
    };
    const togglePersist = (): void => {
        const addin = isPersisted()
            ? null
            : createPersistedAddin(props.instance.addinCommand as AddinCommand);
        setPersistedAddin(props.instance.mode, addin);

        if (props.type == TaskPaneType.Persistent) {
            // Persistent will get converted to Non-Persistent. So we will clear nav state
            resetNavigationState();
        } else {
            // Non Persistent will get converted to Persistent. So we will set nav state
            setNavigationState({
                hostItemIndex: props.instance.hostItemIndex,
                mode: props.instance.mode,
            });
        }

        toggleTaskPaneType(props.type, props.instance.hostItemIndex);
    };
    const { instance } = props;
    const renderInPanel = props.renderInPanel === undefined ? true : props.renderInPanel;
    if (!instance) {
        return <div className={styles.divContainer} />;
    }
    const { addinCommand } = instance;
    return (
        <AddinPanel
            renderInPanel={renderInPanel}
            onDismiss={close}
            isDeepLink={isDeepLink()}
            disableFirstFocus={isPersisted()}>
            <TaskPaneHeader
                iconUrl={addinCommand.extension.IconUrl}
                displayName={addinCommand.extension.DisplayName}
                closeOnClick={close}
                ref={taskPaneHeader}
                isCalendar={isCalendar()}
                isPersistable={supportsPersisted()}
                isPersisted={isPersisted()}
                togglePersist={togglePersist}
            />
            <div
                className={classNames(
                    styles.extensionContainer,
                    isCalendar() && styles.extensionContainerCalendar
                )}
                aria-label={format(
                    loc(extensionContainerAriaLabel),
                    addinCommand.extension.DisplayName
                )}
                role="complementary">
                {renderError()}
                {renderOsfHostContainer()}
            </div>
        </AddinPanel>
    );
});
