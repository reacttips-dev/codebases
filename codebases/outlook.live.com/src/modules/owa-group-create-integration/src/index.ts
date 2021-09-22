import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GroupCreate" */ './lazyIndex')
);

// Exported actions
export const lazyCreateGroup = new LazyImport(lazyModule, m => m.createGroup);

export { UserType } from 'owa-group-crud-contract/lib/schema/groupCrudInfo';
