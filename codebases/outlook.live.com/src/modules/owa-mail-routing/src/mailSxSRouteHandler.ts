import mailRowFolderRouteHandler, { MailRowRouteParameters } from './mailRowRouteHandler';
import { lazyForceCloseSxS, lazyOnPendingNavigation, getActiveSxSId } from 'owa-sxs-store';

export interface MailSxSRouteParameters extends MailRowRouteParameters {
    itemId: string;
    attachmentId: string;
}

export async function mailSxSNavigationRoutehandler(
    parameters: MailSxSRouteParameters
): Promise<void> {
    mailRowFolderRouteHandler(parameters);
    const onPendingNavigation = await lazyOnPendingNavigation.import();
    const sxsId: string = getActiveSxSId(window);
    onPendingNavigation(parameters.attachmentId, sxsId);
}

export async function mailSxSCleanupRouteHandler(
    oldRoute?: string[],
    oldParameters?: any,
    newRoute?: string[],
    newParameters?: any
): Promise<boolean> {
    const stillInSxS = !!newRoute && newRoute.some(value => value == 'sxs');
    if (!stillInSxS) {
        const sxsId: string = getActiveSxSId(window);
        const forceCloseSxS = await lazyForceCloseSxS.import();
        forceCloseSxS('browserNavigation', sxsId);
    }

    return false;
}
