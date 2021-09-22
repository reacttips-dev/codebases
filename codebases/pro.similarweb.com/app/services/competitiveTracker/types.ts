import { ICustomSegmentsMetaData } from "services/segments/segmentsApiService";

export type ITrackerID = string;

type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>;
// the tracker base object is a temporary Tracker that not been saved yet [exists only at client side]

export type ITrackerCompetitorAssets = PartialRecord<ETrackerAssetType, string[]>;

export interface ITrackerBase {
    name: string;
    type: ETrackerType;
    industryId?: string;
    country: number;
    mainPropertyId: string;
    mainPropertyType: ETrackerAssetType;
    competitors: ITrackerCompetitorAssets;
    parameters?: any;
}

export interface ITracker extends ITrackerBase {
    id: ITrackerID;
    lastUpdated: string;
}

export type ITrackers = ITracker[];

export enum ETrackerType {
    Research = 1,
    Marketing = 2,
}

export enum ETrackerAssetType {
    Website = 1,
    Segment = 2,
    Company = 3,
}

export interface ITrackerAPI {
    Id: ITrackerID;
    LastUpdated: string;
    Name: string;
    Type: ETrackerType;
    IndustryId?: string;
    Country: number;
    MainPropertyId: string;
    MainPropertyType: ETrackerAssetType;
    Competitors: ITrackerCompetitorAssets;
    Parameters?: any;
}

export type ITrackersAPI = ITrackerAPI[];

type IGenerateTrackerName = (name: string) => string;
type IHasTrackers = (type?: ETrackerType.Research) => boolean;

export interface ICompetitiveTrackerServiceUtils {
    generateTrackerName: IGenerateTrackerName;
    hasTrackers: IHasTrackers;
}

export interface ISegmentsModule {
    customSegmentsMeta?: ICustomSegmentsMetaData;
    segmentsLoading: boolean;
}
