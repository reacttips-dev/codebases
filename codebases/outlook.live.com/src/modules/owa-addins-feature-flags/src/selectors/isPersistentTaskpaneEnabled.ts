import isConsumer from 'owa-session-store/lib/utils/isConsumer';

export default function isPersistentTaskpaneEnabled(): boolean {
    return !isConsumer();
}
