import { getDarwinShortcuts, getWindowsShortcuts } from '../controllers/ShortcutsList';

let shortcuts = _.includes(navigator.platform, 'Mac') ? getDarwinShortcuts() : getWindowsShortcuts();

let shortcutsList = [{
  name: 'Request',
  shortcuts: [
    shortcuts.requestUrl,
    shortcuts.saveCurrentRequest,
    shortcuts.saveCurrentRequestAs,
    shortcuts.sendCurrentRequest,
    shortcuts.sendAndDownloadCurrentRequest,
    {
      label: 'Resize Request or Response Pane',
      keyLabelDarwin: ['⌥ scroll', '⌘⌥ scroll'],
      keyLabel: ['Alt+scroll', 'Win+Alt+scroll']
    },
    shortcuts.scrollToRequest,
    shortcuts.scrollToResponse
  ]
}, {
  name: 'Sidebar',
  shortcuts: [
    shortcuts.search,
    shortcuts.toggleSidebar,
    shortcuts.nextItem,
    shortcuts.prevItem,
    shortcuts.expandItem,
    shortcuts.collapseItem,
    shortcuts.select,
    {
      label: 'Open In Tab',
      keyLabelDarwin: '⇧ ⌘ click',
      keyLabel: 'Ctrl+Shift+click'
    },
    shortcuts.rename,
    shortcuts.groupItems,

    // shortcuts.moveItemUp,
    // shortcuts.moveItemDown,
    shortcuts.cut,
    shortcuts.copy,
    shortcuts.paste,
    shortcuts.duplicate,
    shortcuts.delete
  ]
}, {
  name: 'Interface',
  shortcuts: [
    shortcuts.increaseUIZoom,
    shortcuts.decreaseUIZoom,
    shortcuts.resetUIZoom,
    shortcuts.toggleLayout
  ]
}, {
  name: 'Windows and modals',
  shortcuts: [
    shortcuts.openCreateNewModal,
    shortcuts.newRequesterWindow,
    shortcuts.newConsoleWindow,
    shortcuts.toggleFindReplace,
    shortcuts.import,
    shortcuts.manageEnvironments,
    shortcuts.settings,
    shortcuts.submit,
    shortcuts.shortcutCheats,
    shortcuts.universalSearchFocus
  ]
}, {
  name: 'CONSOLE',
  shortcuts: [
    shortcuts.clearConsole,
    shortcuts.searchConsole
  ]
}];

// The current implementation of shortcuts automatically filters out any disabled shortcuts from
// being shown in the Settings modal. In this case, we have disabled all the tab shortcuts on the
// Artemis app. So, all the tab shortcuts would not be shown on the web. However, the "TABS" group
// would still be shown as an empty list.
// To prevent the entire group from being shown, we are handling it manually and only adding it to
// the list when we know we are not on the browser.
(window.SDK_PLATFORM !== 'browser') && shortcutsList.unshift({
  name: 'Tabs',
  shortcuts: [
    shortcuts.openNewTab,
    shortcuts.closeCurrentTab,
    shortcuts.forceCloseCurrentTab,
    shortcuts.switchToNextTab,
    shortcuts.switchToPreviousTab,
    {
      label: 'Switch To Tab at Position',
      keyLabelDarwin: '⌘ 1 through ⌘ 8',
      keyLabel: 'Ctrl + 1 through Ctrl + 8'
    },
    shortcuts.switchToLastTab,
    shortcuts.reopenLastClosedTab,
    shortcuts.newRunnerTab
  ]
});

export const SETTINGS_SHORTCUTS = shortcutsList;
