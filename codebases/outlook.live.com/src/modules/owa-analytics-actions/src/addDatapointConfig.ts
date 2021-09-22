import type { ActionMessage } from 'satcheljs';
import type { DatapointConfig } from 'owa-analytics-types';

export default function addDatapointConfig(
    config: DatapointConfig,
    actionMessage?: ActionMessage
): ActionMessage {
    actionMessage = actionMessage || {};
    actionMessage.dp = config;
    return actionMessage;
}
