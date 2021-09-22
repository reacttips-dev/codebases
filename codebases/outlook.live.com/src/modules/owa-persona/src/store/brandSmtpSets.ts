import { computed, IComputedValue } from 'mobx';
import store from './Store';

// Track a computed Set of all brand smtps.
//
// Since isEmailAddressOnList is called syncronously when peoplePicker is used,
// it needs to be performant or it will cause frame drops while typing.
//
// This set of brand smtps is used to quickly check if an email address's smtp falls
// under a brand
export const allBrandsSmtpsSet: IComputedValue<Set<string>> = computed(() => {
    let brandSmtps = new Set<string>();
    store.brandList.smtps.forEach((smtp: string) => brandSmtps.add(smtp.toLowerCase()));
    store.brandList.tier3Smtps.forEach((smtp: string) => brandSmtps.add(smtp.toLowerCase()));
    return brandSmtps;
});

export const tier3BrandSmtpsSet: IComputedValue<Set<string>> = computed(() => {
    let tier3BrandSmtps = new Set<string>();
    store.brandList.tier3Smtps.forEach((smtp: string) => tier3BrandSmtps.add(smtp.toLowerCase()));
    return tier3BrandSmtps;
});

export default allBrandsSmtpsSet;
