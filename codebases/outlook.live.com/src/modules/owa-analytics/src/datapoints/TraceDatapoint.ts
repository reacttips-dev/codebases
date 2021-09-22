import { AriaDatapoint } from './AriaDatapoint';
import { TraceLevel } from 'owa-trace';

const traceLevelMap: { [level: number]: string } = {};
traceLevelMap[TraceLevel.Error] = 'Error';
traceLevelMap[TraceLevel.Warning] = 'Warning';
traceLevelMap[TraceLevel.Info] = 'Info';
traceLevelMap[TraceLevel.Verbose] = 'Verbose';

export default class TraceDatapoint extends AriaDatapoint {
    constructor(message: string, level: TraceLevel) {
        super(traceLevelMap[level] || 'Unknown');
        this.addDataWithPiiScrubbing('message', message);
    }
}
