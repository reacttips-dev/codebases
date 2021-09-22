import { mutatorAction } from 'satcheljs';
import store from '../store/Store';

export default mutatorAction(
    'addBrandToDynamicBrandSet',
    (emailAddress: string, isVerifiedBrand: boolean) => {
        if (isVerifiedBrand) {
            store.dynamicBrandSets.verifiedBrands.set(emailAddress, true);
        } else {
            store.dynamicBrandSets.unverifiedBrands.set(emailAddress, true);
        }
    }
);
