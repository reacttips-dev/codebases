import extensibilityState from '../store/store';
import { action } from 'satcheljs/lib/legacy';

export default action('updateMailReadSurfaceNewAddin')(function updateMailReadSurfaceNewAddin(
    addinId: string
) {
    extensibilityState.mailReadSurfaceNewAddinId = addinId;
});
