import * as ac from "./action-creators";
import { ThunkDependencies } from "single-spa/store/thunk-dependencies";
import { ThunkDispatchCommon, ThunkGetState } from "single-spa/store/types";
import { EmailTemplateValues } from "../types/email";
import { BaseWebsiteType } from "../types/common";
import { BenchmarksSettingsDto } from "../types/settings";
import { BenchmarkResultType } from "../types/benchmarks";
import { BenchmarkCompetitorType, BenchmarkCompetitorUpdateType } from "../types/competitors";
import { makeObjectBaseOnKey } from "../../../helpers";
import { selectWorkspaceId } from "../../../store/selectors";
import {
    replaceCompetitor,
    mapToDomains,
    getUniqueBenchmarkId,
    extractBenchmarkCategories,
} from "../helpers";
import { sendBenchmarkEmailAsyncAction } from "./action-creators";
import { selectLegacyWorkspaceId } from "pages/sales-intelligence/sub-modules/common/store/selectors"; //TODO delete selectWorkspaceId after release 2.0
import { DefaultFetchService } from "../../../../../../services/fetchService";
import { BenchmarksEndpoint } from "../constants";
import { SwLog } from "@similarweb/sw-log";
import {
    selectBenchmarksDomainToken,
    selectCompetitors,
} from "pages/workspace/sales/sub-modules/benchmarks/store/selectors";
import {
    wasNotRemoved,
    toUpdateCompetitorDto,
    removeSimilarSiteAddedProperty,
    wasTouched,
} from "pages/sales-intelligence/sub-modules/right-sidebar/helpers/similar-sites";
import { selectOpportunityListTable } from "pages/sales-intelligence/sub-modules/opportunities/store/selectors";
import { emailSendIndicatorUpdate } from "pages/sales-intelligence/sub-modules/opportunities/store/action-creators";

const fetchService = DefaultFetchService.getInstance();

export const fetchTopicsThunkAction = () => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchTopicsAsyncAction.request());

    try {
        const topics = await deps.si.api.benchmarks.fetchTopics();

        dispatch(ac.fetchTopicsAsyncAction.success(topics));
    } catch (e) {
        dispatch(ac.fetchTopicsAsyncAction.failure(e));
    }
};

export const fetchSettingsThunkAction = () => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchSettingsAsyncAction.request());

    try {
        const workspaceId = selectLegacyWorkspaceId(getState()) || selectWorkspaceId(getState()); //TODO delete selectWorkspaceId after release 2.0
        const settings = await deps.si.api.benchmarks.fetchSettings(workspaceId);

        dispatch(ac.fetchSettingsAsyncAction.success(settings || {}));
    } catch (e) {
        dispatch(ac.fetchSettingsAsyncAction.failure(e));
    }
};

export const updateSettingsThunkAction = (dto: BenchmarksSettingsDto) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.updateSettingsAsyncAction.request());

    try {
        const workspaceId = selectLegacyWorkspaceId(getState()) || selectWorkspaceId(getState()); //TODO delete selectWorkspaceId after release 2.0
        const settings = await deps.si.api.benchmarks.updateSettings(workspaceId, dto);

        dispatch(ac.updateSettingsAsyncAction.success(settings));
    } catch (e) {
        dispatch(ac.updateSettingsAsyncAction.failure(e));
    }
};

export const fetchBenchmarksThunkAction = (domain: string) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchBenchmarksAsyncAction.request());

    try {
        const token = selectBenchmarksDomainToken(getState());
        const workspaceId = selectLegacyWorkspaceId(getState()) || selectWorkspaceId(getState()); //TODO delete selectWorkspaceId after release 2.0
        const { results, quota, domainToken } = await deps.si.api.benchmarks.fetchBenchmarks(
            workspaceId,
            domain,
            token,
        );
        const categories = extractBenchmarkCategories(results);

        dispatch(ac.setBenchmarkCategoriesAction(categories));
        dispatch(ac.setActiveBenchmarkCategoryAction(categories[0]));
        dispatch(ac.fetchBenchmarksQuotaAsync.success(quota));
        dispatch(ac.fetchBenchmarksAsyncAction.success(results));
        dispatch(ac.setDomainTokenAction(domainToken));
    } catch (e) {
        if (e?.name !== "AbortError") {
            dispatch(ac.fetchBenchmarksAsyncAction.failure(e));
        }
    }
};

