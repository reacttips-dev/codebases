import { isFeatureEnabled } from 'owa-feature-flags';
import { lazyAddGroupMember } from 'owa-group-add-member-integration';
import { lazyAddGroupMemberV2 } from 'owa-group-add-member-integration-v2';
import { getGroupIdFromTableQuery } from 'owa-group-utils';
import { lazyEditGroup } from 'owa-group-edit-integration';
import { lazyEditGroupV2 } from 'owa-group-edit-integration-v2';
import { lazyToggleFavoriteGroup } from 'owa-group-favorite-button';
import { lazyIsGroupHeaderNavigationOnEmail } from 'owa-group-header-actions';
import { getLeftNavGroupsStore } from 'owa-group-left-nav';
import { lazyRemoveGroupFromLeftNav } from 'owa-group-left-nav-actions';
import { lazyLoadGroupAction, lazySetGroupIsSubscribed } from 'owa-group-shared-actions';
import { getGroupsStore } from 'owa-groups-shared-store/lib/GroupsStore';
import {
    isFavoritingInProgress,
    lazyAddFavoritePersona,
    lazyRemoveFavoritePersona,
    lazyHandleToggleFavoritePersonaError,
} from 'owa-mail-favorites-store';
import getFavoriteIdForPersona from 'owa-mail-favorites-store/lib/selectors/getFavoritePersona';
import { lazySelectGroup, selectFolder } from 'owa-mail-folder-forest-actions';
import { getSelectedNode } from 'owa-mail-folder-forest-store';
import { getSelectedTableView } from 'owa-mail-list-store';
import { lazyNewMessage } from 'owa-mail-message-actions';
import {
    initializePersona as initializePersonaControl,
    PersonaConfig,
    PersonaIdentifiers,
    GetIsFavoritedPersonaCallback,
    FavoritePersonaCallback,
    ActionProperties,
    GetPresenceCallback,
} from 'owa-persona/lib/personaConfig';
import popoutReadingPane from 'owa-popout-utils/lib/utils/popoutReadingPane';
import folderNameToId from 'owa-session-store/lib/utils/folderNameToId';
import { lazyTryRegisterForPresenceUpdates } from 'owa-skype-for-business';
import getPresenceFromStore from 'owa-skype-for-business/lib/presenceManager/getPresenceFromStore';
import { trace } from 'owa-trace';
import getStartChatCallback from 'owa-skype-for-business/lib/chatManager/getStartChatCallback';
import {
    isPersonaInFavorites,
    isGroupInFavorites,
    lazyAddFavoriteGroup,
    lazyRemoveFavoriteGroup,
} from 'owa-favorites';
import {
    setLpcGroupDataUpdateListener,
    setLpcGroupMembersDataUpdateListener,
    setLpcGroupDeleteListener,
    setLpcUpdatePopupStateListener,
    setLpcGroupUpdateSmtpListener,
} from './lpcDataUpdateListeners';
import { IsShareableCRUDEnabled } from 'owa-groups-shared-store/lib/utils/shareableCRUDFlight';
import showTransferOwnershipGroupDialog from 'owa-group-settings/lib/components/TransferOwnershipGroupDialog';
import { lazySxSStoreModule, getActiveSxSId } from 'owa-sxs-store';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';

