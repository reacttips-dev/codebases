import { LazyImport, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "GroupsDiscover" */ './lazyIndex')
);

// Exported actions
export const lazyGroupsDiscover = new LazyImport(lazyModule, m => m.discoverGroups);

export { UserType } from 'owa-groups-discover/lib/store/schema/groupsDiscoverInfo';
export type {
    EnterpriseGroup,
    GroupInfo,
} from 'owa-groups-discover/lib/store/schema/groupsDiscoverInfo';
