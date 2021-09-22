import getInitialAppointmentComposeData from './getInitialAppointmentComposeData';
import getInitialAppointmentReadData from './getInitialAppointmentReadData';
import getInitialCommonData from './getInitialCommonData';
import getInitialMessageComposeData from './getInitialMessageComposeData';
import getInitialMessageReadData from './getInitialMessageReadData';
import type InitialData from './InitialData';
import { ExtensibilityModeEnum } from 'owa-addins-types';
import {
    getAdapter,
    CommonAdapter,
    AppointmentComposeAdapter,
    MessageComposeAdapter,
    MessageReadAdapter,
} from 'owa-addins-adapters';
import { getAddinCommandForControl, getHostItem } from 'owa-addins-store';

export default async function GetInitialData(
    controlId: string,
    hostItemIndex: string
): Promise<InitialData> {
    let returnData: InitialData = {};

    const adapter = getAdapter(hostItemIndex);
    const hostItem = getHostItem(hostItemIndex);
    const addInCommand = getAddinCommandForControl(controlId);

    returnData = getInitialCommonData(adapter as CommonAdapter, addInCommand, hostItem, returnData);

    switch (adapter.mode) {
        case ExtensibilityModeEnum.MeetingRequest:
        case ExtensibilityModeEnum.MessageRead:
            returnData = await getInitialMessageReadData(
                adapter as MessageReadAdapter,
                addInCommand,
                hostItemIndex,
                returnData
            );
            break;
        case ExtensibilityModeEnum.MessageCompose:
            returnData = getInitialMessageComposeData(adapter as MessageComposeAdapter, returnData);
            break;
        case ExtensibilityModeEnum.AppointmentAttendee:
            returnData = await getInitialAppointmentReadData(
                adapter as MessageReadAdapter,
                addInCommand,
                hostItemIndex,
                returnData
            );
            break;
        case ExtensibilityModeEnum.AppointmentOrganizer:
            returnData = await getInitialAppointmentComposeData(
                adapter as AppointmentComposeAdapter,
                returnData
            );
            break;
    }

    return returnData;
}
