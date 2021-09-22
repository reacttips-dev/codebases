import mailFolderRouteHandler from './mailFolderRouteHandler';
import mailCategoryRouteHandler from './mailCategoryRouteHandler';
import mailGroupFilesRouteHandler from './mailGroupFilesRouteHandler';
import {
    mailGroupFilesSPCleanupRouteHandler,
    mailGroupFilesSXSNavigationRouteHandler,
    mailGroupFilesSxSCleanupRouteHandler,
} from './mailGroupFilesFilePreviewRouteHandlers';
import mailGroupRouteHandler from './mailGroupRouteHandler';
import mailRowRouteHandler, { mailRowFolderRouteHandler } from './mailRowRouteHandler';
import mailRowCleanupRouteHandler from './mailRowCleanupRouteHandler';
import { mailSxSCleanupRouteHandler, mailSxSNavigationRoutehandler } from './mailSxSRouteHandler';
import { inClientStoreRouteHandler } from 'owa-addins-marketplace-routing';
import personaRouteHandler from './personaRouteHandler';
import privateDistributionListRouteHandler from './privateDistributionListRouteHandler';
import { isFeatureEnabled } from 'owa-feature-flags';
import { initializeDomainConnectRoutes } from 'owa-domain-connect';
import { isGroupsEnabled } from 'owa-account-capabilities/lib/isGroupsEnabled';
import { initializeOptionRoutes } from 'owa-options-router';
import {
    mailComposeCleanupRouteHandler,
    mailComposeNavigationRouteHandler,
} from './mailComposeRouteHandler';
import type { RegisterRouteFunction } from 'owa-router';
import { mailHelpPaneRouteHandler } from './mailHelpPaneRouteHandler';
import searchRouteHandler, { searchCleanupRouteHandler } from './searchRouteHandler';
import changePhotoRouteHandler from './changePhotoRouteHandler';
import feedbackPaneRouteHandler from './feedbackPaneRouteHandler';

export function initializeMailRoutes(registerMailRoute: RegisterRouteFunction) {
    registerMailRoute('/help', mailHelpPaneRouteHandler);
    registerMailRoute('/feedback', feedbackPaneRouteHandler);
    registerMailRoute(
        '/compose',
        mailComposeNavigationRouteHandler,
        mailComposeCleanupRouteHandler
    );
    registerMailRoute(
        '/compose/:draftId',
        mailComposeNavigationRouteHandler,
        mailComposeCleanupRouteHandler
    );

    registerMailRoute(
        '/search/id/:rowId/sxs/:itemId/:attachmentId',
        mailSxSNavigationRoutehandler,
        searchCleanupRouteHandler
    );
    registerMailRoute(
        '/search/id/:rowId/sxs/:attachmentId',
        mailSxSNavigationRoutehandler,
        searchCleanupRouteHandler
    );
    registerMailRoute('/search/id/:rowId', mailRowRouteHandler, searchCleanupRouteHandler);
    registerMailRoute('/search', searchRouteHandler, searchCleanupRouteHandler);

    registerMailRoute('/mail/id/:rowId', mailRowFolderRouteHandler);

    initializeGroupRoutes(registerMailRoute);

    initializeOptionRoutes(registerMailRoute);

    initializeDomainConnectRoutes(registerMailRoute);

    registerMailRoute('/persons/:favoriteNodeId', personaRouteHandler);

    if (isFeatureEnabled('peo-favoritePdls')) {
        registerMailRoute('/contactlists/:favoriteNodeId', privateDistributionListRouteHandler);
    }

    registerMailRoute('/category/:categoryId', mailCategoryRouteHandler);

    registerMailRoute('/inclientstore', inClientStoreRouteHandler);
    registerMailRoute('/inclientstore/assetid/:assetId', inClientStoreRouteHandler);
    registerMailRoute(
        '/inclientstore/assetid/:assetId/campaignid/:campaignId/providerid/:providerId',
        inClientStoreRouteHandler
    );

    registerMailRoute('/changephoto', changePhotoRouteHandler);

    registerMailRoute(
        '/:folderId/id/:rowId/sxs/:itemId/:attachmentId',
        mailSxSNavigationRoutehandler,
        mailSxSCleanupRouteHandler
    );

    registerMailRoute(
        '/:folderId/id/:rowId/sxs/:attachmentId',
        mailSxSNavigationRoutehandler,
        mailSxSCleanupRouteHandler
    );

    registerMailRoute(
        '/:folderId/compose/:draftId',
        mailComposeNavigationRouteHandler,
        mailComposeCleanupRouteHandler
    );

    registerMailRoute(
        '/:folderId/compose',
        mailComposeNavigationRouteHandler,
        mailComposeCleanupRouteHandler
    );

    registerMailRoute(
        '/:folderId/id/:rowId',
        mailRowFolderRouteHandler,
        mailRowCleanupRouteHandler
    );

    registerMailRoute('/:folderId', mailFolderRouteHandler, mailRowCleanupRouteHandler);
}

function initializeGroupRoutes(registerMailRoute: RegisterRouteFunction) {
    if (isGroupsEnabled()) {
        registerMailRoute('/group/:groupDomain/:groupAlias', mailGroupRouteHandler);
        registerMailRoute('/group/:groupDomain/:groupAlias/email', mailGroupRouteHandler);
        registerMailRoute('/group/:groupDomain/:groupAlias/email/id/:rowId', mailGroupRouteHandler);
        registerMailRoute(
            '/group/:groupDomain/:groupAlias/action/:actionId',
            mailGroupRouteHandler
        );

        initializeGroupFilesRoutes(registerMailRoute);
    }
}

function initializeGroupFilesRoutes(registerMailRoute: RegisterRouteFunction) {
    // Order matters here
    registerMailRoute(
        '/group/:groupDomain/:groupAlias/files/sxs/sp/:spFileId/?((\\w|.)*)',
        mailGroupFilesSXSNavigationRouteHandler,
        mailGroupFilesSPCleanupRouteHandler
    );

    registerMailRoute(
        '/group/:groupDomain/:groupAlias/files/sxs/attachment/:attachmentId/?((\\w|.)*)',
        mailGroupFilesSXSNavigationRouteHandler,
        mailGroupFilesSxSCleanupRouteHandler
    );

    registerMailRoute(
        '/group/:groupDomain/:groupAlias/files/?((\\w|.)*)',
        mailGroupFilesRouteHandler
    );
}
