import { createStore } from 'satcheljs';

/**
 * A type enforcing that TRootStore does not contain the key TKeyLiteral to
 * prevent collision of object keys.
 **/
type NoCollisions<TRootStore, TKeyLiteral extends string> = {
    [key in keyof TRootStore]: key extends TKeyLiteral ? never : TRootStore[key];
};

export type Diagnostics<TKeyLiteral extends string, TScenarioStore> = {
    /**
     * Add scenario-specific diagnostics to an existing diagnostics root store.
     *
     * Module diagnostic stores are made by composing myDiagnostics.init calls
     * e.g.
     *
     *     fooDiagnostics.init(barDiagnostics.init({}))
     */
    init: <TRootStore extends object>(
        rootStore: TRootStore
    ) => TRootStore & { [key in TKeyLiteral]: () => TScenarioStore };

    /**
     * Get the diagnostics if initialized.
     *
     * For use in common packages that read diagnostics which may or may not be
     * opted into (e.g. initialized) in the module's diagnostics root. The
     * consuming package MUST check if the store is null, because if there is
     * no store, we are running in an environment that did not opt in to this
     * particular diagnostics store.
     */
    getIfInitialized: () => null | TScenarioStore;
};

/**
 * Creates a new scenario-specific Diagnostics object, to be consumed by the
 * module-level diagnostics store to opt-in to this scenario's diagnostics
 */
export const declareDiagnostics = <TKeyLiteral extends string, TScenarioStore>(
    uniqueName: TKeyLiteral,
    initialState: TScenarioStore,
    registerListeners: (store: TScenarioStore) => void
): Diagnostics<TKeyLiteral, TScenarioStore> => {
    let boundStore: () => TScenarioStore = null;
    return {
        init: <TRootStore extends object>(rootStore: NoCollisions<TRootStore, TKeyLiteral>) => {
            if (boundStore !== null) {
                return rootStore as TRootStore & { [key in TKeyLiteral]: () => TScenarioStore };
            }
            boundStore = createStore<TScenarioStore>(uniqueName, initialState);
            registerListeners(boundStore());

            return {
                // Assert because Typescript does not allow generic object spread
                ...(rootStore as object),
                [uniqueName]: boundStore,
                // Cast back down to the expected type after unpacking.
            } as TRootStore & { [key in TKeyLiteral]: () => TScenarioStore };
        },
        getIfInitialized: () => {
            return boundStore ? boundStore() : null;
        },
    };
};

/**
 * From a certain diagnostics type, get the key name of the store.
 * e.g. from Diagnostics<'MyDiagnostics', MyDiagnosticsStore> => 'MyDiagnostics'
 */
export type NameOf<
    TDiagnostics extends Diagnostics<string, any>
> = TDiagnostics extends Diagnostics<infer TKeyLiteral, any> ? TKeyLiteral : never;

/**
 * From a certain diagnostics type, get the value type of the store.
 * e.g. from Diagnostics<'MyDiagnostics', MyDiagnosticsStore> => MyDiagnosticsStore
 */
export type StoreOf<
    TDiagnostics extends Diagnostics<string, any>
> = TDiagnostics extends Diagnostics<string, infer TScenarioStore> ? TScenarioStore : never;

/**
 * From a certain diagnostics type, get the key/value shape of the store.
 * e.g. from Diagnostics<'MyDiagnostics', MyDiagnosticsStore> => { MyDiagnostics: () => MyDiagnosticsStore }
 *
 * This is what will be returned from the `init`
 */
export type ShapeOf<TDiagnostics extends Diagnostics<string, any>> = {
    [key in NameOf<TDiagnostics>]: () => StoreOf<TDiagnostics>;
};
