import * as React from 'react';
import { ApolloProvider } from '@apollo/client';
import {
    ReactBroadComponentType,
    LazyComponent,
    LazyModule,
    createLazyComponent,
    ErrorHandlerFunction,
    ErrorHandlerComponent,
} from 'owa-bundling';
import { getApolloClient } from 'owa-apollo';

/**
 * VSO - 101850 - Remove createLazyApolloComponent once apollo is enabled as boot flight
 * This wraps the actual component (which is lazy initialized) with ApolloProvider
 */
export function createLazyApolloComponent<TProps, TModule, TInnerRef, TPlaceholderRef = void>(
    lazyModule: LazyModule<TModule>,
    getter: (module: TModule) => ReactBroadComponentType<TProps, TInnerRef>,
    placeholder?: ReactBroadComponentType<TProps, TPlaceholderRef>,
    importErrorHandler?: ErrorHandlerFunction | ErrorHandlerComponent
): LazyComponent<TProps, TInnerRef, TPlaceholderRef> {
    const innerGetter = (m: TModule) => {
        const InnerComponent = getter(m);
        return props => (
            <ApolloProvider client={getApolloClient()}>
                <InnerComponent {...props} />
            </ApolloProvider>
        );
    };

    return createLazyComponent<TProps, TModule, TInnerRef, TPlaceholderRef>(
        lazyModule,
        innerGetter,
        placeholder,
        importErrorHandler
    );
}
