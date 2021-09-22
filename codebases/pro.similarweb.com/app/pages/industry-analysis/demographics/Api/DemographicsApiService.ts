import _ from "lodash";
import { DefaultFetchService } from "services/fetchService";

import {
    IDemographicsApiAgeChartData,
    IDemographicsApiGenderChartData,
    IDemographicsApiParams,
    IDemographicsApiService,
    IDemographicsApiTableData,
} from "./DemographicsApiServiceTypes";
import categoryService from "common/services/categoryService";

const TIME_GRANULARITY = "Monthly";

export class DemographicsApiService implements IDemographicsApiService {
    private fetchService: DefaultFetchService;
    private get apiEndpoint(): string {
        return "/widgetApi/IndustryAnalysisDemographics";
    }

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }

    private prepareApiParams = (params: IDemographicsApiParams) => {
        const { country, from, to, category, webSource, includeSubDomains = true } = params;
        const categoryObject = categoryService.categoryQueryParamToCategoryObject(category);
        return _.pickBy(
            {
                country,
                from,
                to,
                includeSubDomains,
                keys: categoryObject?.forApi,
                category: categoryObject?.forDisplayApi,
                timeGranularity: TIME_GRANULARITY,
                webSource,
            },
            (p) => !_.isUndefined(p),
        );
    };

    public getDemographicsGenderDistribution = async (
        params: IDemographicsApiParams,
    ): Promise<IDemographicsApiGenderChartData> => {
        const genderApiParams = this.prepareApiParams(params);
        const genderApiEndpoint = `${this.apiEndpoint}/IndustryAnalysisDemographicsGender/PieChart`;

        const response = await this.fetchService.get<IDemographicsApiGenderChartData>(
            genderApiEndpoint,
            genderApiParams,
        );
        return response;
    };

    public getDemographicsAgeDistribution = async (
        params: IDemographicsApiParams,
    ): Promise<IDemographicsApiAgeChartData> => {
        const ageApiParams = this.prepareApiParams(params);
        const ageApiEndpoint = `${this.apiEndpoint}/IndustryAnalysisDemographicsAge/PieChart`;

        const response = await this.fetchService.get<IDemographicsApiAgeChartData>(
            ageApiEndpoint,
            ageApiParams,
        );
        return response;
    };

    public getDemographicsTable = async (
        params: IDemographicsApiParams,
    ): Promise<IDemographicsApiTableData> => {
        const tableApiParams = this.prepareApiParams(params);
        const tableApiEndpoint = `${this.apiEndpoint}/IndustryAnalysisDemographics/Table`;

        const response = await this.fetchService.get<IDemographicsApiTableData>(
            tableApiEndpoint,
            tableApiParams,
        );
        return response;
    };
}
