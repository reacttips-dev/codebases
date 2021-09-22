import extensibilityState from '../store/store';
import { action } from 'satcheljs/lib/legacy';

export default action('updateMailComposeSurfaceNewAddin')(function updateMailComposeSurfaceNewAddin(
    addinId: string
) {
    extensibilityState.mailComposeSurfaceNewAddinId = addinId;
});
