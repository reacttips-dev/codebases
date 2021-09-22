import type {
    HostAppProvidedPersonaIdentifiers,
    PopupStateUpdateData,
} from 'owa-people-loki/lib/models/models';

export interface PersonaIdentifiers {
    readonly OlsPersonaId?: string;
    readonly LpcKey: string;
    readonly AadObjectId?: string;
    readonly Smtp?: string;
    readonly PersonaType: string;
    readonly HostAppPersonaId: string;
    readonly LocationId?: string;
    readonly TopicId?: string;
}

export interface MailData {
    Address: string;
    Kind?: string;
    LocalizedSource?: string;
}

export interface BrandUnsubscribeInfo {
    smtp: string;
    smtpDisplayName: string;
    smtpIdentifier: string;
    unsubscribeSilentUri: string[];
    unsubscribeHttpUri: string[];
}

export interface ActionProperties {
    personaDisplayName?: string;
    target?: HTMLElement | number;
}

export interface ComposeMailProperties {
    recipientDisplayName?: string;
    recipientType?: string;
}

export interface WorkDetailsLocalizedSources {
    CompanyName?: string;
    Department?: string;
    JobTitle?: string;
    OfficeLocation?: string;
}

export interface WorkDetails {
    CompanyName?: string;
    YomiCompanyName?: string;
    Department?: string;
    JobTitle?: string;
    OfficeLocation?: string;
    LocalizedSources?: Readonly<WorkDetailsLocalizedSources>;
}

export interface LocalizedSources {
    company?: string;
    department?: string;
    displayName?: string;
    jobTitle?: string;
}

export type Persona = {
    kind: string;
    olsPersonaId?: string;
    hostAppPersonaId?: string;
    email: string | MailData;
    extraEmails: MailData[];
    displayName: string;
    jobTitle: string;
    department: string;
    company: string;
    linkedWorkDetails: WorkDetails[];
    localizedSources?: LocalizedSources;
};

export type DataCallback<T> = (data: T | undefined, error: string | undefined) => void;

export type GetIsFavoritedPersonaCallback = DataCallback<{ isFavorited: boolean }>;
export type FavoritePersonaCallback = DataCallback<boolean>;
export type UnfavoritePersonaCallback = DataCallback<boolean>;
export type GetPresenceCallback = DataCallback<number>;

export type DataUpdateListener<T> = (newData: T) => void;

export interface PersonaConfig {
    actionCallbacks?: {
        composeMail?: (
            recipient: string,
            subject?: string,
            body?: string,
            properties?: ActionProperties & ComposeMailProperties,
            personaId?: PersonaIdentifiers
        ) => void;
        favoritePersona?: (
            personaId: PersonaIdentifiers,
            completeCallback: FavoritePersonaCallback
        ) => void;
        unfavoritePersona?: (
            personaId: PersonaIdentifiers,
            completeCallback: UnfavoritePersonaCallback
        ) => void;
        meetingActionCallbacks?: MeetingActionCallbacks;
        readMail?: (mailId: string, properties?: ActionProperties) => void;
        toggleSubscribeToGroup?: (
            personaIdentifiers: PersonaIdentifiers,
            newIsSubscribedState: boolean
        ) => void;
        editGroup?: (groupSmtpAddress: string) => void;
        addGroupMembers?: (groupSmtpAddress: string) => void;
        updateMembership?: (
            personaIdentifiers: PersonaIdentifiers,
            groupMembershipScenarios:
                | 'RemoveGroupMember'
                | 'PromoteGroupMember'
                | 'DemoteGroupOwner'
                | 'AddGroupMember',
            successCount: number,
            failedCount: number,
            isSelf: boolean
        ) => void;
        getStartChatCallback?: () => (
            properties: {
                smtpAddress: string;
                imAddress: string;
                imAddressUrl: string;
            },
            completeCallback: (success: boolean, error?: string) => void
        ) => void;
    };

    dataCallbacks?: {
        getIsPersonaFavorited?: (
            personaId: PersonaIdentifiers,
            callback: GetIsFavoritedPersonaCallback
        ) => void;
        getPresence?: (personaId: string, callback: GetPresenceCallback) => void;
        getPersonaInfo?: (
            personaId: PersonaIdentifiers,
            callback: DataCallback<Partial<Persona>>
        ) => void;
    };

