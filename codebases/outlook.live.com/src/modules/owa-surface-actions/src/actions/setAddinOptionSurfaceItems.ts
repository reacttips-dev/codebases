import type AddinOptionSurfaceItems from '../store/schema/AddinOptionSurfaceItems';
import store from '../store/store';
import { action } from 'satcheljs/lib/legacy';

export default action('setAddinOptionSurfaceItems')(function setAddinOptionSurfaceItems(
    addinOptionSurfaceItems: AddinOptionSurfaceItems
) {
    store.addinOptionSurfaceItems = addinOptionSurfaceItems;
});
