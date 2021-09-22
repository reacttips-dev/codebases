import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import * as utils from "../../components/filters-bar/utils";

export interface ISegmentData {
    id: string;
    creationType: string;
    domain: string;
    isSingleLob: boolean;
    segmentName: string;
    countries: number[];
    ossCountries: number[];
}

export interface ISegmentGroupData {
    creationType: string;
    id: string;
    name: string;
    segments: string[] | ISegmentData[];
}

export interface ISegmentDomainData {
    domain: string;
    favicon: string;
    segments: string[];
}

const DEFAULT_PRIORITY_COUNTRY_FILTER = ["840"];

export const ConversionSegmentsUtils = {
    getSegmentDomainData: (segmentsData: ISegmentsData, domain: string): ISegmentDomainData => {
        return _.get(segmentsData, `["segmentDomains"]["${domain}"]`, undefined);
    },
    getSegmentById: (segmentsData: ISegmentsData, segmentId: string): ISegmentData => {
        return _.get(segmentsData, `["segments"]["${segmentId}"]`, undefined);
    },

    getSelectedGroupEnrichedWithSegmentsData: (segmentsData: ISegmentsData, groupId: string) => {
        const group = ConversionSegmentsUtils.getSegmentGroupById(segmentsData, groupId);

        if (!group) {
            return undefined;
        }

        return {
            ...group,
            segments: (group.segments as Array<string | ISegmentData>).map((segmentId) => {
                const segment = ConversionSegmentsUtils.getSegmentById(
                    segmentsData,
                    segmentId as string,
                );

                return {
                    ...segment,
                    SegmentId: segment.id, // to keep consistant key for selection
                    Domain: segment.domain, // we are duplicating it, because backend have Domain (PascalCase)
                };
            }),
        };
    },

    getSegmentGroupById: (
        segmentsData: ISegmentsData,
        segmentGroupId: string,
    ): ISegmentGroupData => {
        return _.get(segmentsData, `["segmentGroups"][${segmentGroupId}]`, undefined);
    },

    getSegmentGroupCountries: (segmentsData: ISegmentsData, gid: string) => {
        let groupCountries = new Set();
        const segmentGroupData = _.get(segmentsData, `["segmentGroups"][${gid}]`, []);
        segmentGroupData.segments.map((segmentId) => {
            const segmentData = ConversionSegmentsUtils.getSegmentById(segmentsData, segmentId);
            groupCountries = segmentData
                ? new Set([...Array.from(groupCountries), ...segmentData.countries])
                : groupCountries;
        });

        return _.filter(ConversionSegmentsUtils.getFilteredCountries(true), (country) =>
            groupCountries.has(country.id),
        );
    },

    getSegmentCountries: (segmentsData: ISegmentsData, sid) => {
        const segmentCountries = _.get(segmentsData, `["segments"]["${sid}"]["countries"]`);
        const segmentOssCountries = _.get(segmentsData, `["segments"]["${sid}"]["ossCountries"]`);
        return _.filter(ConversionSegmentsUtils.getFilteredCountries(), (country) =>
            [...segmentCountries, ...segmentOssCountries].includes(country.id),
        );
    },

    getSegmentGroups: (segmentsData: ISegmentsData) => {
        return _.orderBy(
            _.get(segmentsData, "segmentGroups"),
            [(group) => group.name.toLowerCase()],
            ["asc"],
        );
    },

    getCustomSegmentGroups: (
        segmentsData: ISegmentsData,
        userCountryFilter: string[] = undefined,
    ) => {
        const userCountries = userCountryFilter ?? ConversionSegmentsUtils.getUserCountries();
        const groups = ConversionSegmentsUtils.getSegmentGroups(segmentsData);
        return _.reduce(
            groups,
            (acc, group) => {
                if (group.creationType === "Custom") {
                    const groupSegments = group.segments.map((segmentId) =>
                        ConversionSegmentsUtils.getSegmentById(segmentsData, segmentId),
                    );
                    const groupUserSegments = groupSegments.filter((segment) =>
                        segment.countries.some((c) => userCountries.includes(c)),
                    );
                    if (groupUserSegments.length > 0) {
                        acc.push({
                            ...group,
                            segments: groupUserSegments.map((segment) => segment.id),
                        });
                    }
                }
                return acc;
            },
            [],
        );
    },

    // User countries are read from Conversion settings (sub-settings of Conversion, as ConversionOverview do not have filtered countries)
    getUserCountries: () => swSettings.components.Conversion.resources.Countries,

    // Return all countries object filtered by user countries
    getFilteredCountries: (
        excludeStates: boolean = false,
        userCountryFilter: string[] = undefined,
    ) => {
        const userCountriesIds = userCountryFilter ?? ConversionSegmentsUtils.getUserCountries();
        const countries = utils.getCountries(excludeStates);
        return countries.filter((country) => userCountriesIds.includes(country.id));
    },

    getSegmentsCountriesSortedByRate: (segments: ISegmentData[]): string[] => {
        const countriesRate = segments.reduce<{ [index: number]: number }>((acc, segment) => {
            segment.countries.forEach((countryCode) => {
                acc[countryCode] = (acc[countryCode] ?? 0) + 1;
            });
            return acc;
        }, {});
        const countriesSorted = Object.entries(countriesRate).sort((a, b) => b[1] - a[1]);
        return countriesSorted.map(([countryCode]) => countryCode);
    },

    getSegmentsUserCountriesSortedByRate: (
        segments: ISegmentData[],
        userCountryFilter: string[] = undefined,
    ): string[] => {
        const userCountries = userCountryFilter ?? ConversionSegmentsUtils.getUserCountries();
        return ConversionSegmentsUtils.getSegmentsCountriesSortedByRate(segments).filter((c) =>
            userCountries.includes(+c),
        );
    },

    // Returns the default user country code for the given segments, or the first default priority country as fallback
    getSegmentsDefaultUserCountry: (
        segments: ISegmentData[],
        userCountryFilter: string[] = undefined,
        priorityCountryFilter: string[] = undefined,
    ) => {
        const priorityCountries = priorityCountryFilter ?? DEFAULT_PRIORITY_COUNTRY_FILTER;
        const userCountriesRated = ConversionSegmentsUtils.getSegmentsUserCountriesSortedByRate(
            segments,
            userCountryFilter,
        );
        const userPriorityCountryCode = priorityCountries.find((priorityCountry) =>
            userCountriesRated.includes(priorityCountry),
        );
        return (
            userPriorityCountryCode ?? userCountriesRated[0] ?? DEFAULT_PRIORITY_COUNTRY_FILTER[0]
        );
    },

    getSegmentOssUserCountries: (
        segment: ISegmentData,
        userCountryFilter: string[] = undefined,
    ): number[] => {
        const userCountries = userCountryFilter ?? ConversionSegmentsUtils.getUserCountries();
        return segment.ossCountries.filter((c) => userCountries.includes(+c));
    },
};
