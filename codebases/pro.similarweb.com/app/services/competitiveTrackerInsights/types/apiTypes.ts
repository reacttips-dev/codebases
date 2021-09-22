/**
 * The id of the current entity: domain name / category id / segment id
 */
export type InsightEntityId = string;

/**
 * An enum representing the current entity that the insights are based on.
 * this enum represents the entity type values as returned from the backend (API)
 */
export enum InsightEntityTypeEnum {
    Domain = 1,
    Segment = 2,
    Industry = 3,
}

/**
 * All possible insight types, as returned from the backend (API)
 */
export type InsightType =
    | "AvgVisitDuration"
    | "BounceRate"
    | "PagesPerVisit"
    | "UniqueVisitors"
    | "Visits"
    | "NewVsReturning"
    | "CrossVisits"
    | "ExclusiveVisitors"
    | "TrafficShare";

/**
 * A single record from the api response
 */
export interface ITrackerInsightApiRecord {
    Id: InsightEntityId;
    Type: InsightEntityTypeEnum;
    Change: number;
    IsRelative: boolean;
}

/**
 * API response object for an insights request.
 * the response consists of a mapping between insight types
 * and their underlying insights. NOTE: not all fields may be present
 * for every API call. therefore all of the fields are optional.
 */
export interface ITrackerInsightApiResult {
    AvgVisitDuration?: ITrackerInsightApiRecord[];
    BounceRate?: ITrackerInsightApiRecord[];
    PagesPerVisit?: ITrackerInsightApiRecord[];
    UniqueVisitors?: ITrackerInsightApiRecord[];
    Visits?: ITrackerInsightApiRecord[];
    NewVsReturning?: ITrackerInsightApiRecord[];
    CrossVisits?: ITrackerInsightApiRecord[];
    ExclusiveVisitors?: ITrackerInsightApiRecord[];
    TrafficShare?: ITrackerInsightApiRecord[];

    /**
     * Entity images: website images / category icons.
     */
    Favicons: Record<InsightEntityId, string>;
}
