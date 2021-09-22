import { trace } from 'owa-trace';
import updateAutomaticRepliesInitialState from '../data/mutators/updateAutomaticRepliesInitialState';
import loadMailboxAutomaticRepliesConfiguration from '../services/loadMailboxAutomaticRepliesConfiguration';
import parseMailboxAutoReplyConfiguration from '../utils/parseMailboxAutoReplyConfiguration';

export default async function initLoadMailboxAutomaticRepliesConfiguration() {
    try {
        const mailboxAutoReplyConfiguration = await loadMailboxAutomaticRepliesConfiguration();

        // update optionsState with values from mailboxAutoReplyConfiguration
        updateAutomaticRepliesInitialState(
            parseMailboxAutoReplyConfiguration(mailboxAutoReplyConfiguration)
        );

        return true;
    } catch (e) {
        trace.warn(e.message || 'initLoadMailboxAutomaticRepliesConfiguration failed');
        return false;
    }
}
