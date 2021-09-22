import type { SubscriptionDatapoint } from '../schema/SubscriptionDatapoint';
import { SubscriptionStatus } from 'owa-notification-manager/lib/schema/SubscriptionTrackerState';
import type { DiagnosticsLogger } from 'owa-diagnostics';
import { action } from 'satcheljs/lib/legacy';

export default action('setSubscriptionDatapointStatus')(function setSubscriptionDatapointStatus(
    subscriptionId: string,
    status: SubscriptionStatus,
    handlers: number,
    retries: number,
    error: string,
    state: DiagnosticsLogger<SubscriptionDatapoint>
) {
    const datapoints: SubscriptionDatapoint[] = state.datapoints;
    for (let i = 0; i < datapoints.length; i++) {
        if (datapoints[i].id === subscriptionId) {
            datapoints[i].handlers = handlers;
            datapoints[i].retries = retries;

            if (error) {
                datapoints[i].error = error;
            }

            switch (status) {
                case SubscriptionStatus.Uninitialized:
                    datapoints[i].status = 'Uninitialized';
                    break;
                case SubscriptionStatus.Connected:
                    datapoints[i].status = 'Connected';
                    break;
                case SubscriptionStatus.Pending:
                    datapoints[i].status = 'Pending';
                    break;
                case SubscriptionStatus.Disconnected:
                    datapoints[i].status = 'Disconnected';
                    break;
            }
        }
    }
});
