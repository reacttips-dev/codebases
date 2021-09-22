export type InitialAction = () => void;

export interface InitialActions {
    actions: InitialAction[];
    isExecuted: boolean;
}

export function createInitialActions(): InitialActions {
    return {
        actions: [],
        isExecuted: false,
    };
}

export function addInitialAction(initialActions: InitialActions, action: InitialAction) {
    if (!initialActions || initialActions.isExecuted) {
        action();
    } else {
        initialActions.actions.push(action);
    }
}

export function executeInitialActions(initialActions: InitialActions) {
    if (initialActions && !initialActions.isExecuted) {
        // Use setTimeout to run after window.requestAnimationFrame() so that the execution time isn't counted in CTQ
        window.setTimeout(() => {
            // the array can be added with more values during the loop, so use for loop to handle all new added values
            for (let i = 0; i < initialActions.actions.length; i++) {
                initialActions.actions[i]();
            }
            initialActions.actions = [];
            initialActions.isExecuted = true;
        }, 0);
    }
}
