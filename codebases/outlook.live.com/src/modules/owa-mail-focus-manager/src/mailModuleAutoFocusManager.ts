import { FocusComponent } from './types/FocusComponent';

const componentPriorityList: FocusComponent[] = [
    FocusComponent.MailCompose, // highest priority
    FocusComponent.MailList,
    FocusComponent.ReadingPane,
];

type FocusCallback = () => boolean;
const registeredComponents: {
    [focusComponent: string]: FocusCallback[];
} = {
    MailCompose: [],
    MailList: [],
    ReadingPane: [],
};

/**
 * Register a component as available to be focused on
 */
export function registerComponent(
    component: FocusComponent,
    setFocusCallback: FocusCallback
): () => void {
    const callbacks = registeredComponents[component];
    callbacks.push(setFocusCallback);
    return function unregisterComponent() {
        for (let ii = 0; ii < callbacks.length; ii++) {
            if (callbacks[ii] === setFocusCallback) {
                // Remove the callback from our list
                callbacks.splice(ii, 1);
            }
        }
    };
}

/**
 * Determine which component should get focus and executes its callback to set focus
 * @returns promise that resolves when focus operation has been performed
 */
export function resetFocus(): Promise<void> {
    return new Promise<void>(resolve => {
        window.requestAnimationFrame(function () {
            for (const component of componentPriorityList) {
                if (setFocusToSynchronous(component)) {
                    break;
                }
            }

            return resolve();
        });
    });
}

/**
 * Sets focus to the component synchronously. This should be used with GREAT CAUTION as it will cause an immediate repaint.
 * An example is when a component is focused and about to be unmounted and focus has to be set to particular component, use
 * this function. Otherwise use resetFocus which will set focus to the highest order component.
 */
export function setFocusToSynchronous(component: FocusComponent): boolean {
    // Go through each key individually and stop once we are able to set focus
    const callbacks = registeredComponents[component];
    for (let ii = callbacks.length - 1; ii >= 0; ii--) {
        const setFocusCallback = callbacks[ii];
        const result = setFocusCallback?.();
        if (result) {
            return result;
        }
    }
    return false;
}
