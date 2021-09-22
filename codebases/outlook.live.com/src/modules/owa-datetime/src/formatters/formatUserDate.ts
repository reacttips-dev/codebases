import { localizedFormatter } from './localizedFormatter';

export function getUserDateFormat(dateFormat: string): string {
    return dateFormat;
}

export default localizedFormatter(getUserDateFormat);
