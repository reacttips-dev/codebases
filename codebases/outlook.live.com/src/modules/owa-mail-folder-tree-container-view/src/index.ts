import { LazyImport, LazyBootModule, LazyAction, LazyModule } from 'owa-bundling-light';

// We don't want this to be a lazy component because it needs to be loaded and ready to render
// during boot
export const lazyMailFolderTreesParentContainer = new LazyImport(
    new LazyBootModule(
        () => import(/* webpackChunkName: "MailFolderTreesParentGql" */ './lazyIndex')
    ),
    m => m.MailFolderTreesParentContainer
);

export const lazyToggleFolderTreeCollapsed = new LazyAction(
    new LazyModule(
        () =>
            import(
                /* webpackChunkName: "FolderExpansion" */ './operations/toggleFolderTreeCollapsed'
            )
    ),
    m => m.toggleFolderTreeCollapsed
);

export const lazyPrimaryMailFolderHierarchyTreeDocument = new LazyImport(
    new LazyBootModule(
        () => import('./components/__generated__/PrimaryMailFolderHierarchyQuery.interface')
    ),
    m => m.PrimaryMailFolderHierarchyDocument
);

export const lazyFolderHierarchyConfigurationQueryDocument = new LazyImport(
    new LazyBootModule(
        () => import('./graphql/__generated__/FolderHierarchyConfigurationQuery.interface')
    ),
    m => m.FolderHierarchyConfigurationQueryDocument
);

export type {
    PrimaryMailFolderHierarchyQuery,
    PrimaryMailFolderHierarchyQueryVariables,
} from './components/__generated__/PrimaryMailFolderHierarchyQuery.interface';
