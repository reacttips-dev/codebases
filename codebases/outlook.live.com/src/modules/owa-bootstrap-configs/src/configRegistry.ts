import type { LazyAction, LazyBootModule } from 'owa-bundling-light';
import type { BootstrapOptions } from 'owa-bootstrap';
import { ModulesEnabledForAppBootstrap } from 'owa-workloads/lib/store/schema/Module';
import { lazyGetMailBootstrapOptions } from 'mail-bootstrap-config';
import { lazyGetCalendarBootstrapOptions } from 'calendar-bootstrap-config';
import { lazyGetPeopleBootstrapOptions } from 'people-bootstrap-config';
import { lazyGetFilesBootstrapOptions } from 'files-bootstrap-config';
import { lazyGetTimeStreamBootstrapOptions } from 'timestream-bootstrap-config';
import { lazyGetOrgExplorerBootstrapOptions } from 'orgexplorer-bootstrap-config';
import { lazyGetMailDeepLinkBootstrapOptions } from 'owa-mail-deeplink-bootstrap/lib/lazyFunctions';
import { lazyGetAppHostBootstrapOptions } from 'app-host-bootstrap-config';
import { lazyGetCalendarDeepLinkBootstrapOptions } from 'owa-calendar-deeplink-bootstrap/lib/lazyFunctions';
import type { BootStrategies } from 'owa-shared-start';
import type { SessionData } from 'owa-service/lib/types/SessionData';
import { isBootFeatureEnabled } from 'owa-metatags';
import { lazyMailFolderTreesParentContainer as lazyMailFolderTreesParentContainerLegacy } from 'owa-mail-folder-tree-container-view-legacy';
import { lazyMailFolderTreesParentContainer as lazyMailFolderTreesParentContainerGql } from 'owa-mail-folder-tree-container-view';
import { strategies, calendarStrategies, mailStrategies } from 'owa-boot-strategies';

export interface StartLazyConfig {
    options: LazyAction<
        (
            sessionPromise: Promise<SessionData | undefined>,
            strategies?: BootStrategies
        ) => Promise<BootstrapOptions>,
        LazyBootModule<any>
    >;
    strategies?: BootStrategies;
}

type ModuleConfigMap = {
    [P in ModulesEnabledForAppBootstrap]: StartLazyConfig;
};

export const moduleToConfigMap: ModuleConfigMap = {
    Mail: {
        options: lazyGetMailBootstrapOptions,
        strategies: {
            folderViewStrategy: isBootFeatureEnabled('gqlfolders')
                ? lazyMailFolderTreesParentContainerGql
                : lazyMailFolderTreesParentContainerLegacy,
            ...strategies,
            ...mailStrategies,
        },
    },
    Calendar: {
        options: lazyGetCalendarBootstrapOptions,
        strategies: {
            ...strategies,
            ...calendarStrategies,
        },
    },
    People: {
        options: lazyGetPeopleBootstrapOptions,
        strategies,
    },
    FilesHub: {
        options: lazyGetFilesBootstrapOptions,
        strategies,
    },
    OutlookSpaces: {
        options: lazyGetTimeStreamBootstrapOptions,
        strategies,
    },
    MailDeepLink: {
        options: lazyGetMailDeepLinkBootstrapOptions,
        strategies,
    },
    OrgExplorer: {
        options: lazyGetOrgExplorerBootstrapOptions,
        strategies,
    },
    AppHost: {
        options: lazyGetAppHostBootstrapOptions,
        strategies,
    },
    CalendarDeepLink: {
        options: lazyGetCalendarDeepLinkBootstrapOptions,
        strategies,
    },
};
