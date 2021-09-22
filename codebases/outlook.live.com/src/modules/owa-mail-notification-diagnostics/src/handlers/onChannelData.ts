import addChannelDatapoint from '../actions/addChannelDatapoint';
import type { ChannelDatapoint } from '../schema/ChannelDatapoint';
import {
    DiagnosticsLogger,
    lazyGetDiagnosticsLogState,
    lazyRegisterDiagnostics,
} from 'owa-diagnostics';

const loggerName = 'Channel';
let channelLogger: DiagnosticsLogger<ChannelDatapoint>;

let initialized = false;

async function ensureInitialized() {
    if (!initialized) {
        initialized = true;

        channelLogger = {
            name: loggerName,
            datapoints: [],
        };

        const getDiagnosticsLogState = await lazyGetDiagnosticsLogState.import();
        const registerDiagnostics = await lazyRegisterDiagnostics.import();

        const diagnosticsLogState = getDiagnosticsLogState();
        registerDiagnostics(channelLogger);
        channelLogger = diagnosticsLogState.loggers.get(loggerName);
    }
}

export default function onChannelData(msg: string) {
    ensureInitialized();
    addChannelDatapoint(msg, channelLogger);
}