export default function initializePersona() {
    const config: PersonaConfig = {
        actionCallbacks: {
            composeMail: async (
                recipient?: string,
                subject?: string,
                body?: string,
                properties?: ActionProperties
            ) => {
                let groupId = null;
                let popout = false;
                let toEmailAddress = recipient
                    ? [
                          {
                              EmailAddress: recipient,
                              Name: properties ? properties.personaDisplayName : recipient,
                          },
                      ]
                    : undefined;

                const tableView = getSelectedTableView();
                const currentGroupId = tableView && getGroupIdFromTableQuery(tableView.tableQuery);

                const sxsId = getActiveSxSId(window);
                lazySxSStoreModule.import().then(sxsStoreModule => {
                    sxsStoreModule.tryCloseSxS('livePersonaCardCompose', sxsId);
                });

                if (
                    currentGroupId && // if we're not in a group this will be null
                    recipient &&
                    recipient.toLowerCase() === currentGroupId.toLowerCase() // Check if the recipient passed in is a group recipient and if it is for the current group.
                ) {
                    // If so, we need to check if
                    const isGroupHeaderNavigationOnEmail = await lazyIsGroupHeaderNavigationOnEmail.import();
                    popout = !isGroupHeaderNavigationOnEmail();

                    // And set compose to behave if we clicked send mail from within the group
                    groupId = currentGroupId;
                    toEmailAddress = undefined; // there's no need to pass in the group email address when group id is passed in
                }

                if (isFeatureEnabled('mon-cmp-newMessageInNewWindow')) {
                    popout = true;
                }

                lazyNewMessage.importAndExecute(
                    'LivePersonaCard',
                    groupId,
                    toEmailAddress,
                    subject,
                    body,
                    popout
                );
            },
            readMail: (mailId: string, properties?: ActionProperties) => {
                trace.info('Persona action callback: readMail');
                popoutReadingPane(mailId);
            },
            toggleSubscribeToGroup: (
                personaIdentifiers: PersonaIdentifiers,
                newIsSubscribedState: boolean
            ) => {
                personaIdentifiers.Smtp &&
                    lazySetGroupIsSubscribed.importAndExecute(
                        personaIdentifiers.Smtp,
                        newIsSubscribedState
                    );
            },
            editGroup: async (groupSmtpAddress: string) => {
                if (IsShareableCRUDEnabled()) {
                    await lazyEditGroupV2.importAndExecute(groupSmtpAddress, 'OWA_GroupCard');
                } else {
                    const editGroup = await lazyEditGroup.import();
                    editGroup(groupSmtpAddress);
                }
            },
            addGroupMembers: async (groupSmtpAddress: string) => {
                if (IsShareableCRUDEnabled()) {
                    await lazyAddGroupMemberV2.importAndExecute(groupSmtpAddress, 'OWA_GroupCard');
                } else {
                    const addGroupMember = await lazyAddGroupMember.import();
                    addGroupMember(groupSmtpAddress);
                }
            },
            updateMembership: async (
                personaIdentifiers: PersonaIdentifiers,
                groupMembershipScenarios:
                    | 'RemoveGroupMember'
                    | 'PromoteGroupMember'
                    | 'DemoteGroupOwner'
                    | 'AddGroupMember',
                successCount: number,
                failedCount: number,
                isSelf: boolean
            ) => {
                if (!personaIdentifiers.Smtp || successCount <= 0) {
                    return;
                }

                const groupId = personaIdentifiers.Smtp.toLowerCase();

                // Check if we're in the current group.
                // If not, then there's no need to reload as it will happen when navigating again to the group
                const tableView = getSelectedTableView();
                const currentGroupId = tableView && getGroupIdFromTableQuery(tableView.tableQuery);
                if (
                    getOwaWorkload() !== OwaWorkload.LeaveGroupOpx &&
                    groupId !== currentGroupId?.toLowerCase()
                ) {
                    return;
                }

                if (groupMembershipScenarios == 'RemoveGroupMember' && isSelf) {
                    // Navigate away from the group being left by selecting the inbox
                    selectFolder(
                        folderNameToId('inbox'),
                        'primaryFolderTree' /* treeType */,
                        'ResetInbox'
                    );

                    // Remove the group from Favorites if it was in the Favorites list
                    if (isGroupInFavorites(groupId)) {
                        toggleFavoriteGroup(groupId);
                    }
                    // Remove the group from the left nav
                    removeGroupFromLeftNav(groupId);

                    if (isFeatureEnabled('grp-TransferOwnership')) {
                        const groupsStore = getGroupsStore();
                        const group = groupsStore.groups.get(groupId);
                        //Show success dialog after user leaves group.
                        if (getOwaWorkload() === OwaWorkload.LeaveGroupOpx) {
                            showTransferOwnershipGroupDialog(
                                group.basicInformation.DisplayName,
                                true,
                                groupId
                            );
                        } else {
                            showTransferOwnershipGroupDialog(
                                group.basicInformation.DisplayName,
                                true
                            );
                        }
                    }
                } else {
                    const loadGroupAction = await lazyLoadGroupAction.import();
                    loadGroupAction(groupId);
                }
            },
            getStartChatCallback,
        },
        dataCallbacks: {},
        dataUpdateBroadcaster: {
            setGroupUpdateListener: setLpcGroupDataUpdateListener,
            setGroupMembersUpdateListener: setLpcGroupMembersDataUpdateListener,
            setGroupDeleteListener: setLpcGroupDeleteListener,
            updatePopupStateListener: setLpcUpdatePopupStateListener,
            setGroupUpdateSmtpListener: setLpcGroupUpdateSmtpListener,
        },
    };

    config.actionCallbacks.favoritePersona = isFeatureEnabled('tri-favorites-roaming')
        ? LPCFavoritePersona
        : undefined;
    config.actionCallbacks.unfavoritePersona = isFeatureEnabled('tri-favorites-roaming')
        ? LPCUnfavoritePersona
        : undefined;
    config.dataCallbacks.getIsPersonaFavorited = (
        personaId: PersonaIdentifiers,
        callback: GetIsFavoritedPersonaCallback
    ) => {
        if (personaId.PersonaType === 'Group') {
            const isFavorited: boolean = isGroupInFavorites(personaId.Smtp);
            callback({ isFavorited }, undefined);
        } else {
            const isFavorited: boolean = isPersonaInFavorites(
                personaId.OlsPersonaId,
                personaId.Smtp
            );
            callback({ isFavorited }, undefined);
        }
    };
    config.dataCallbacks.getPresence = (personaId: string, callback: GetPresenceCallback) => {
        // Try to get the latest presence
        if (isFeatureEnabled('fwk-skypeBusinessV2')) {
            lazyTryRegisterForPresenceUpdates.import().then(tryRegisterForPresenceUpdates => {
                tryRegisterForPresenceUpdates(personaId);
            });
        }

        const presence = getPresenceFromStore(personaId);
        callback(presence, undefined /*error*/);
    };

    initializePersonaControl(config);
}

