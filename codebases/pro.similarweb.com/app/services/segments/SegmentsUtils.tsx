import { swSettings } from "common/services/swSettings";
import _ from "lodash";
import {
    ICustomSegment,
    ICustomSegmentGroupWebsite,
    ICustomSegmentsGroup,
    SEGMENT_KEY_SEPARATOR,
    SEGMENT_TYPES,
} from "services/segments/segmentsApiService";
import { IRule } from "components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import { openUnlockModal } from "services/ModalService";
import { PreferencesService } from "services/preferences/preferencesService";

// FEATURE FLAG: Enable Firebolt engine (suggest opt-in)
export const ENABLE_FIREBOLT = Boolean(
    swSettings.components.CustomSegments.resources.HasSegmentsFireboltEngine ?? true,
);

const SEGMENT_ANALYSIS_PREFERENCES_KEY = `segmentAnalysis`;
const DEFAULT_PRIORITY_COUNTRY_FILTER = [
    String(swSettings.components.CustomSegments.resources.InitialCountry),
    "840",
];

export type ICustomSegmentMember = ICustomSegment | ICustomSegmentGroupWebsite;
export interface ICustomSegmentAvailableMembers {
    segments?: ICustomSegment[];
    websites?: ICustomSegmentGroupWebsite[];
}

const sortSegmentsByDomainName = (a: ICustomSegment, b: ICustomSegment) =>
    a.domain > b.domain
        ? 1
        : a.domain < b.domain // sort by domain asc
        ? -1
        : (a.segmentName ?? "").toLowerCase() > (b.segmentName ?? "").toLowerCase() // if same domain, sort by name asc
        ? 1
        : -1;
const sortSegmentsByCreationDomain = (a: ICustomSegment, b: ICustomSegment) =>
    a.creationDate > b.creationDate
        ? -1
        : a.creationDate < b.creationDate // sort by creationDate desc
        ? 1
        : sortSegmentsByDomainName(a, b); // if same creationDate, sort by domain asc
const sortSegmentsGroupsByName = (a: ICustomSegmentsGroup, b: ICustomSegmentsGroup) =>
    a.name > b.name ? 1 : -1; // sort by name desc
const sortSegmentsGroupsByCreationName = (a: ICustomSegmentsGroup, b: ICustomSegmentsGroup) =>
    a.creationTime > b.creationTime
        ? -1
        : a.creationTime < b.creationTime // sort by creationTime desc
        ? 1
        : sortSegmentsGroupsByName(a, b); // if same creationTime, sort by domain asc

const matchSegmentByQuery = (segment: ICustomSegment, query: string) => {
    const queryLowered = query.toLowerCase();
    return (
        segment.domain?.toLowerCase().includes(queryLowered) ||
        segment.segmentName?.toLowerCase().includes(queryLowered)
    );
};
const matchSegmentsGroupsByQuery = (group: ICustomSegmentsGroup, query: string) => {
    const queryLowered = query.toLowerCase();
    return group.name?.toLowerCase().includes(queryLowered);
};

