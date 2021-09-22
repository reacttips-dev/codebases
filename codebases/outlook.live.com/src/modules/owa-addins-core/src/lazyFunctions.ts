import { createLazyComponent, LazyImport, LazyModule, LazyAction } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "Addins" */ './lazyIndex'));

// apis
export let lazyRemoveExtensibilityNotification = new LazyImport(
    lazyModule,
    m => m.removeExtensibilityNotification
);
export let lazyUpdatePersistentNotifications = new LazyImport(
    lazyModule,
    m => m.updatePersistentNotifications
);
export let lazyCloseTaskPaneAddinCommand = new LazyImport(
    lazyModule,
    m => m.closeTaskPaneAddinCommand
);

// events
export let lazyTriggerAppointmentTimeChangedEvent = new LazyImport(
    lazyModule,
    m => m.triggerAppointmentTimeChangedEvent
);
export let lazyTriggerRecipientsChangedEvent = new LazyImport(
    lazyModule,
    m => m.triggerRecipientsChangedEvent
);
export let lazyTriggerRecurrenceChangedEvent = new LazyImport(
    lazyModule,
    m => m.triggerRecurrenceChangedEvent
);
export let lazyTriggerLocationsChangedEvent = new LazyImport(
    lazyModule,
    m => m.triggerLocationsChangedEvent
);
export let lazyTriggerAttachmentsChangedEvent = new LazyImport(
    lazyModule,
    m => m.triggerAttachmentsChangedEvent
);

// boot
export let lazyDeinitializeAddinsForItem = new LazyImport(
    lazyModule,
    m => m.deinitializeAddinsForItem
);
export let lazyInitializeAddinsForItem = new LazyImport(lazyModule, m => m.initializeAddinsForItem);
export let lazyInitializeExtensibilityContext = new LazyAction(
    lazyModule,
    m => m.initializeExtensibilityContext
);
export let lazyOnHostItemChanged = new LazyImport(lazyModule, m => m.onHostItemChanged);
export let lazyWhenItemHasContextualAddinKeywords = new LazyImport(
    lazyModule,
    m => m.whenItemHasContextualAddinKeywords
);
export let lazyRunContextualEvaluationAndUpdate = new LazyImport(
    lazyModule,
    m => m.runContextualEvaluationAndUpdate
);

// outlook-translate
export let lazyLaunchTranslateCommand = new LazyImport(lazyModule, m => m.launchTranslateCommand);

// store
export let lazyShouldAddinsForceOnSendCompliantBehavior = new LazyImport(
    lazyModule,
    m => m.shouldForceOnSendCompliantBehavior
);

// view
export let AddinBarView = createLazyComponent(lazyModule, m => m.AddinBarView);
export let TaskPaneCollection = createLazyComponent(lazyModule, m => m.TaskPaneCollection);

export let lazyOnComposeClose = new LazyImport(lazyModule, m => m.onComposeClose);
export let lazyOpenContextualCallout = new LazyImport(lazyModule, m => m.openContextualCallout);
export let lazyLaunchAddinCommand = new LazyImport(lazyModule, m => m.launchAddinCommand);
export let lazyAddinCommandSurfaceItemsObserver = new LazyImport(
    lazyModule,
    m => m.observeAddinCommandSurfaceItems
);
export let lazyOnItemNavigation = new LazyImport(lazyModule, m => m.onItemNavigation);
export let lazyAllowItemSendEvent = new LazyImport(lazyModule, m => m.allowItemSendEvent);
export let lazyInitializeExecuteEntryPoint = new LazyAction(lazyModule, m => m.ExecuteEntryPoint);

//Autorun actions
export let lazyOnLaunchEventTriggered = new LazyAction(lazyModule, m => m.onLaunchEventTriggered);

export let lazyLogAppTeachingUICalloutTelemetry = new LazyAction(
    lazyModule,
    m => m.logAppTeachingUICalloutTelemetry
);

export let lazyLogCustomizeActionButtonAction = new LazyAction(
    lazyModule,
    m => m.logCustomizeActionButtonAction
);

export let lazyConvertRecurrenceToAddinFormat = new LazyImport(
    lazyModule,
    m => m.convertRecurrenceToAddinFormat
);
export let lazySeriesTimeJsonConverter = new LazyImport(lazyModule, m => m.seriesTimeJsonConverter);

// Owa experiment (AwarenessNudge) : Highlighting addins and buttons
export const lazyHighlightOverflowAddins = new LazyAction(
    lazyModule,
    m => m.highlightOverflowAddins
);

export const lazyHighlightCustomizeActionButton = new LazyAction(
    lazyModule,
    m => m.highlightCustomizeActionButton
);

//EMO functions
export const lazyLaunchThirdPartyOnlineMeetingProviderAddin = new LazyAction(
    lazyModule,
    m => m.launchThirdPartyOnlineMeetingProviderAddin
);
