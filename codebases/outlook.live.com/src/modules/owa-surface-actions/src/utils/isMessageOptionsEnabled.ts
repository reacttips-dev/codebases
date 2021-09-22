import { isConsumer } from 'owa-session-store';

export default function isMessageOptionsEnabled() {
    // Message options don't mean much to non-exchange email implementations.
    // Since these features decay inelegantly on other providers, restrict to non-consumer accounts.
    return !isConsumer();
}
