/**
 * Used for assigning element IDs to `PivotItem` components.
 *
 * This allows scenarios to reconstruct a given ID for DOM-based access
 * just based on knowing the `itemKey` value.
 */
export function getTimePanelDndPivotTabId(itemKey: string) {
    return `time-panel-pivot-${itemKey}`;
}
