import { orchestrator } from 'satcheljs';
import { poll, cancelPoll } from '../actions/publicActions';
import { withCurrentRequestCheck } from '../utils/withCurrentRequestCheck';
import { setPollTimer } from '../actions/setPollTimer';

orchestrator(poll, actionMessage => {
    const { requestFunction, requestIdentifier, interval } = actionMessage;
    // cancel any existing polling set up for this request identifier
    cancelPoll(requestIdentifier);
    const timer = setTimeout(
        () => pollRequest(requestFunction, requestIdentifier, interval),
        interval
    );
    setPollTimer(requestIdentifier, timer);
});

async function pollRequest<T>(
    requestFunction: () => Promise<T> | T,
    requestIdentifier: string,
    interval: number
) {
    await withCurrentRequestCheck(() => requestFunction(), requestIdentifier);
    poll(requestFunction, requestIdentifier, interval);
}