    dataUpdateBroadcaster?: {
        setGroupUpdateListener?(
            listener: DataUpdateListener<HostAppProvidedPersonaIdentifiers>
        ): void;
        setGroupMembersUpdateListener?(
            listener: DataUpdateListener<HostAppProvidedPersonaIdentifiers>
        ): void;
        setGroupDeleteListener?(
            listener: DataUpdateListener<HostAppProvidedPersonaIdentifiers>
        ): void;
        updatePopupStateListener?(listener: DataUpdateListener<PopupStateUpdateData>): void;
        setGroupUpdateSmtpListener?(
            listener: DataUpdateListener<HostAppProvidedPersonaIdentifiers>
        ): void;
    };
}

/**
 * Interface to define/group up all Meeting related interactions between the card and the host app.
 * This list will continue growing as new features are incorporated to the card.
 */
export interface MeetingActionCallbacks {
    onAcceptingMeeting?: (
        meetingId: string,
        appliesToSeries: boolean
    ) => MeetingResponseActionListener;
    onTentativelyAcceptingMeeting?: (
        meetingId: string,
        appliesToSeries: boolean
    ) => MeetingResponseActionListener;
    onDecliningMeeting?: (
        meetingId: string,
        appliesToSeries: boolean
    ) => MeetingResponseActionListener;
    onCancelingMeeting?: (
        meetingId: string,
        appliesToSeries: boolean
    ) => MeetingResponseActionListener;
    onDeletingMeeting?: (
        meetingId: string,
        appliesToSeries: boolean
    ) => MeetingResponseActionListener;
    joinOnlineMeeting?: (
        meetingId: string,
        joinOnlineMeetingParams: JoinOnlineMeetingParams
    ) => void;
    editMeeting?: (meetingId: string, editMeetingParams: EditMeetingParams) => void;
}

/**
 * Defines a contract for the host app to have the opportunity to handle the success or failure
 * of Meeting Response Actions (i.e accept, decline, etc.) specifically.
 */
export interface MeetingResponseActionListener {
    onSuccess?: (
        meetingId: string,
        originalMeetingResponse: string,
        meetingResponseActionParams?: MeetingResponseActionParams
    ) => void;
    onFailure?: (
        meetingId: string,
        originalMeetingResponse: string,
        error?: string,
        meetingResponseActionParams?: MeetingResponseActionParams
    ) => void;
}

/**
 * Parameters for when online meeting is joined from meeting card
 */
export interface JoinOnlineMeetingParams {
    meetingUrl: string;
}

/**
 * Parameters for when meeting response action fails or succeeds
 */
export interface MeetingResponseActionParams {
    sendResponse: boolean;
    timeElapsed: number;
    respondToSeries: boolean;
    responseMessageLength?: number;
    desiredMeetingResponse?: string;
}

/**
 * Parameters for when meeting is edited from meeting card
 */
export interface EditMeetingParams {
    seriesMasterId: string;
    appliesToSeries: boolean;
}

// There is a race condition between the initialization of the LPC config using initializePersona()
// and the getConfig() call reading the initialized config. We therefore wrap this logic in a promise
// to ensure that the getConfig() call will always wait for the execution of the initializePersona call.
//
// But why aren't we handling this by cleaning up the dependency structure and rather pass
// this config around explicitly? The reason is that there are several circular dependencies today which
// are hidden by this global config parameter being set and read from different places. Cleaning this up
// takes a lot of time we don't have right now.
// In other words: TODO - Clean up dependencies and get rid of this pattern
let resolveConfigInitialization: ((config: PersonaConfig) => void) | undefined = undefined;

// Create the awaitable promise. Store the resolve callback for later usage.
// Disable the promise-must-complete rule, as we will control the completion
// of the promise in initializePersona
// tslint:disable-next-line:promise-must-complete
const configPromise: Promise<PersonaConfig> = new Promise(resolve => {
    resolveConfigInitialization = resolve;
});

// A function returning a promise that rejects after a timeout
function rejectAfterTimeout(): Promise<PersonaConfig> {
    return new Promise((_resolve, reject) => {
        setTimeout(() => reject(), 45 * 1000); // 45 seconds
    });
}

export function initializePersona(inputConfig: PersonaConfig): void {
    resolveConfigInitialization?.(inputConfig);
}

export async function getConfig(): Promise<PersonaConfig> {
    return Promise.race([configPromise, rejectAfterTimeout()]);
}
