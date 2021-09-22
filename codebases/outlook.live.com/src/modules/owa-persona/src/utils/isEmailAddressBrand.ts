import fetchBrandList from '../services/fetchBrandList';
import store from '../store/Store';
import { allBrandsSmtpsSet, tier3BrandSmtpsSet } from '../store/brandSmtpSets';
import { BrandListLoadState } from '../store/schema/BrandList';
import { getOwaWorkload, OwaWorkload } from 'owa-workloads';
import type { IComputedValue } from 'mobx';
import isImageApiEnabled from './isImageApiEnabled';

export function isEmailAddressBrand(emailAddress: string): boolean {
    if (isImageApiEnabled()) {
        return (
            store.dynamicBrandSets.verifiedBrands.get(emailAddress) ||
            store.dynamicBrandSets.unverifiedBrands.get(emailAddress) ||
            false
        );
    } else {
        if (getOwaWorkload() !== OwaWorkload.Mail || !fetchBrandListIfNotLoaded()) {
            return false;
        }
        return isEmailAddressOnList(emailAddress, allBrandsSmtpsSet);
    }
}

export function isEmailAddressDecoratedBrand(emailAddress: string): boolean {
    if (isImageApiEnabled()) {
        return store.dynamicBrandSets.verifiedBrands.get(emailAddress) || false;
    } else {
        if (getOwaWorkload() !== OwaWorkload.Mail || !fetchBrandListIfNotLoaded()) {
            return false;
        }
        return isEmailAddressOnList(emailAddress, tier3BrandSmtpsSet);
    }
}

/**
 * If the brand list has not yet been fetched, starts a fetch and resolves immediately
 * with `false` so that future calls might have the brand list loaded.
 */
function fetchBrandListIfNotLoaded(): boolean {
    if (store.brandListLoadState === BrandListLoadState.unloaded) {
        fetchBrandList();
    }

    if (
        store.brandListLoadState != BrandListLoadState.loadSucceeded ||
        !store.brandList ||
        !store.brandList.smtps
    ) {
        return false;
    }

    return true;
}

function isEmailAddressOnList(emailAddress: string, smtpSet: IComputedValue<Set<string>>): boolean {
    if (emailAddress) {
        emailAddress = emailAddress.toLowerCase();

        const atSignIndex = emailAddress.indexOf('@');
        if (atSignIndex === -1) {
            return false;
        }
        return smtpSet.get().has(emailAddress);
    }

    return false;
}
