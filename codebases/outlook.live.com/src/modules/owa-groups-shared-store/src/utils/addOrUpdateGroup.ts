import initializeGroupDefaults from './initializeGroupDefaults';
import type GroupsState from '../schema/GroupsState';
import type GroupInformation from '../schema/GroupInformation';
import { action } from 'satcheljs/lib/legacy';
import { getCurrentGroupInformationStore } from '../CurrentGroupInformationStore';

const addOrUpdateGroup = action('addOrUpdateGroup')(
    (
        state: GroupsState,
        groupSmtp: string,
        groupInformation: GroupInformation,
        oldGroupSmtp?: string,
        updateLeftNavStore?: (smtp: string, oldSmtp: string) => void
    ) => {
        groupSmtp = groupSmtp.toLowerCase();
        const oldGroupSmtpPresent =
            oldGroupSmtp === undefined || oldGroupSmtp === '' ? false : true;
        if (oldGroupSmtpPresent) {
            oldGroupSmtp = oldGroupSmtp.toLowerCase();
            groupSmtp = groupInformation.groupDetails.SmtpAddress;
        }
        groupInformation = oldGroupSmtpPresent
            ? initializeGroupDefaults(state, oldGroupSmtp, groupInformation)
            : initializeGroupDefaults(state, groupSmtp, groupInformation);

        if (
            state.groups.has(groupSmtp) ||
            (oldGroupSmtpPresent && state.groups.has(oldGroupSmtp))
        ) {
            const currentGroup: GroupInformation = state.groups.has(groupSmtp)
                ? state.groups.get(groupSmtp)
                : state.groups.get(oldGroupSmtp);
            if (groupInformation.basicInformation) {
                currentGroup.basicInformation = groupInformation.basicInformation;
            }
            if (groupInformation.groupDetails) {
                // Try to preserve MailboxSettings (obtained only on full group details)
                // when updating group details and it wasn't returned (Basic Details calls)
                if (
                    currentGroup.groupDetails?.MailboxSettings &&
                    !groupInformation.groupDetails.MailboxSettings
                ) {
                    groupInformation.groupDetails.MailboxSettings =
                        currentGroup.groupDetails.MailboxSettings;
                }

                currentGroup.groupDetails = groupInformation.groupDetails;
            }
            if (groupInformation.members) {
                currentGroup.members = groupInformation.members;
            }
            if (groupInformation.groupDetailsError != null) {
                currentGroup.groupDetailsError = groupInformation.groupDetailsError;
            }

            if (oldGroupSmtpPresent && groupSmtp !== oldGroupSmtp) {
                if (updateLeftNavStore !== undefined) {
                    updateLeftNavStore(groupSmtp, oldGroupSmtp);
                }
                state.groups.set(groupSmtp, currentGroup);
                state.groups.delete(oldGroupSmtp);
                getCurrentGroupInformationStore().smtpAddress = groupSmtp;
            }
        } else {
            state.groups.set(groupSmtp, groupInformation);
        }
    }
);

export default addOrUpdateGroup;
