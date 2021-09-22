import {
    ActionMessage,
    ActionCreator,
    OrchestratorFunction,
    action,
    orchestrator,
} from 'satcheljs';
import { Getter, LazyImport, LazyModule, setGlobalImportStartTime } from 'owa-bundling-light';

export interface LazyOrchestrator<TMessage> {
    actionCreator: ActionCreator<TMessage>;
    handler: OrchestratorFunction<TMessage>;
    cloneActionName: string;
}

export function createLazyOrchestrator<TMessage extends ActionMessage>(
    actionCreator: ActionCreator<TMessage>,
    cloneActionName: string,
    handler: OrchestratorFunction<TMessage>
): LazyOrchestrator<TMessage> {
    return {
        actionCreator,
        handler,
        cloneActionName,
    };
}

export interface LazyOrchestratorOptions {
    captureBundleTime?: boolean;
}

export function registerLazyOrchestrator<
    TModule,
    TMessage extends ActionMessage & { lazyOrchestrator?: boolean }
>(
    actionCreator: ActionCreator<TMessage>,
    lazyModule: LazyModule<TModule>,
    getter: Getter<LazyOrchestrator<TMessage>, TModule>,
    options?: LazyOrchestratorOptions
) {
    let actionCreatorPromise: Promise<ActionCreator<TMessage>>;

    // Register a non-lazy orchestrator for the original action
    orchestrator(actionCreator, async actionMessage => {
        if (!actionCreatorPromise) {
            actionCreatorPromise = importAndRegisterOrchestrator();
        }

        // Dispatch the cloned action now that the lazy orchestrator is registered
        actionMessage.lazyOrchestrator = true;
        let importStartTime = options?.captureBundleTime ? Date.now() : null;
        const cloneActionCreator = await actionCreatorPromise;
        setGlobalImportStartTime(importStartTime);
        cloneActionCreator(actionMessage);
        setGlobalImportStartTime(null);
    });

    async function importAndRegisterOrchestrator() {
        // Import the lazy orchestrator
        const lazyImport = new LazyImport(lazyModule, getter);
        const lazyOrchestrator = await lazyImport.import();

        // Validate that we're subscribing to the same action the lazy orchestrator was
        // defined for.
        if (actionCreator !== lazyOrchestrator.actionCreator) {
            throw new Error('Lazy orchestrator cannot subscribe to this action.');
        }

        // Define an action creator that clones the original action (but with the new name)
        const cloneActionCreator = action(
            lazyOrchestrator.cloneActionName,
            (originalActionMessage: TMessage) => {
                let cloneActionMessage = { ...originalActionMessage };
                delete cloneActionMessage.type;
                delete cloneActionMessage.lazyOrchestrator;
                return cloneActionMessage;
            }
        );

        // Register the actual orchestrator
        orchestrator(cloneActionCreator, lazyOrchestrator.handler);
        return cloneActionCreator;
    }
}
