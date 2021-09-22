import { lazySelectGroup } from 'owa-mail-folder-forest-actions';
import {
    lazyGroupHeaderCommandBarAction,
    lazyGroupHeaderNavigationButton,
} from 'owa-group-header-actions';
import { lazySetSharePointItemsViewNavigationTargetPath } from 'owa-group-fileshub-actions';
import {
    MailGroupRouteParameters,
    ensureValidGroupSmtpAddress,
} from './utils/mailGroupRouteSettings';
import { logUsage } from 'owa-analytics';
import { getSourceQueryParam } from 'owa-querystring';

export default async function mailGroupFilesRouteHandler(
    parameters: MailGroupRouteParameters,
    allParameters?: string[] | undefined
) {
    const groupSmtp = ensureValidGroupSmtpAddress(parameters);

    if (!groupSmtp) {
        return;
    }
    logUsage('MailGroupFilesRouteHandlerEvent', { source: getSourceQueryParam() });

    const commandBarAction = await lazyGroupHeaderCommandBarAction.import();
    const groupHeaderNavigationButton = await lazyGroupHeaderNavigationButton.import();

    commandBarAction(groupHeaderNavigationButton.Files);
    await lazySelectGroup.importAndExecute(groupSmtp, 'groups');

    const spPath = allParameters && allParameters.length > 2 ? allParameters[2] : null;
    const setSharePointItemsViewNavigationTargetPath = await lazySetSharePointItemsViewNavigationTargetPath.import();
    if (spPath) {
        const realSpPath = '/' + spPath;
        setSharePointItemsViewNavigationTargetPath(groupSmtp, realSpPath);
    } else {
        setSharePointItemsViewNavigationTargetPath(groupSmtp, '');
    }
}
