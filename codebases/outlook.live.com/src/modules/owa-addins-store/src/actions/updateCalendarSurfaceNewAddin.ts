import extensibilityState from '../store/store';
import { action } from 'satcheljs/lib/legacy';

export default action('updateCalendarSurfaceNewAddin')(function updateCalendarSurfaceNewAddin(
    addinId: string
) {
    extensibilityState.calendarSurfaceNewAddinId = addinId;
});
