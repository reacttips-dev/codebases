import ClientTelemetryService from '../../../js/services/PerformanceTelemetryService';

const DOMAIN = ClientTelemetryService.DOMAINS.CLIENT_FOUNDATION;

let events = {
  // The time taken from user clicking a tab header to when the new tab is visible
  'TAB_TITLE_CLICK_TAB_SWITCH_TIME': {
    name: 'tab_title_click_tab_switch_time',
    apdexThreshold: 60
  },

  // The time taken since page load for the switchPage handler to switch context to the initial tab
  'INITIAL_TAB_LOAD_TIME': {
    name: 'initial_tab_load_time',
    apdexThreshold: 8000
  },

  // The time taken for the handleOpenWorkspace handler to switch workspace context
  'WORKSPACE_SWITCH_TIME': {
    name: 'workspace_switch_time',
    apdexThreshold: 300
  },

  // Time since page load when request boot completes
  'SHELL_BOOT_END_TIME': {
    name: 'shell_boot_end_time',
    apdexThreshold: 5000
  },

  // Time taken for transitionToInitialURL in Navigation Service to execute
  'INITIAL_NAVIGATION_TIME': {
    name: 'initial_navigation_time',
    apdexThreshold: 500
  },

  // Time since page load for the Requester base component first render
  'INITIAL_PAGE_RENDER_TIME': {
    name: 'initial_page_render_time',
    apdexThreshold: 6000
  },

  // Time taken to populate the workspace switcher using the API call
  'WORKSPACE_SWITCHER_LOAD_TIME': {
    name: 'workspace_switcher_load_time',
    apdexThreshold: 500
  },

  // Time taken for _createNewRequest to create an empty request tab
  'UNTITLED_REQUEST_TAB_OPEN_TIME': {
    name: 'untitled_request_tab_open_time',
    apdexThreshold: 25
  },

  // This is the time taken by the app to load the requester window.
  // This is a marker for when the js file `apps/requester/init.js` starts to execute.
  'REQUESTER_LOAD_TIME': {
    name: 'requester_load_time',
    apdexThreshold: 3000
  },

  // Marker for when the Requester component is mounted.
  // This event occurs after the requester has initialized (BROWSER_REQUESTER_INIT_TIME).
  // BROWSER_REQUESTER_INIT_TIME: declared as a span below.
  'REQUESTER_MOUNTED_TIME': {
    name: 'requester_mounted_time',
    apdexThreshold: 5500
  },

  // -----------------------------
  // ---------  SPANS  -----------
  // -----------------------------

  // Time taken for the requester window to be initialized.
  // This function runs before rendering the requester UI.
  'BROWSER_REQUESTER_INIT_TIME': {
    name: 'requester_init_time',
    apdexThreshold: 400
  },

  // Time taken by the WorkspacePageController to load the workspace
  // During this time an application wide loader is shown to the user.
  // All interactions on the app are blocked by this loader.
  // The WorkspacePageView is only shown to the user after the workspace has been successfully loaded.
  'WORKSPACE_PAGE_LOAD_TIME': {
    name: 'workspace_page_load_time',
    apdexThreshold: 1000// to be updated.. tentatively 1000 ms
  },

  // Time taken by the RequestWorkbenchController to load the request in the workbench view.
  // Starts at: This must start as soon as the request editor is loaded and an instance of RequestWorkbenchController is created.
  // Marked by triggering the lifecycle method `didCreate` of RequestWorkbenchController
  // Ends at: This must end after the view for the request Editor is loaded with the data.
  // A loader is shown to the user in the workbench view while the request is being loaded.
  'REQUEST_EDITOR_LOAD_TIME': {
    name: 'request_editor_load_time',
    apdexThreshold: 4000 // to be updated.. tentatively 1500 ms
  }
};

// Add the domain key if not already added
for (let key in events) {
  if (events[key] && !events[key]['domain']) {
    events[key]['domain'] = DOMAIN;
  }
}

export default events;