export const fetchBenchmarksQuotaThunk = () => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchBenchmarksQuotaAsync.request());

    try {
        const quota = await deps.si.api.benchmarks.fetchBenchmarksQuota();

        dispatch(ac.fetchBenchmarksQuotaAsync.success(quota));
    } catch (e) {
        dispatch(ac.fetchBenchmarksQuotaAsync.failure(e));
    }
};

export const fetchTopBenchmarkThunkAction = (domain: string, country: string) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchTopBenchmarkAsyncAction.request());

    try {
        const state = getState();

        const workspaceId = selectLegacyWorkspaceId(state) || selectWorkspaceId(state);

        const topBenchmark = await deps.si.api.benchmarks.fetchTopBenchmark(
            workspaceId,
            domain,
            country,
        );

        dispatch(ac.fetchTopBenchmarkAsyncAction.success(topBenchmark));
    } catch (e) {
        dispatch(ac.fetchTopBenchmarkAsyncAction.failure(e));
    }
};

export const fetchCountrySharesThunkAction = (domain: string) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchCountrySharesAsyncAction.request());
    try {
        const countryShares = await deps.si.api.benchmarks.fetchCountryShares(domain);
        dispatch(
            ac.fetchCountrySharesAsyncAction.success(makeObjectBaseOnKey(countryShares, "country")),
        );
    } catch (e) {
        if (e?.name !== "AbortError") {
            dispatch(ac.fetchCountrySharesAsyncAction.failure(e));
        }
    }
};

export const fetchCompetitorsThunkAction = (domain: string) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchCompetitorsAsyncAction.request());

    try {
        const workspaceId = selectLegacyWorkspaceId(getState()) || selectWorkspaceId(getState()); //TODO delete selectWorkspaceId after release 2.0
        const competitors = await deps.si.api.benchmarks.fetchCompetitors(workspaceId, domain);

        dispatch(ac.fetchCompetitorsAsyncAction.success(competitors));
    } catch (e) {
        if (e?.name !== "AbortError") {
            dispatch(ac.fetchCompetitorsAsyncAction.failure(e));
        }
    }
};

export const updateCompetitorsThunkAction = (prospectDomain: string) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.updateCompetitorAsyncAction.request());

    const similarSites = selectCompetitors(getState());

    try {
        const workspaceId = selectLegacyWorkspaceId(getState()) || selectWorkspaceId(getState()); //TODO delete selectWorkspaceId after release 2.0
        await deps.si.api.benchmarks.updateCompetitors(
            workspaceId,
            prospectDomain,
            similarSites.filter(wasTouched).map(toUpdateCompetitorDto),
        );

        dispatch(
            ac.updateCompetitorAsyncAction.success(
                similarSites.filter(wasNotRemoved).map(removeSimilarSiteAddedProperty),
            ),
        );
    } catch (e) {
        dispatch(ac.updateCompetitorAsyncAction.failure(e));
    }
};

export const fetchSingleBenchmarkThunkAction = (benchmarkResult: BenchmarkResultType) => async (
    dispatch: ThunkDispatchCommon,
    getState: ThunkGetState,
    deps: ThunkDependencies,
) => {
    dispatch(ac.fetchSingleBenchmarkAsyncAction.request(getUniqueBenchmarkId(benchmarkResult)));

    try {
        const { country, benchmark, prospect, competitors } = benchmarkResult;
        const defaultCompetitors = competitors.filter((c) => !c.isUserDefined);
        const userDefinedCompetitors = competitors.filter((c) => c.isUserDefined);
        const workspaceId = selectLegacyWorkspaceId(getState()) || selectWorkspaceId(getState()); //TODO delete selectWorkspaceId after release 2.0
        const benchmarkDto = await deps.si.api.benchmarks.fetchSingleBenchmark(
            workspaceId,
            prospect.domain,
            {
                country,
                benchmark: benchmark.metric,
                competitors: mapToDomains(defaultCompetitors),
                customCompetitors: mapToDomains(userDefinedCompetitors),
            },
        );

        dispatch(ac.fetchSingleBenchmarkAsyncAction.success(benchmarkDto));
    } catch (e) {
        dispatch(ac.fetchSingleBenchmarkAsyncAction.failure(e));
    }
};

