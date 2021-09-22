import { getSessionId } from './getSessionId';

const emailRegex = new RegExp(/([a-zA-Z0-9+_\.-]+)(@|%40)([\da-zA-Z\.-]+)\.([a-zA-Z\.]{2,6})/g);
const ipRegex = new RegExp(
    /(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)/g
);

export function scrubForPii(value: string | undefined): string | undefined {
    if (value) {
        value = value.replace(emailRegex, 'EmailPii');
        value = value.replace(ipRegex, 'IpPii');
        value = value.split(getSessionId()).join('ReplacedSessionId');
    }
    return value;
}
