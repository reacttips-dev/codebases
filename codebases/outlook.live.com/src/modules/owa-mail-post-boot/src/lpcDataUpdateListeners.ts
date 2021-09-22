import type {
    HostAppProvidedPersonaIdentifiers,
    PopupStateUpdateData,
} from 'owa-people-loki/lib/models/models';
import type { DataUpdateListener } from 'owa-persona/lib/personaConfig';
import { orchestrator } from 'satcheljs';
import {
    addGroupMemberSuccess,
    editGroupSuccess,
    editGroupSmtpSuccess,
    deleteGroupSuccess,
    memberManagementSuccess,
    popupOpened,
    popupClosed,
} from 'owa-group-common';

export declare interface GroupUpdateData extends HostAppProvidedPersonaIdentifiers {
    photoUrl?: string;
}

export declare interface GroupUpdateSmtpData extends GroupUpdateData {
    oldSmtp?: string;
}

let lpcGroupDataUpdateListener: DataUpdateListener<GroupUpdateData>;

let lpcGroupMembersUpdateListener: DataUpdateListener<HostAppProvidedPersonaIdentifiers>;

let lpcGroupDeleteListener: DataUpdateListener<HostAppProvidedPersonaIdentifiers>;

let lpcUpdatePopupStateListener: DataUpdateListener<PopupStateUpdateData>;

let lpcGroupUpdateSmtpListener: DataUpdateListener<GroupUpdateSmtpData>;

export const setLpcGroupDataUpdateListener = (
    listener: DataUpdateListener<GroupUpdateData>
): void => {
    lpcGroupDataUpdateListener = listener;
};

export const setLpcGroupMembersDataUpdateListener = (
    listener: DataUpdateListener<HostAppProvidedPersonaIdentifiers>
): void => {
    lpcGroupMembersUpdateListener = listener;
};

export const setLpcGroupDeleteListener = (
    listener: DataUpdateListener<HostAppProvidedPersonaIdentifiers>
): void => {
    lpcGroupDeleteListener = listener;
};

export const setLpcUpdatePopupStateListener = (
    listener: DataUpdateListener<PopupStateUpdateData>
): void => {
    lpcUpdatePopupStateListener = listener;
};

export const setLpcGroupUpdateSmtpListener = (
    listener: DataUpdateListener<GroupUpdateSmtpData>
): void => {
    lpcGroupUpdateSmtpListener = listener;
};

orchestrator(editGroupSuccess, actionMessage => {
    if (lpcGroupDataUpdateListener) {
        lpcGroupDataUpdateListener({
            Smtp: actionMessage.groupSmtp,
            AadObjectId: '',
            PersonaType: 'Group',
            OlsPersonaId: '',
            photoUrl: actionMessage.photoUrl,
        });
    }
});

orchestrator(addGroupMemberSuccess, actionMessage => {
    if (lpcGroupMembersUpdateListener) {
        lpcGroupMembersUpdateListener({
            Smtp: actionMessage.groupSmtp,
            AadObjectId: '',
            PersonaType: 'Group',
            OlsPersonaId: '',
        });
    }
});

orchestrator(deleteGroupSuccess, actionMessage => {
    if (lpcGroupDeleteListener) {
        lpcGroupDeleteListener({
            Smtp: actionMessage.groupSmtp,
            AadObjectId: '',
            PersonaType: 'Group',
            OlsPersonaId: '',
        });
    }
});

orchestrator(memberManagementSuccess, actionMessage => {
    if (lpcGroupMembersUpdateListener) {
        lpcGroupMembersUpdateListener({
            Smtp: actionMessage.groupSmtp,
            AadObjectId: '',
            PersonaType: 'Group',
            OlsPersonaId: '',
        });
    }
});

orchestrator(popupOpened, actionMessage => {
    updatePopupState(actionMessage);
});

orchestrator(popupClosed, actionMessage => {
    updatePopupState(actionMessage);
});

function updatePopupState(popupStateUpdateData: PopupStateUpdateData): void {
    if (lpcUpdatePopupStateListener) {
        lpcUpdatePopupStateListener(popupStateUpdateData);
    }
}

orchestrator(editGroupSmtpSuccess, actionMessage => {
    if (lpcGroupUpdateSmtpListener) {
        lpcGroupUpdateSmtpListener({
            Smtp: actionMessage.groupSmtp,
            AadObjectId: actionMessage.aadObjectId,
            PersonaType: 'Group',
            OlsPersonaId: '',
            photoUrl: actionMessage.photoUrl,
            oldSmtp: actionMessage.oldGroupSmtp,
        });
    }
});
