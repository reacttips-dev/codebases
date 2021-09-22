import * as React from 'react';
import { createLazyComponent, LazyModule, LazyImport } from 'owa-bundling';
import { observer } from 'mobx-react-lite';
import { getStore } from './store/store';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "FavoritePdlEditor" */ './lazyIndex')
);

export let lazyCreateNewPdlFavoriteClickedAction = new LazyImport(
    lazyModule,
    m => m.createNewPdlFavoriteClickedAction
);

export let lazyEditFavoritePdlClickedAction = new LazyImport(
    lazyModule,
    m => m.editFavoritePdlClickedAction
);

const PrivateDistributionlistModalEditorInner = createLazyComponent(
    lazyModule,
    m => m.PrivateDistributionlistModalEditor
);
// Wrapper component that defers lazy loading of the wrapped component until
// the PDL editor until it is actually opened.
//
// This will slightly increase the size of the importing module's bundle,
// as it has to initialize the immersive reader store, but it's better than
// importing the component and store logic automatically.
//
// This is all because the PrivateDistributionlistModalEditorInner is unconditionally
// mounted inside of MailModule.
export const PrivateDistributionlistModalEditor = observer(() =>
    getStore().currentState === 'closed' ? null : <PrivateDistributionlistModalEditorInner />
);