export const SegmentsUtils = {
    isMidTierUser: () => {
        try {
            return (
                swSettings.components.CustomSegments.resources.IsAdvancedUser &&
                !(
                    swSettings.components.ProductAggregatedClaims.resources
                        .SegmentsFullAccessTrial === "Open"
                )
            );
        } catch (e) {
            return false;
        }
    },
    getSegmentGroupById: (
        segmentGroups: ICustomSegmentsGroup[],
        groupId: string,
    ): ICustomSegmentsGroup => {
        return segmentGroups.find((group) => group?.id === groupId);
    },
    getSegmentById: (
        { segments = [] }: ICustomSegmentAvailableMembers,
        segmentId: string,
    ): ICustomSegment => {
        return segments.find((segment) => segment?.id === segmentId);
    },
    getSegmentWebsiteByDomain: (
        { websites = [] }: ICustomSegmentAvailableMembers,
        domain: string,
    ): ICustomSegmentGroupWebsite => websites.find((segWebsite) => segWebsite.domain === domain),

    getSegmentIdTypeByKey: (segmentKey: string): [string, SEGMENT_TYPES] => {
        const segmentKeyParts = segmentKey.split(SEGMENT_KEY_SEPARATOR, 2);
        let segmentId, segmentType;
        if (segmentKeyParts.length < 2) {
            segmentType = SEGMENT_TYPES.SEGMENT;
            segmentId = segmentKeyParts[0];
        } else {
            segmentType = SEGMENT_TYPES[segmentKeyParts[0]];
            segmentId = segmentKeyParts[1];
        }
        return [segmentId, segmentType];
    },

    getSegmentObjectByKey: (
        segmentKey: string,
        availableMembers: ICustomSegmentAvailableMembers,
    ): [ICustomSegmentMember, SEGMENT_TYPES] => {
        const [segmentId, segmentType] = SegmentsUtils.getSegmentIdTypeByKey(segmentKey);
        let segmentObj;
        switch (segmentType) {
            case SEGMENT_TYPES.SEGMENT:
                segmentObj = SegmentsUtils.getSegmentById(availableMembers, segmentId);
                break;
            case SEGMENT_TYPES.WEBSITE:
                segmentObj = SegmentsUtils.getSegmentWebsiteByDomain(availableMembers, segmentId);
                break;
        }
        return [segmentObj, segmentType];
    },
    getSegmentObjectsByKeys: (
        segmentKeys: string[],
        { segments = [], websites = [] }: ICustomSegmentAvailableMembers,
    ): [ICustomSegmentMember, SEGMENT_TYPES][] => {
        const segmentsDataMap: any = segments.reduce((acc, cur) => {
            acc[cur.id] = cur;
            return acc;
        }, {});
        const websitesDataMap: any = websites.reduce((acc, cur) => {
            acc[cur.domain] = cur;
            return acc;
        }, {});
        return segmentKeys.map((segKey) => {
            const [segId, segType] = SegmentsUtils.getSegmentIdTypeByKey(segKey);
            let segObj;
            switch (segType) {
                case SEGMENT_TYPES.SEGMENT:
                    segObj = segmentsDataMap[segId];
                    break;
                case SEGMENT_TYPES.WEBSITE:
                    segObj = websitesDataMap[segId];
                    break;
            }
            return [segObj, segType];
        });
    },

    getRulesString: (rules: IRule[]): string => {
        return rules?.reduce((acc, item, idx) => {
            const allRules = item.words
                ?.concat(item.exact)
                .concat(item.folders)
                .concat(item.exactURLS);
            acc +=
                allRules.length > 0
                    ? `${idx > 0 ? (item.type === 1 ? " NOT " : " AND ") : ""}(${allRules.join(
                          ", ",
                      )})`
                    : "";
            return acc;
        }, "");
    },

    // User countries are read from Conversion settings (sub-settings of Conversion, as ConversionOverview do not have filtered countries)
    getUserCountries: () => {
        if (!swSettings.components.CustomSegments.resources.Countries) {
            return [];
        }
        return Array.isArray(swSettings.components.CustomSegments.resources.Countries)
            ? swSettings.components.CustomSegments.resources.Countries
            : [swSettings.components.CustomSegments.resources.Countries];
    },

    getDefaultUserCountry: (
        userCountryFilter: string[] = undefined,
        priorityCountryFilter: string[] = undefined,
    ) => {
        const userCountries = userCountryFilter ?? SegmentsUtils.getUserCountries();
        const priorityCountries = priorityCountryFilter ?? DEFAULT_PRIORITY_COUNTRY_FILTER;
        const userPriorityCountryCode = priorityCountries.find((priorityCountry) =>
            _.includes(userCountries, +priorityCountry),
        );
        return userPriorityCountryCode ?? (userCountries[0] ? String(userCountries[0]) : undefined);
    },

    getDefaultFiltersParams: () => ({
        duration: "6m",
        country: SegmentsUtils.getDefaultUserCountry() || "840",
    }),

    getSegmentsAnalysisPrefKey: (pageId?: string) => {
        return SEGMENT_ANALYSIS_PREFERENCES_KEY + (pageId ? ":" + pageId : "");
    },

    getPageFilterParams: (pageId?: string): { [key: string]: any } => {
        const availableCountryCodes = SegmentsUtils.getUserCountries();
        let pref: { [key: string]: any };
        const segAnalysisPrefKey = SegmentsUtils.getSegmentsAnalysisPrefKey(pageId);
        pref = PreferencesService.get(segAnalysisPrefKey);
        const defaultFilterParams = SegmentsUtils.getDefaultFiltersParams();
        return {
            ...defaultFilterParams,
            ...pref,
            country:
                pref && availableCountryCodes.indexOf(Number.parseInt(pref.country, 10)) !== -1
                    ? pref.country
                    : defaultFilterParams.country,
        };
    },

    openMidTierUserUpsellModal: () => {
        openUnlockModal({
            modal: "segments",
            slide: "CustomSegmentsCommon",
        });
    },

    isSegmentAdvanced: (segment: ICustomSegment) => !segment.isWhiteListed,

    isGroupAdvanced: (
        group: ICustomSegmentsGroup,
        { segments = [] }: ICustomSegmentAvailableMembers,
    ) =>
        SegmentsUtils.getSegmentObjectsByKeys(group.segments, { segments }).every(
            ([segObj, segType]) =>
                segObj &&
                segType === SEGMENT_TYPES.SEGMENT &&
                !(segObj as ICustomSegment).isWhiteListed,
        ),

    isEntireGroupComposedOfAdvancedSegments(dataItem: {
        membersCount: number;
        name: string;
        id: string;
        versus: (ICustomSegment | ICustomSegmentGroupWebsite)[];
    }) {
        for (let i = 0; i < dataItem.versus.length; i++) {
            const item: any = dataItem.versus[i];
            const segType = SegmentsUtils.getSegmentIdTypeByKey(item.id);
            if (segType[item.id] === SEGMENT_TYPES.WEBSITE) {
                return false;
            } else if (item?.isWhiteListed) {
                return false;
            }
        }
        return true;
    },

    sortSegments: {
        byDomainName: sortSegmentsByDomainName,
        byCreationDomain: sortSegmentsByCreationDomain,
    },
    matchSegments: {
        byQuery: matchSegmentByQuery,
    },

    sortSegmentsGroups: {
        byName: sortSegmentsGroupsByName,
        byCreationName: sortSegmentsGroupsByCreationName,
    },
    matchSegmentsGroups: {
        byQuery: matchSegmentsGroupsByQuery,
    },
};