export const addCompetitorInABenchmarkThunkAction = (
    newCompetitor: BaseWebsiteType,
    benchmarkResult: BenchmarkResultType,
) => async (dispatch: ThunkDispatchCommon) => {
    dispatch(ac.addCompetitorInABenchmarkAction({ newCompetitor, benchmarkResult }));
    await dispatch(
        fetchSingleBenchmarkThunkAction({
            ...benchmarkResult,
            competitors: [
                ...benchmarkResult.competitors,
                { ...newCompetitor, isUserDefined: true },
            ] as BenchmarkCompetitorType[],
        }),
    );
};

export const removeCompetitorInABenchmarkThunkAction = (
    domain: BaseWebsiteType["domain"],
    benchmarkResult: BenchmarkResultType,
) => async (dispatch: ThunkDispatchCommon) => {
    dispatch(ac.removeCompetitorInABenchmarkAction({ domain, benchmarkResult }));
    await dispatch(
        fetchSingleBenchmarkThunkAction({
            ...benchmarkResult,
            competitors: benchmarkResult.competitors.filter((c) => c.domain !== domain),
        }),
    );
};

export const updateCompetitorInABenchmarkThunkAction = (
    newCompetitor: BaseWebsiteType,
    info: BenchmarkCompetitorUpdateType,
) => async (dispatch: ThunkDispatchCommon) => {
    dispatch(ac.updateCompetitorInABenchmarkAction({ newCompetitor, info }));
    await dispatch(
        fetchSingleBenchmarkThunkAction({
            ...info.benchmarkResult,
            competitors: replaceCompetitor(
                {
                    ...newCompetitor,
                    isUserDefined: true,
                },
                info.prevDomain,
            )(info.benchmarkResult.competitors) as BenchmarkCompetitorType[],
        }),
    );
};

export const sendEmailSingleBenchmarkThunkAction = (
    id: string,
    domain: string,
    template: EmailTemplateValues,
) => async (dispatch: ThunkDispatchCommon, getState: ThunkGetState, deps: ThunkDependencies) => {
    dispatch(sendBenchmarkEmailAsyncAction.request(id));

    try {
        // FIXME temporary solution until back end will handle it sim-35107
        const { Data } = selectOpportunityListTable(getState());

        const newData = Data.map((item) => {
            if (item.site === domain) {
                return { ...item, isLatestSnapshotSent: true };
            }
            return item;
        });
        await deps.si.api.benchmarks.requestEmailSend(domain, template);
        dispatch(emailSendIndicatorUpdate(newData));
        dispatch(ac.sendBenchmarkEmailAsyncAction.success());
    } catch (e) {
        dispatch(ac.sendBenchmarkEmailAsyncAction.failure());
    }
};

export const updateBenchmarkSettingsThunkAction = (
    dto: BenchmarksSettingsDto,
    domain: string,
) => async (dispatch: ThunkDispatchCommon) => {
    try {
        await dispatch(updateSettingsThunkAction(dto));
        return dispatch(fetchCompetitorsThunkAction(domain));
    } catch (e) {
        SwLog.error(e);
    }
};

export const fetchWebsites = (country: number, benchmark: string, q: string) => async () => {
    try {
        //TODO: Consider remaking whole search logic for similar websites to use Redux
        return await fetchService.get(
            `${BenchmarksEndpoint.WEBSITES}?country=${country}&metric=${benchmark}&q=${q}`,
        );
    } catch (e) {
        SwLog(e);
    }
};
