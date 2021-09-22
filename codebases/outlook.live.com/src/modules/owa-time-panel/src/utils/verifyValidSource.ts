import type { TimePanelSource } from 'owa-time-panel-bootstrap';
import * as trace from 'owa-trace';

export function verifyValidSource(source: TimePanelSource): boolean {
    if (source) {
        return true;
    }
    trace.debugErrorThatWillShowErrorPopupOnly(
        'Source is a required parameter for Time Panel public APIs'
    );
    return false;
}
