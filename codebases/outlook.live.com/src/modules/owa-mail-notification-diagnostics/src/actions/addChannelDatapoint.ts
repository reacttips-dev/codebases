import type { ChannelDatapoint } from '../schema/ChannelDatapoint';
import getTimeString from '../utils/getTimeString';
import insertWithBound from '../utils/insertWithBound';
import type { DiagnosticsLogger } from 'owa-diagnostics';
import { action } from 'satcheljs/lib/legacy';

const MAX_CHANNEL_DATAPOINTS = 1000;

export default action('addChannelDatapoint')(function addChannelDatapoint(
    message: string,
    state: DiagnosticsLogger<ChannelDatapoint>
) {
    insertWithBound(
        state.datapoints,
        {
            message: message,
            timestamp: getTimeString(),
        },
        MAX_CHANNEL_DATAPOINTS
    );
});
