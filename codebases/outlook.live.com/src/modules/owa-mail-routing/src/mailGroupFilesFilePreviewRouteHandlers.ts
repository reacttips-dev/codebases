import mailGroupFilesRouteHandler from './mailGroupFilesRouteHandler';
import { mailSxSCleanupRouteHandler } from './mailSxSRouteHandler';
import type { MailGroupRouteParameters } from './utils/mailGroupRouteSettings';
import { lazyResetSxSViewStoreAction } from 'owa-group-files-hub-store/lib/lazyFunctions';

export async function mailGroupFilesSPCleanupRouteHandler(
    oldRoute?: string[],
    oldParameters?: any,
    newRoute?: string[],
    newParameters?: any
): Promise<boolean> {
    await lazyResetSxSViewStoreAction.importAndExecute('browserNavigation');
    return false;
}

export async function mailGroupFilesSxSCleanupRouteHandler() {
    return mailSxSCleanupRouteHandler();
}

export async function mailGroupFilesSXSNavigationRouteHandler(
    parameters: MailGroupRouteParameters,
    allParameters?: string[] | undefined
) {
    await mailGroupFilesRouteHandler(parameters, undefined);
}
