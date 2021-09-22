import type ExtensibilityState from './schema/ExtensibilityState';
import type TaskPaneRunningInstance from './schema/TaskPaneRunningInstance';
import { createStore } from 'satcheljs';
import type { ExtensibilityHostItem } from './schema/ExtensibilityHostItem';
import { initializeCompliance } from './schema/Compliance';
import { InitializeContextualCalloutState } from './schema/ContextualCalloutState';
import { ObservableMap } from 'mobx';
import type IExtendedAddinCommand from './schema/interfaces/IExtendedAddinCommand';
import type TaskPaneType from './schema/TaskPaneType';
import type { ActiveDialog } from './schema/interfaces/Dialog';

const store: ExtensibilityState = createStore<ExtensibilityState>('extensibility', {
    EnabledAddinCommands: null,
    HostItems: new ObservableMap<string, ExtensibilityHostItem>(),
    IsPreinstalledTeachingUIAvailable: false,
    Context: null,
    frameworkComponentHostItemIndexMap: new ObservableMap<string, string>(),
    taskPanes: new ObservableMap<string, ObservableMap<TaskPaneType, TaskPaneRunningInstance>>(),
    activeDialogs: new ObservableMap<string, ActiveDialog>(),
    ExtensibilityStateIsDirty: false,
    contextualCalloutState: InitializeContextualCalloutState(),
    runningContextualAddinCommand: null,
    runningUILessExtendedAddinCommands: new ObservableMap<
        string,
        ObservableMap<string, IExtendedAddinCommand>
    >(),
    autoRunAddinCommandWaitingQueue: new ObservableMap<string, Array<IExtendedAddinCommand>>(),
    compliance: initializeCompliance(),
    activeAutorunUilessFrames: new ObservableMap<string, any>(),
})();

export default store;
