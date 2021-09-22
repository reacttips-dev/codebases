import { compose } from "redux";
import { EmailTemplateValues } from "../types/email";
import { TopicType } from "../types/topics";
import { CountryShare } from "../types/common";
import { BenchmarksSettingsDto } from "../types/settings";
import {
    BenchmarkResultDto,
    BenchmarkRequestQueryParamsType,
    BenchmarksResponseDto,
    BenchmarksQuotaType,
} from "../types/benchmarks";
import { BenchmarksEndpoint } from "../constants";
import { createCancelable } from "../../../helpers";
import { appendAQueryParamIfDefined } from "../helpers";
import {
    CompetitorUpdateDto,
    SimilarSiteType,
} from "pages/sales-intelligence/sub-modules/right-sidebar/types/similar-sites";
import { IFetchService } from "services/fetchService";

export const createBenchmarksApiService = (fetchService: IFetchService) => {
    /**
     * Replacing the path {domain} placeholder with a domain string
     * @param domain
     */
    const replaceDomain = (domain: string) => (path: string) => {
        return path.replace("{domain}", domain);
    };

    /**
     * Replacing the path {workspaceId} placeholder with an id string
     * @param id
     */
    const replaceWorkspaceId = (id: string) => (path: string) => {
        return path.replace("{workspaceId}", id);
    };
    const replaceCountry = (id: string) => (path: string) => {
        return path.replace("{country}", id);
    };
    /**
     * Build a full url with all query params
     * Multiple query params with the same name are not supported by default
     * @param query
     */
    const pleaseKillMeAddBenchmarksRequestParams = (query: BenchmarkRequestQueryParamsType) => (
        url: string,
    ) => {
        const { competitors = [], customCompetitors = [], ...rest } = query;

        return compose(
            appendCompetitorParams(competitors),
            appendCustomCompetitorParams(customCompetitors),
        )(
            Object.keys(rest).reduce((path, name) => {
                return appendAQueryParamIfDefined(name, rest[name])(path);
            }, url),
        );
    };

    /**
     * Create query params for given competitors
     * @param competitors
     */
    const appendCompetitorParams = (competitors: string[]) => (url: string) => {
        if (competitors.length === 0) {
            return url;
        }

        return competitors.reduce((path, domain) => {
            return appendAQueryParamIfDefined("competitor", domain)(path);
        }, url);
    };

    /**
     * Create query params for given custom competitors
     */
    const appendCustomCompetitorParams = (competitors: string[]) => (url: string) => {
        if (competitors.length === 0) {
            return url;
        }

        return competitors.reduce((path, domain) => {
            return appendAQueryParamIfDefined("customCompetitor", domain)(path);
        }, url);
    };

    return {
        /**
         * Fetches list of available topics for configuration
         */
        fetchTopics(): Promise<TopicType[]> {
            return fetchService.get(BenchmarksEndpoint.TOPICS);
        },
        /**
         * Fetches current configuration settings (selected topics)
         * @param workspaceId
         */
        fetchSettings(workspaceId: string): Promise<BenchmarksSettingsDto> {
            return fetchService.get(replaceWorkspaceId(workspaceId)(BenchmarksEndpoint.SETTINGS));
        },
        /**
         * Updates current configuration settings
         * @param workspaceId
         * @param payload
         */
        updateSettings(
            workspaceId: string,
            payload: BenchmarksSettingsDto,
        ): Promise<BenchmarksSettingsDto> {
            return fetchService.post(
                replaceWorkspaceId(workspaceId)(BenchmarksEndpoint.SETTINGS),
                payload,
            );
        },
        fetchBenchmarks: createCancelable(
            /**
             * Fetches list of benchmarks for given domain
             * @param signal
             * @param workspaceId
             * @param domain
             * @param token
             */
            (
                signal: AbortSignal,
                workspaceId: string,
                domain: string,
                token: string,
            ): Promise<BenchmarksResponseDto> => {
                return fetchService.get(
                    compose(
                        replaceDomain(domain),
                        replaceWorkspaceId(workspaceId),
                    )(BenchmarksEndpoint.OPPORTUNITIES),
                    {},
                    {
                        headers: {
                            "sw-domain-token": token,
                        },
                        cancellation: signal,
                    },
                );
            },
        ),
        /**
         * Fetch insights generator quota object for current user
         */
        fetchBenchmarksQuota(): Promise<BenchmarksQuotaType> {
            return fetchService.get(BenchmarksEndpoint.QUOTA);
        },
        fetchTopBenchmark(workspaceId: string, domain: string, country: string): Promise<any> {
            return fetchService.get(
                compose(
                    replaceCountry(country),
                    replaceDomain(domain),
                    replaceWorkspaceId(workspaceId),
                )(BenchmarksEndpoint.TOP_OPPORTUNITY),
            );
        },
        /**
         * Fetch single opportunity based on given competitors/metric/country
         * @param workspaceId
         * @param prospect
         * @param query
         */
        fetchSingleBenchmark(
            workspaceId: string,
            prospect: string,
            query: BenchmarkRequestQueryParamsType = {},
        ): Promise<BenchmarkResultDto> {
            return fetchService.get(
                compose(
                    pleaseKillMeAddBenchmarksRequestParams(query),
                    replaceDomain(prospect),
                    replaceWorkspaceId(workspaceId),
                )(BenchmarksEndpoint.OPPORTUNITY),
            );
        },
        fetchCompetitors: createCancelable(
            /**
             * Fetches list of competitors for given domain
             * @param signal
             * @param workspaceId
             * @param domain
             */
            (
                signal: AbortSignal,
                workspaceId: string,
                domain: string,
            ): Promise<SimilarSiteType[]> => {
                return fetchService.get(
                    compose(
                        replaceDomain(domain),
                        replaceWorkspaceId(workspaceId),
                    )(BenchmarksEndpoint.COMPETITORS),
                    {},
                    { cancellation: signal },
                );
            },
        ),
        /**
         * Updates list of competitors for given domain
         * @param workspaceId
         * @param domain
         * @param competitors
         */
        updateCompetitors(
            workspaceId: string,
            domain: string,
            competitors: CompetitorUpdateDto[],
        ): Promise<null> {
            return fetchService.post(
                compose(
                    replaceDomain(domain),
                    replaceWorkspaceId(workspaceId),
                )(BenchmarksEndpoint.COMPETITORS),
                competitors,
            );
        },
        /**
         * Requesting similar sites for given prospect.
         * Optionally takes metric and single or multiple countries.
         * @param domain
         * @param country
         * @param metric
         */
        fetchSimilarWebsites(
            domain: string,
            country?: number[] | number,
            metric?: string,
        ): Promise<{ name: string; image: string; metricValue: number }[]> {
            let queryString = "?";

            if (metric) {
                queryString += `metric=${metric}`;
            }

            if (country) {
                if (queryString !== "?") {
                    queryString += "&";
                }

                if (Array.isArray(country)) {
                    queryString += `${country.map((id) => `country=${id}`).join("&")}`;
                } else {
                    queryString += `country=${country}`;
                }
            }

            const url = replaceDomain(domain)(BenchmarksEndpoint.SIMILAR_SITES);

            return fetchService.get(queryString.length > 1 ? url + queryString : url);
        },
        /**
         * Requesting email sending
         * @param domain
         * @param email
         */
        requestEmailSend(domain: string, email: EmailTemplateValues): Promise<void> {
            return fetchService.post(
                compose(replaceDomain(domain))(BenchmarksEndpoint.EMAIL),
                email,
            );
        },
        fetchCountryShares: createCancelable(
            /**
             * Requests country shares for given domain
             * @param signal
             * @param domain
             */
            (signal: AbortSignal, domain: string): Promise<CountryShare[]> => {
                return fetchService.get(
                    replaceDomain(domain)(BenchmarksEndpoint.PROSPECTS_COUNTRY),
                    {},
                    { cancellation: signal },
                );
            },
        ),
    };
};
