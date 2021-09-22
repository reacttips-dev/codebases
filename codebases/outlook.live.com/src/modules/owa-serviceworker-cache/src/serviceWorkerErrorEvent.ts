import type { ServiceWorkerMessage } from 'owa-serviceworker-common';
import * as trace from 'owa-trace';

export default function serviceWorkerErrorEvent(message: ServiceWorkerMessage): void {
    if (message.error != null) {
        trace.errorThatWillCauseAlert(
            '[SW Client] ServiceWorker Unhandled Exception',
            message.error
        );
    }
}
