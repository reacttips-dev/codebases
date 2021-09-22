import { getCurrentGroupInformationStore } from '../CurrentGroupInformationStore';

export const getCurrentGroupSmtpAddress = (): string => {
    return getCurrentGroupInformationStore().smtpAddress;
};
