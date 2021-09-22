import type { SubscriptionDatapoint } from '../schema/SubscriptionDatapoint';
import type { DiagnosticsLogger } from 'owa-diagnostics';
import { action } from 'satcheljs/lib/legacy';

export default action('disconnectSubscriptionDatapoint')(function disconnectSubscriptionDatapoint(
    id: string,
    state: DiagnosticsLogger<SubscriptionDatapoint>
) {
    const datapoints: SubscriptionDatapoint[] = state.datapoints;
    for (let i = 0; i < datapoints.length; i++) {
        if (datapoints[i].id === id) {
            datapoints[i].status = 'Disconnected';
            break;
        }
    }
});
