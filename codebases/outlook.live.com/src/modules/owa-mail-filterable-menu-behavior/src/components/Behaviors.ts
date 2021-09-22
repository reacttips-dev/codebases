import type { ShouldShowBehavior } from 'owa-filterable-menu';
import type { ListViewBehavior } from './Behaviors.types';

/**
 * Calculate the should show behavior based on a list of behaviors.
 * @param behaviors Collection of behaviors.
 */
export function shouldShowMenuItem(
    behaviors: ListViewBehavior | ListViewBehavior[] = null
): ShouldShowBehavior {
    // If no behavior is specified show the menu item
    if (!behaviors) {
        return () => true;
    }

    if (Array.isArray(behaviors[0])) {
        return () => behaviors.some(behavior => shouldShowOnSingleBehavior(behavior));
    } else {
        return () => shouldShowOnSingleBehavior(behaviors as ListViewBehavior);
    }
}

/**
 * Calculate the shouldShowResult based on a single list view behavior
 * @param behavior the single behavior function
 */
function shouldShowOnSingleBehavior(behavior: ListViewBehavior): boolean {
    return behavior.every(fn => fn());
}
