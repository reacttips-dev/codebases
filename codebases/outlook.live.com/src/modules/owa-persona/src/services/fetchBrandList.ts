import setBrandList from '../actions/setBrandList';
import setBrandListLoadState from '../actions/setBrandListLoadState';
import { BrandListLoadState } from '../store/schema/BrandList';
import store from '../store/Store';
import { trace } from 'owa-trace';
import { getBrandListPromise } from './getBrandListPromise';

export default async function fetchBrandList(): Promise<void> {
    if (store.brandListLoadState != BrandListLoadState.unloaded) {
        return;
    }
    setBrandListLoadState(BrandListLoadState.loading);

    try {
        let brandList = await getBrandListPromise();
        if (brandList) {
            setBrandList(brandList);
            setBrandListLoadState(BrandListLoadState.loadSucceeded);
        } else {
            setBrandListLoadState(BrandListLoadState.loadFailed);
            trace.info('error fetching brand list. Empty response');
        }
    } catch (error) {
        setBrandListLoadState(BrandListLoadState.loadFailed);
        trace.info('error fetching brand list. Exception: ' + error);
    }
}
