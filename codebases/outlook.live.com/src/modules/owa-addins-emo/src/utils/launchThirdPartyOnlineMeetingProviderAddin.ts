import {
    isExtensibilityContextInitialized,
    getExtensibilityContext,
    AddinCommand,
    setUilessExtendedAddinCommand,
    IExtendedAddinCommand,
    IAddinCommandTelemetry,
} from 'owa-addins-store';
import ExtensibilityContext from 'owa-service/lib/contract/ExtensibilityContext';
import Control from 'owa-service/lib/contract/Control';
import Group from 'owa-service/lib/contract/Group';
import Tab from 'owa-service/lib/contract/Tab';
import { ExtendedAddinCommand, AddinCommandTelemetry } from 'owa-addins-schema';
import Extension from 'owa-service/lib/contract/Extension';
import { thirdPartyOnlineMeetingProviderDetails } from 'owa-calendar-event-option/lib/components/ThirdPartyOnlineMeetingProviderList';
import { isFeatureEnabled } from 'owa-feature-flags';

export default function launchThirdPartyOnlineMeetingProviderAddin(
    hostItemIndex: string,
    defaultOnlineMeetingProvider: string
): boolean {
    if (isExtensibilityContextInitialized()) {
        let extensionToStore: Extension = null;
        let controladdin: Control;
        let tabaddin: Tab;
        let groupaddin: Group;

        /* The following lines are for testing purpose
            One of the flags is to be switched on
            For substituting the defaultOnlineMeetingProvider Value
        */
        if (isFeatureEnabled('addin-everyMeetingOnlineClient-Zoom')) {
            defaultOnlineMeetingProvider = 'Zoom';
        } else if (isFeatureEnabled('addin-everyMeetingOnlineClient-BlueJeans')) {
            defaultOnlineMeetingProvider = 'BlueJeans';
        } else if (isFeatureEnabled('addin-everyMeetingOnlineClient-GoToMeeting')) {
            defaultOnlineMeetingProvider = 'GoToMeeting';
        }

        /* End of test code
            To be removed after cal server starts sending
            3P values as defaultOnlineMeetingProvider values
        */

        const allThirdPartyMeetingClientsMap = new Map(
            thirdPartyOnlineMeetingProviderDetails.map(thirdPartyOnlineMeetingProvider => [
                thirdPartyOnlineMeetingProvider.Id,
                thirdPartyOnlineMeetingProvider,
            ])
        );

        const extensibilityContext = getExtensibilityContext() as ExtensibilityContext;

        for (let extensions of extensibilityContext?.Extensions) {
            /* Check if the defaultOnlineMeetingProvider value from the server
                is installed by the user or not
            */
            if (
                defaultOnlineMeetingProvider ==
                (allThirdPartyMeetingClientsMap.has(extensions.Id)
                    ? allThirdPartyMeetingClientsMap.get(extensions.Id).Name
                    : false)
            ) {
                extensionToStore = extensions;
                break;
            }
        }

        if (!extensionToStore) {
            /* The defaultOnlineMeetingProvider is not installed by the user */
            return false;
        }

        try {
            tabaddin = extensionToStore?.ExtensionPointCollection
                ?.AppointmentOrganizerCommandSurface?.Tabs[0] as Tab;
            groupaddin = tabaddin?.Groups[0] as Group;
            controladdin = groupaddin?.Controls[0] as Control;

            const addincommand: AddinCommand = new AddinCommand(
                controladdin as Control,
                tabaddin as Tab,
                groupaddin as Group,
                extensionToStore as Extension
            );

            const extendedAddinCommand = new ExtendedAddinCommand(
                addincommand,
                new AddinCommandTelemetry() as IAddinCommandTelemetry
            ) as IExtendedAddinCommand;

            setUilessExtendedAddinCommand(
                extendedAddinCommand.controlId,
                extendedAddinCommand,
                hostItemIndex
            );
            return true;
        } catch (e) {
            /* Addin could not be auto launched
                return false
            */
            return false;
        }
    }
    return false;
}
