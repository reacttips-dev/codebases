import { getStore } from '../store/store';
import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export default function isOptionAllowed(allowedOptionFlags: string[]) {
    return (
        isConsumer() ||
        allowedOptionFlags.every(requiredFlag => getStore().allowedOptions.includes(requiredFlag))
    );
}
