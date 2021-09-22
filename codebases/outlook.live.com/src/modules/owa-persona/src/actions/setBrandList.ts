import { mutatorAction } from 'satcheljs';
import type BrandList from '../store/schema/BrandList';
import store from '../store/Store';

export default mutatorAction('SET_BRAND_LIST', (brandList: BrandList) => {
    store.brandList = brandList;
});
