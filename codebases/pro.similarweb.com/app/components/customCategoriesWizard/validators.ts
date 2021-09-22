import * as _ from "lodash";

export enum ECustomCategoriesDomainsValidation {
    INVALID_LENGTH = 1,
    INVALID_FORMAT,
    DOMAIN_DUPLICATED,
}

export const domainsValidation = (domains = [], maxDomains): ECustomCategoriesDomainsValidation => {
    const invalidDomainsLength = validateDomainsLength(domains, maxDomains);
    const invalidDomainsFormat = validateDomainsFormat(domains);
    // validations
    if (invalidDomainsLength) {
        return ECustomCategoriesDomainsValidation.INVALID_LENGTH;
    } else if (invalidDomainsFormat) {
        return ECustomCategoriesDomainsValidation.INVALID_FORMAT;
    } else if (isDomainsDuplicated(domains)) {
        return ECustomCategoriesDomainsValidation.DOMAIN_DUPLICATED;
    }
};

export const domainValidator = /([a-я0-9|-]+\.)*[a-я0-9|-]+\.[a-я]+/;
const validateDomainsFormat = (domains) => {
    _.forEach(domains, function (domain) {
        domain.valid = domainValidator.test(domain.domain) && domain.domain.indexOf("/") == -1;
    });
    return _.some(domains, { valid: false });
};

const validateDomainsLength = (domains = [], maxDomains) => {
    return domains.length > maxDomains;
};

const isDomainsDuplicated = (domains = []) => {
    const domainsLength = domains.length;
    let i,
        j,
        result = false;

    for (i = 0; i < domainsLength - 1; i++) {
        for (j = i + 1; j < domainsLength; j++) {
            if (domains[i].domain === domains[j].domain) {
                domains[i].valid = false;
                result = true;
            }
        }
    }

    return result;
};
