import { ISegmentData } from "pages/conversion/ConversionSegmentsUtils";
import { DefaultFetchService } from "../fetchService";

const SEGMENTS_API = "/api/userdata/segments/all";

export interface ISegmentGroupData {
    creationType: string;
    id: string;
    name: string;
    segments: string[];
}

export interface ISegmentIndustryData {
    id: string;
    name: string;
    groups: string[];
}

export interface ISegmentDomainData {
    domain: string;
    favicon: string;
    segments: string[];
}

export interface ISegmentsData {
    segments: {
        [id: string]: ISegmentData;
    };
    segmentGroups: {
        [id: string]: ISegmentGroupData;
    };
    segmentIndustries: ISegmentIndustryData[];
    segmentDomains: {
        [domain: string]: ISegmentDomainData;
    };
}

export interface IConversionSegmentsService {
    getAllSegmentsData(): Promise<ISegmentsData>;
}

export class ConversionSegmentsService implements IConversionSegmentsService {
    public static getInstance() {
        if (!ConversionSegmentsService.instance) {
            ConversionSegmentsService.instance = new ConversionSegmentsService();
        }
        return ConversionSegmentsService.instance;
    }
    private static instance: ConversionSegmentsService;
    private fetchService: any;

    private constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }

    public getAllSegmentsData(): Promise<ISegmentsData> {
        return this.fetchService.get(SEGMENTS_API);
    }
}
