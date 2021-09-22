import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "ReadWriteRecipientWellFabric" */ './lazyIndex')
);

export const UncontrolledExtendedRecipientWell = createLazyComponent(
    lazyModule,
    m => m.UncontrolledExtendedRecipientWell
);
export { RecipientWell } from './components/PeoplePickerTypes';
