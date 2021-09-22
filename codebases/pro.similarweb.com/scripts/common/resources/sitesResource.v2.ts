import { ellipsisFilter, prettifyCategoryFilter } from "filters/ngFilters";
import { DefaultFetchService } from "services/fetchService";
import { ICountryObject } from "../../../app/services/CountryService";

const fetchService = DefaultFetchService.getInstance();
const ellipsis = ellipsisFilter();
const prettifyCategory = prettifyCategoryFilter();

export const sitesResourceV2 = {
    getSiteInfo: (params, countriesById: ICountryObject[]) => {
        return fetchService
            .get(
                "/api/WebsiteOverview/getheader",
                {
                    keys: "",
                    mainDomainOnly: false,
                    includeCrossData: true,
                    ...params,
                },
                {
                    preventAutoCancellation: true,
                },
            )
            .then((response: { data: any }) => {
                const domains = Object.keys(response);
                const result = {};
                domains.forEach((domain) => {
                    const domainData = response[domain];
                    const { description, category, highestTrafficCountry, IsVGroup } = domainData;
                    result[domain] = {
                        ...domainData,
                        description: description.replace(/\uFFFD/g, ""),
                        el_description: ellipsis(description, 196),
                        category: prettifyCategory(category),
                        highestTrafficCountry: countriesById[highestTrafficCountry],
                        displayName: IsVGroup ? domain.substr(1) : domain,
                    };
                });
                return result;
            });
    },
};
