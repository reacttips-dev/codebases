import { createStore } from 'satcheljs';
import type CurrentGroupInformation from './schema/CurrentGroupInformation';

const initialState: CurrentGroupInformation = {
    smtpAddress: '',
    groupId: '',
    tenantId: '',
};

export const getCurrentGroupInformationStore = createStore(
    'currentGroupInformationStore',
    initialState
);
