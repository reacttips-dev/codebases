import store from '../store/Store';
import type { BrandListLoadState } from '../store/schema/BrandList';
import { mutatorAction } from 'satcheljs';

export default mutatorAction(
    'SET_BRAND_LIST_LOAD_STATE',
    (brandListLoadState: BrandListLoadState) => {
        store.brandListLoadState = brandListLoadState;
    }
);
