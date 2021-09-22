import { mutator } from 'satcheljs';
import type { MailRibbonGroup } from '../store/schema/mailRibbonGroup';
import type { MailRibbonConfigStore } from '../store/schema/mailRibbonConfigStore';
import { getStore } from '../store/store';
import loadMailRibbonConfiguration from '../actions/loadMailRibbonConfiguration';
import { getMailRibbonConfigFromString } from '../util/getMailRibbonConfigFromString';
import isFeatureEnabled from 'owa-feature-flags/lib/utils/isFeatureEnabled';
import { RibbonId } from '../util/ribbonId';
import isCLPEnabled from 'owa-mail-protection/lib/utils/clp/isCLPEnabled';
import { protectionStore } from 'owa-mail-protection/lib/store/protectionStore';
import { isEncryptionAvailable } from '../util/isEncryptionAvailable';
import { isDeepLink } from 'owa-url';
import { isConsumer } from 'owa-session-store';

mutator(loadMailRibbonConfiguration, () => {
    /*
    WIP (ADO119406): This will eventually get the user's preferences, but right
    now gets default configuration.
    */
    const store = getStore();
    const mailRibbonDefaultConfig: MailRibbonConfigStore = getMailRibbonConfigFromString('');
    getStore().homeTab = mailRibbonDefaultConfig.homeTab;
    getStore().viewTab = mailRibbonDefaultConfig.viewTab;
    getStore().messageTab = mailRibbonDefaultConfig.messageTab;

    //filter out controls that are behind flights
    getStore().homeTab.layout = getHomeTabDefaultConfig(mailRibbonDefaultConfig.homeTab.layout);
    getStore().messageTab.layout = getMessageTabDefaultConfig(
        mailRibbonDefaultConfig.messageTab.layout
    );

    if (isFeatureEnabled('mon-tri-collapsibleFolderPane')) {
        store.homeTab.layout = removeRibbonToggleLeftPane(store.homeTab.layout);
    }
    if (!isFeatureEnabled('mon-ribbon-customization')) {
        getStore().homeTab.layout = removeRibbonCustomizationGroup(getStore().homeTab.layout);
        getStore().viewTab.layout = removeRibbonCustomizationGroup(getStore().viewTab.layout);
        getStore().messageTab.layout = removeRibbonCustomizationGroup(getStore().messageTab.layout);
    }
});

function removeRibbonCustomizationGroup(tabLayout: MailRibbonGroup[]) {
    return tabLayout.filter(
        (menuItem: MailRibbonGroup) => menuItem.groupId != RibbonId.Group_RibbonCustomizer
    );
}
function removeRibbonToggleLeftPane(tabLayout: MailRibbonGroup[]) {
    tabLayout.forEach(menuItem => {
        if (menuItem.groupId == RibbonId.Group_New) {
            menuItem.controlIds = menuItem.controlIds.filter(
                controlId => controlId != RibbonId.ToggleLeftPane
            );
        }
    });

    return tabLayout;
}

function getHomeTabDefaultConfig(homeTab: MailRibbonGroup[]): MailRibbonGroup[] {
    if (!isFeatureEnabled('mon-ribbon-postSdf')) {
        //this contains all the groups that should only be rendered if the postSdf flight is on
        const groupIdsInPostSdfFlight: RibbonId[] = [];

        //this contains all the buttons that should only be rendered if the postSdf flight is on
        const actionIdsInPostSdfFlight: RibbonId[] = [RibbonId.AddressBook];

        //removes all groups in groupIdsInPostSdfFlight from the homeTab
        homeTab = homeTab.filter(
            (menuItem: MailRibbonGroup) => !groupIdsInPostSdfFlight.includes(menuItem.groupId)
        );

        //removes all buttons in actionIdsInPostSdfFlight from the homeTab
        homeTab = homeTab.map((menuItem: MailRibbonGroup) => {
            return {
                groupId: menuItem.groupId,
                controlIds: menuItem.controlIds.filter(
                    (actionId: RibbonId) => !actionIdsInPostSdfFlight.includes(actionId)
                ),
                groupName: menuItem.groupName,
            };
        });
    }

    // Consumer does not get to discover groups
    if (isConsumer()) {
        homeTab = homeTab.map((menuItem: MailRibbonGroup) => {
            return {
                groupId: menuItem.groupId,
                controlIds: menuItem.controlIds.filter(
                    (actionId: RibbonId) => actionId != RibbonId.BrowseGroups
                ),
                groupName: menuItem.groupName,
            };
        });
    }

    return homeTab;
}

/**
 * Because the message tab has some buttons currently in a flight,
 * some buttons should be conditionally rendered. This function
 * handles removing the buttons that should not be rendered.
 * @param messageTab SLRMenuItem[] containing all the default menu items in the message tab
 * @returns SLRMenuItem[] containing all the menu items
 * in the message tab that should be rendered in the SLR
 */
function getMessageTabDefaultConfig(messageTab: MailRibbonGroup[]): MailRibbonGroup[] {
    if (!isFeatureEnabled('mon-ribbon-postSdf')) {
        //this contains all the groups that should only be rendered if the postSdf flight is on
        const groupIdsInPostSdfFlight: RibbonId[] = [
            RibbonId.Group_Clipboard,
            RibbonId.Group_ImmersiveReader,
            RibbonId.Group_Names,
            RibbonId.Group_Voice,
            RibbonId.Group_Speech,
        ];

        //this contains all the buttons that should only be rendered if the postSdf flight is on
        const actionIdsInPostSdfFlight: RibbonId[] = [
            RibbonId.AssignPolicy,
            RibbonId.FlagUnflag,
            RibbonId.ImmersiveReader,
        ];

        //removes all groups in groupIdsInPostSdfFlight from the messageTab
        messageTab = messageTab.filter(
            (menuItem: MailRibbonGroup) => !groupIdsInPostSdfFlight.includes(menuItem.groupId)
        );

        //removes all buttons in actionIdsInPostSdfFlight from the messageTab
        messageTab = messageTab.map((menuItem: MailRibbonGroup) => {
            return {
                groupId: menuItem.groupId,
                controlIds: menuItem.controlIds.filter(
                    (actionId: RibbonId) => !actionIdsInPostSdfFlight.includes(actionId)
                ),
                groupName: menuItem.groupName,
            };
        });
    }

    const { clpLabels } = protectionStore;
    if (!isCLPEnabled() || !clpLabels || !clpLabels.some(label => label.isLabelEnabled)) {
        messageTab = messageTab.filter(
            (menuItem: MailRibbonGroup) => menuItem.groupId != RibbonId.Group_Sensitivity
        );
    }
    if (!isEncryptionAvailable()) {
        messageTab = messageTab.filter(
            (menuItem: MailRibbonGroup) => menuItem.groupId != RibbonId.Group_Encrypt
        );
    }

    if (isDeepLink()) {
        messageTab = messageTab.filter(
            (menuItem: MailRibbonGroup) => menuItem.groupId != RibbonId.Group_PopoutDraft
        );
    }

    return messageTab;
}
