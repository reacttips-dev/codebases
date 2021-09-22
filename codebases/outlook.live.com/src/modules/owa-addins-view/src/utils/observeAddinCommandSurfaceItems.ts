import type ExtensibilityContext from 'owa-service/lib/contract/ExtensibilityContext';
import { Addin, IEnabledAddinCommands, getExtensibilityState } from 'owa-addins-store';
import type { AddinCommandSurfaceItem, ExtensibilityModeEnum } from 'owa-addins-types';
import { computed, IComputedValue } from 'mobx';
import { createAddinCommandSurfaceActions } from './contextMenuDataUtils';

type ComputedSurfaceItems = { [key: string]: IComputedValue<AddinCommandSurfaceItem> };

const computedSurfaceItems: ComputedSurfaceItems = {};

// We get call to this function from getAddinCollection(Mail module) and getCommandBarAddins(Calendar module)
// Projection popout is currently not implemented for Calendar module,
// So it will not pass targetWindow, In that case fallback will be window.
export function observeAddinCommandSurfaceItems(
    mode: ExtensibilityModeEnum,
    isSharedItem: boolean,
    hostItemIndex: string,
    targetWindow: Window = window
): IComputedValue<AddinCommandSurfaceItem> {
    isSharedItem = !!isSharedItem;
    const key = getSurfaceItemsKey(mode, isSharedItem, hostItemIndex, targetWindow);

    if (!computedSurfaceItems[key]) {
        computedSurfaceItems[key] = computed(() => {
            const context = getExtensibilityState().Context;
            const enabledAddinCommands = getExtensibilityState().EnabledAddinCommands;

            if (!enabledAddinCommands) {
                return null;
            }
            return getAddinCommandSurfaceItems(
                mode,
                enabledAddinCommands,
                context,
                isSharedItem,
                targetWindow
            );
        });
    }
    return computedSurfaceItems[key];
}

export function getAddinCommandSurfaceItems(
    mode: ExtensibilityModeEnum,
    enabledAddinCommands: IEnabledAddinCommands,
    context: ExtensibilityContext,
    isSharedItem: boolean,
    targetWindow: Window
) {
    if (context && enabledAddinCommands.isInitialized) {
        const enabledAddins: Addin[] = enabledAddinCommands.getExtensionPoint(mode, isSharedItem);
        return createAddinCommandSurfaceActions(enabledAddins, targetWindow);
    }
    return null;
}

function getSurfaceItemsKey(
    mode: number,
    isSharedItem: boolean,
    hostItemIndex: string,
    targetWindow: Window
): string {
    const PPFlag = 'PP'; //Projection popout flag
    if (targetWindow != window) {
        // items saved corresponding to this key will not have inclientstore url
        return mode + '_' + isSharedItem + '_' + hostItemIndex + '_' + PPFlag;
    }
    return mode + '_' + isSharedItem + '_' + hostItemIndex;
}
