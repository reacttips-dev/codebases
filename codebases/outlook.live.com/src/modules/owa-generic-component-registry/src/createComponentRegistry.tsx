import * as React from 'react';

export interface UseComponentRegistration<T> {
    (ref: React.Ref<T>, componentId: string): React.Ref<T>;
}

export interface GetInstancesFromRegistry<T> {
    (id: string): (React.RefObject<T> | React.MutableRefObject<T>)[];
}

/**
 * Creates a component registry for a given component type. Meant to be used to create singleton
 * stores for a type of component.
 *
 * Components stored in the registry registry are stored as object-style references
 * (either RefObjects or MutableRefObjects). If they are function references, a corresponding
 * object reference will be put in the registry instead.
 */
export const createComponentRegistry = <T extends any>() => {
    const componentRegistry = new Map<string, (React.RefObject<T> | React.MutableRefObject<T>)[]>();

    const useComponentRegistration: UseComponentRegistration<T> = (
        originalRef: React.Ref<T> | undefined,
        componentId: string
    ): React.Ref<T> => {
        // The ref we store to the registry
        let refForRegistry: React.RefObject<T> | React.MutableRefObject<T>;
        // The ref we return from the hook
        let refToReturn: React.Ref<T>;
        if (originalRef instanceof Function) {
            refForRegistry = React.createRef();
            refToReturn = (instance: T) => {
                // cast to any to override read/write constraints on createRef.
                //
                // since this is conditionally called, we can't use a hook here
                // without breaking react (e.g. if a component changes)
                (refForRegistry as any).current = instance;
                originalRef(instance);
            };
        } else if (originalRef == undefined) {
            refForRegistry = refToReturn = React.createRef();
        } else {
            refForRegistry = refToReturn = originalRef;
        }

        React.useEffect(() => {
            // Register the component on mount
            if (!componentRegistry.has(componentId)) {
                componentRegistry.set(componentId, []);
            }
            const components = componentRegistry.get(componentId);
            components.push(refForRegistry);

            return () => {
                // Remove the ref from the list in the registry on unmount
                if (components == null) {
                    return;
                }

                const index = components.indexOf(refForRegistry);
                if (index == -1) {
                    return;
                }

                components.splice(index, 1);
            };
        }, [refForRegistry, componentId]);

        return refToReturn;
    };

    const getInstancesFromRegistry: GetInstancesFromRegistry<T> = (
        id: string
    ): (React.RefObject<T> | React.MutableRefObject<T>)[] => {
        return componentRegistry.get(id) || [];
    };

    return {
        useComponentRegistration,
        getInstancesFromRegistry,
    };
};
