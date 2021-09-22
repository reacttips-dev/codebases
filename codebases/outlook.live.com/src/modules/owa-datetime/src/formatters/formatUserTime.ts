import { localizedFormatter } from './localizedFormatter';

export function getUserTimeFormat(dateFormat: string, timeFormat: string): string {
    return timeFormat;
}

export default localizedFormatter(getUserTimeFormat);
