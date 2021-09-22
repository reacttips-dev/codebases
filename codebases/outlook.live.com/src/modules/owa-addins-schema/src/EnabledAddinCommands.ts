import {
    IAddin,
    IEnabledAddinCommands,
    AutoRunAddinCommand,
    filterSupportsSharedFolderAddins,
} from 'owa-addins-store';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import type LaunchEventType from 'owa-service/lib/contract/LaunchEventType';

/**
 * The object that keeps track of the enabled addin commands in the store.
 *
 * @export
 * @class EnabledAddinCommands
 */
export default class EnabledAddinCommands implements IEnabledAddinCommands {
    /** True when EnabledAddinCommands has been fully initialized */
    private appointmentAttendeeAddins: IAddin[];
    private appointmentOrganizerAddins: IAddin[];
    private detectedEntityAddins: IAddin[];
    private messageReadAddins: IAddin[];
    private messageComposeAddins: IAddin[];
    private meetingRequestAddins: IAddin[];
    private eventsAddins: IAddin[];
    private autoRunAddins: IAddin[];
    private autoRunAddinsIndexMapping: Map<LaunchEventType, Array<number> /* Addin index */>;

    /**
     * Creates an instance of EnabledAddinCommands.
     */
    constructor() {
        this.isInitialized = false;
        this.appointmentAttendeeAddins = [];
        this.appointmentOrganizerAddins = [];
        this.detectedEntityAddins = [];
        this.messageReadAddins = [];
        this.messageComposeAddins = [];
        this.meetingRequestAddins = [];
        this.eventsAddins = [];
        this.autoRunAddins = [];
        this.autoRunAddinsIndexMapping = new Map<
            LaunchEventType,
            Array<number>
        > /* Addin index */();
    }

    public isInitialized: boolean;

    /**
     * Gets the appropriate list given the mode of the item we are on.
     *
     * @param {ExtensibilityModeEnum} mode (The mode of the host item)
     * @returns (The appropriate list for the given mode)
     */
    getExtensionPoint(
        mode: ExtensibilityModeEnum,
        filterSupportsSharedFolders?: boolean
    ): IAddin[] {
        let addins: IAddin[] = this.getAddinsForMode(mode);

        if (filterSupportsSharedFolders) {
            if (addins) {
                addins = filterSupportsSharedFolderAddins(addins);
            }
        }

        return addins;
    }

    public getAutoRunAddinsByLaunchEventType = (launchEventType: LaunchEventType): IAddin[] => {
        const addins: IAddin[] = this.getAddinsForMode(ExtensibilityModeEnum.LaunchEvent);
        let indexList: Array<number> = [];
        let addinsForEvent: IAddin[] = [];

        indexList = this.autoRunAddinsIndexMapping.get(launchEventType);
        if (!!indexList) {
            indexList.map((index: number) => {
                addinsForEvent.push(addins[index]);
            });
        }
        return addinsForEvent;
    };

    /**
     * Sets the appropriate list given the mode of the item we are on.
     *
     * @param {IAddin[]} value (The new valuye for the array.)
     * @param {ExtensibilityModeEnum} mode (The mode of the host item)
     */
    setExtensionPoint(value: IAddin[], mode: ExtensibilityModeEnum) {
        switch (mode) {
            case ExtensibilityModeEnum.MeetingRequest:
                this.meetingRequestAddins = value;
                break;
            case ExtensibilityModeEnum.AppointmentAttendee:
                this.appointmentAttendeeAddins = value;
                break;
            case ExtensibilityModeEnum.AppointmentOrganizer:
                this.appointmentOrganizerAddins = value;
                break;
            case ExtensibilityModeEnum.DetectedEntity:
                this.detectedEntityAddins = value;
                break;
            case ExtensibilityModeEnum.MessageCompose:
                this.messageComposeAddins = value;
                break;
            case ExtensibilityModeEnum.MessageRead:
                this.messageReadAddins = value;
                break;
            case ExtensibilityModeEnum.TrapOnSendEvent:
                this.eventsAddins = value;
                break;
            case ExtensibilityModeEnum.LaunchEvent:
                this.autoRunAddins = value;
                this.setAutoRunAddinsMapping(value);
                break;
            default:
            // invalid
        }
    }

    private getAddinsForMode(mode: ExtensibilityModeEnum): IAddin[] {
        switch (mode) {
            case ExtensibilityModeEnum.MeetingRequest:
                return this.meetingRequestAddins;
            case ExtensibilityModeEnum.AppointmentAttendee:
                return this.appointmentAttendeeAddins;
            case ExtensibilityModeEnum.AppointmentOrganizer:
                return this.appointmentOrganizerAddins;
            case ExtensibilityModeEnum.DetectedEntity:
                return this.detectedEntityAddins;
            case ExtensibilityModeEnum.MessageCompose:
                return this.messageComposeAddins;
            case ExtensibilityModeEnum.MessageRead:
                return this.messageReadAddins;
            case ExtensibilityModeEnum.TrapOnSendEvent:
                return this.eventsAddins;
            case ExtensibilityModeEnum.LaunchEvent:
                return this.autoRunAddins;
            default:
                return null;
        }
    }

    private setAutoRunAddinsMapping = (addinsList: IAddin[]) => {
        addinsList.forEach((addin: IAddin, index: number) => {
            [...addin.AddinCommands.values()].forEach(
                (autoRunAddinCommand: AutoRunAddinCommand) => {
                    const event: LaunchEventType = autoRunAddinCommand?.getLaunchEventType();
                    if (event) {
                        this.setAutoRunAddinMapForLaunchEventType(event, index);
                    }
                }
            );
        });
    };

    private setAutoRunAddinMapForLaunchEventType = (event: LaunchEventType, index: number) => {
        if (this.autoRunAddinsIndexMapping.has(event)) {
            this.autoRunAddinsIndexMapping.get(event).push(index);
        } else {
            this.autoRunAddinsIndexMapping.set(event, [index]);
        }
    };
}
