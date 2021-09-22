import { action } from 'satcheljs/lib/legacy';
import type FindControlViewState from 'owa-recipient-types/lib/types/FindControlViewState';

export default action('setForceResolveState')(function setForceResolveState(
    viewstate: FindControlViewState,
    inForceResolve: boolean
) {
    viewstate.inForceResolve = inForceResolve;
});
