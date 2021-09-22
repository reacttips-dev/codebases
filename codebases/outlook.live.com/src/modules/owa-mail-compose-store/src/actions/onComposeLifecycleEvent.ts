import { action } from 'satcheljs';
import type { ComposeViewState } from '../store/schema/ComposeViewState';
import type ComposeLifecycleEvent from '../store/schema/ComposeLifecycleEvent';

/**
 * Call this action to trigger a Compose Lifecycle Event.
 * A Compose Lifecycle Event is fired when some compose state is changed, e.g.
 * - Compose is opened
 * - Compose is saving
 * - Compose is about to send
 * - Compose is closed
 * - ...
 * This event gives a chance for other components to do something when compose state is changed.
 */
const onComposeLifecycleEvent = action(
    'OnComposeLifecycleEvent',
    (viewState: ComposeViewState, event: ComposeLifecycleEvent) => ({
        viewState,
        event,
    })
);

export default onComposeLifecycleEvent;
