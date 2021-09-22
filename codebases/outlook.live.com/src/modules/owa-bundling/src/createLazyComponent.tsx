import * as React from 'react';
import { LazyModule, LazyImport } from 'owa-bundling-light';
import useLazyImport from './utils/useLazyImport';
import canComponentAcceptRef from './utils/canComponentAcceptRef';
import type {
    default as BroadComponentType,
    EffectiveComponentType,
} from './types/BroadComponentType';

/**
 * Return component type of createLazyComponent
 *
 * Uses the common props of the lazy & placeholder component,
 * with a ref to one of the two components, depending on if the
 * inner component has been loaded yet.
 */
export type LazyComponent<
    TComponentProps,
    TPrimaryComponentRef,
    TPlaceholderComponentRef = TPrimaryComponentRef
> = React.ForwardRefExoticComponent<
    React.PropsWithoutRef<React.PropsWithChildren<TComponentProps>> &
        React.RefAttributes<
            | TPrimaryComponentRef
            | (TPlaceholderComponentRef extends void ? never : TPlaceholderComponentRef)
        >
>;

export type ErrorHandlerFunction = (reason: any) => void;
export type ErrorHandlerComponent = React.ComponentType<{ error?: any }>;

// For usage of this API, see the owa-bundling README
function createLazyComponent<TProps, TModule, TInnerRef, TPlaceholderRef = void>(
    lazyModule: LazyModule<TModule>,
    getter: (module: TModule) => BroadComponentType<TProps, TInnerRef>,
    placeholder?: BroadComponentType<TProps, TPlaceholderRef>,
    importErrorHandler?: ErrorHandlerFunction | ErrorHandlerComponent
): LazyComponent<TProps, TInnerRef, TPlaceholderRef> {
    let lazyImport = new LazyImport(lazyModule, getter);

    return React.forwardRef(function LazyComponent(
        props: TProps,
        ref: React.Ref<TInnerRef | (TPlaceholderRef extends void ? never : TPlaceholderRef)>
    ) {
        const [error, setError] = React.useState<any>(undefined);
        const ErrorView: any =
            typeof importErrorHandler == 'object' ? importErrorHandler : undefined;

        const InnerComponent: BroadComponentType<TProps, TInnerRef> | undefined = useLazyImport(
            lazyImport,
            ErrorView ? setError : (importErrorHandler as ErrorHandlerFunction)
        );

        if (ErrorView && error) {
            return <ErrorView error={error} />;
        }

        const _InnerComponent = (InnerComponent || placeholder) as EffectiveComponentType<
            typeof InnerComponent
        >;

        if (!_InnerComponent) {
            return null;
        }

        if (canComponentAcceptRef(_InnerComponent)) {
            // The type here we are casting to is equivalent under all legal instantiations of
            // TProps and TRef. However, they do not typecheck to the same value in their generic
            // form.
            //
            // our hunch is that this is because React.PropsWithoutRef is declared as
            //   'ref' extends keyof P
            //      ? Pick<P, Exclude<keyof P, 'ref'>>
            //      : P;
            //
            // which is functionally equivalent for either side of the conditional type, but there is no way
            // for typescript to know that, so we have to construct the *exact* same type that typescript
            // expects before expanding generics so it will match.
            //
            // it works (and exposes unhandled issues w/ refs to TInnerRef vs TPlaceholderRef) if we change the
            // definition in node_modules to the left side of the conditional branch.
            const castProps = { ...props, ref: ref } as JSX.IntrinsicAttributes &
                TProps &
                React.PropsWithoutRef<TProps> &
                React.RefAttributes<TInnerRef>;
            return <_InnerComponent {...castProps} />;
        } else {
            return <_InnerComponent {...props} />;
        }
    });
}
export default createLazyComponent;
