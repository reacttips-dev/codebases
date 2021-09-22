import { userDate } from 'owa-datetime';

// Returns current local time in ISO 8601 format
export function getLocalTime(): string {
    const date = userDate();
    return date.toString();
}
