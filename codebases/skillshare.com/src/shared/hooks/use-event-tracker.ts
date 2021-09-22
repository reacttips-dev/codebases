import { useContext } from 'react';
import { EventsContext } from '../../components/providers';
export function useEventTracker() {
    return { trackEvent: useContext(EventsContext).trackEventHandler };
}
//# sourceMappingURL=use-event-tracker.js.map