function LPCFavoritePersona(
    personaId: PersonaIdentifiers,
    callback: FavoritePersonaCallback,
    properties?: ActionProperties
): void {
    if (personaId.PersonaType === 'Group' && isFeatureEnabled('tri-favorites-roaming')) {
        favoriteGroup(personaId, callback);
    } else {
        favoritePerson(personaId, callback, properties);
    }
}

function LPCUnfavoritePersona(
    personaId: PersonaIdentifiers,
    callback: FavoritePersonaCallback
): void {
    if (personaId.PersonaType === 'Group' && isFeatureEnabled('tri-favorites-roaming')) {
        unfavoriteGroup(personaId, callback);
    } else {
        unfavoritePerson(personaId, callback);
    }
}

function favoritePerson(
    personaId: PersonaIdentifiers,
    callback: FavoritePersonaCallback,
    properties?: ActionProperties
): void {
    // Although LPC can contain OLS personaId, sometimes it is not the one which is returned from findPeople api. Thus we rely only on email.
    if (isFavoritingInProgress(personaId.Smtp)) {
        // Do nothing, favoriting is in progress for this person
        callback(false, undefined);
        return;
    }

    const favoritePromise = lazyAddFavoritePersona.importAndExecute(
        undefined,
        personaId.Smtp,
        properties.personaDisplayName,
        'LivePersonaCard'
    );

    favoritePromise
        .then(() => callback(true, undefined))
        .catch(e => {
            // If an error was detected, the store has been rolled back
            callback(false, e);
            lazyHandleToggleFavoritePersonaError.importAndExecute(e);
        });
}

function unfavoritePerson(personaId: PersonaIdentifiers, callback: FavoritePersonaCallback): void {
    // Although LPC can contain OLS personaId, sometimes it is not the one which is returned from findPeople api. Thus we rely only on email.
    if (isFavoritingInProgress(personaId.Smtp)) {
        callback(false, undefined);
        // Do nothing, favoriting is in progress for this person
        return;
    }

    const favoriteId = getFavoriteIdForPersona(undefined, personaId.Smtp);
    const unfavoritePromise = lazyRemoveFavoritePersona.importAndExecute(
        favoriteId,
        'LivePersonaCard'
    );

    unfavoritePromise
        .then(() => callback(true, undefined))
        .catch(e => {
            // If an error was detected, the store has been rolled back
            callback(false, e);
            lazyHandleToggleFavoritePersonaError.importAndExecute(e);
        });
}

function favoriteGroup(personaId: PersonaIdentifiers, callback: FavoritePersonaCallback): void {
    const groupsStore = getGroupsStore();
    const group = groupsStore.groups.get(personaId.Smtp.toLowerCase());
    if (!group) {
        return;
    }

    if (!isGroupInFavorites(personaId.Smtp)) {
        lazyAddFavoriteGroup
            .import()
            .then(addFavoriteGroup =>
                addFavoriteGroup(
                    personaId.Smtp,
                    group.basicInformation.DisplayName,
                    'GroupNodeFavoriteButton'
                )
            )
            .then(() => callback(true, undefined));
    } else {
        callback(false, 'Group is already favorited');
    }
}

function unfavoriteGroup(personaId: PersonaIdentifiers, callback: FavoritePersonaCallback): void {
    const groupsStore = getGroupsStore();
    const group = groupsStore.groups.get(personaId.Smtp.toLowerCase());
    if (!group) {
        return;
    }

    if (isGroupInFavorites(personaId.Smtp)) {
        // Reset the folder selection to the same group in the group list if unfavorite a selected node
        const selectedNode = getSelectedNode();
        if (selectedNode.id && selectedNode.id.toLowerCase() == personaId.Smtp.toLowerCase()) {
            lazySelectGroup.importAndExecute(personaId.Smtp, 'groups' /* treeType */);
        }

        lazyRemoveFavoriteGroup
            .import()
            .then(removeFavoriteGroup =>
                removeFavoriteGroup(personaId.Smtp, 'GroupNodeFavoriteButton')
            )
            .then(() => callback(true, undefined));
    } else {
        callback(false, 'Group is already unfavorited');
    }
}

const toggleFavoriteGroup = (groupId: string) => {
    lazyToggleFavoriteGroup.import().then(toggleFavGroup => toggleFavGroup(groupId));
};

const removeGroupFromLeftNav = (groupId: string) => {
    lazyRemoveGroupFromLeftNav
        .import()
        .then(lazyRemoveGroup => lazyRemoveGroup(groupId, getLeftNavGroupsStore()));
};
