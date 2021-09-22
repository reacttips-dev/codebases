import {
    showEnableWebPushCallout,
    completeEnableWebPushCallout,
    CalloutResult,
} from './actions/calloutActions';
import { orchestrator } from 'satcheljs';

export async function promptUserToEnableWebPushWorkflow(): Promise<CalloutResult> {
    return new Promise<CalloutResult>(res => {
        orchestrator(completeEnableWebPushCallout, ({ result }) => {
            res(result);
        });

        // Show the callout
        showEnableWebPushCallout();
    });
}
