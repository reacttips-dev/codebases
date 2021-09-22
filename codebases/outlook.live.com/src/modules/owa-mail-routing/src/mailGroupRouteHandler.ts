import { lazyEditGroup } from 'owa-group-edit-integration';
import { lazyEditGroupV2 } from 'owa-group-edit-integration-v2';
import { lazyOpenGroupSettings } from 'owa-group-settings-integration';
import { lazySelectGroup } from 'owa-mail-folder-forest-actions';
import {
    lazyGroupHeaderCommandBarAction,
    lazyGroupHeaderNavigationButton,
} from 'owa-group-header-actions';
import {
    lazyInitializeDeeplink,
    lazyDeeplinkActionType,
    lazyDeeplinkOnGroupDetailsLoadError,
    lazyDeeplinkOnGroupDetailsLoaded,
} from 'owa-group-deeplinkaction-integration';
import {
    MailGroupRouteParameters,
    ensureValidGroupSmtpAddress,
} from './utils/mailGroupRouteSettings';
import selectRow from './selectRow';
import { logUsage } from 'owa-analytics';
import { getSourceQueryParam } from 'owa-querystring';
import { IsShareableCRUDEnabled } from 'owa-groups-shared-store/lib/utils/shareableCRUDFlight';

export default async function mailGroupRouteHandler(parameters: MailGroupRouteParameters) {
    let groupSmtp = ensureValidGroupSmtpAddress(parameters);

    if (!groupSmtp) {
        return;
    }

    groupSmtp = groupSmtp.toLowerCase();
    logUsage('MailGroupRouteHandlerEvent', { source: getSourceQueryParam() });

    let onGroupLoadSuccess = null;
    let onGroupLoadError = null;
    let onGroupLoadPromise: Promise<void>;

    if (parameters.actionId) {
        // import here since we expect to use this
        await lazyDeeplinkOnGroupDetailsLoaded.import();

        onGroupLoadPromise = new Promise((resolve, reject) => {
            onGroupLoadSuccess = () => {
                lazyDeeplinkOnGroupDetailsLoaded.importAndExecute();
                resolve();
            };

            onGroupLoadError = () => {
                lazyDeeplinkOnGroupDetailsLoadError.importAndExecute();
                resolve();
            };
        });
    }

    await lazySelectGroup.importAndExecute(
        groupSmtp,
        'groups',
        onGroupLoadSuccess,
        onGroupLoadError
    );

    const commandBarAction = await lazyGroupHeaderCommandBarAction.import();
    const groupHeaderNavigationButton = await lazyGroupHeaderNavigationButton.import();
    commandBarAction(groupHeaderNavigationButton.Email);

    if (parameters.actionId) {
        const DeeplinkActionType = await lazyDeeplinkActionType.import();

        // if this is a valid deeplink action, set up the deeplink dialog
        const action = DeeplinkActionType[parameters.actionId.toLowerCase()];
        if (action != null) {
            const openGroupSettings = async (groupSmtp: string) => {
                const openGroupSettings = await lazyOpenGroupSettings.import();
                openGroupSettings(groupSmtp);
            };
            const editGroup = async (groupSmtp: string) => {
                if (IsShareableCRUDEnabled()) {
                    await lazyEditGroupV2.importAndExecute(groupSmtp, 'GroupHub_CommandBar');
                } else {
                    const editGroup = await lazyEditGroup.import();
                    editGroup(groupSmtp);
                }
            };

            lazyInitializeDeeplink.importAndExecute(
                groupSmtp,
                action,
                openGroupSettings,
                editGroup
            );
        }
    }

    if (parameters.rowId) {
        selectRow(parameters.rowId);
    }

    if (onGroupLoadPromise) {
        await onGroupLoadPromise;
    }
}
