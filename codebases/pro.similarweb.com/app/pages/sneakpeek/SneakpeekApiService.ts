import { swSettings } from "common/services/swSettings";
import { Injector } from "../../../scripts/common/ioc/Injector";
import { DefaultFetchService } from "../../services/fetchService";
import { modulesEntityMap } from "./constants";

const _fetchService = DefaultFetchService.getInstance();

function transformDynamicParamsToServer(query, params) {
    let retQuery = query;
    Object.keys(params).forEach(
        (paramName) => (retQuery = retQuery.split(paramName).join(`{${paramName.substring(1)}}`)),
    );
    return retQuery;
}

function transformDynamicParamsFromServer(query, params) {
    let retQuery = query;
    Object.keys(params).forEach(
        (paramName) => (retQuery = retQuery.split(`{${paramName.substring(1)}}`).join(paramName)),
    );
    return retQuery;
}

export class SneakpeekApiService {
    public static getQueriesList = async () => {
        const swNavigator = Injector.get("swNavigator") as any;
        const module = swNavigator.current().name;
        const data = (await _fetchService.get(
            `/api/DynamicData/List?entity=${modulesEntityMap(module).entity}`,
        )) as any;
        return data
            .filter((record) => record.Title)
            .map((record) => ({
                id: record.Id,
                text: record.Title,
            }));
    };

    public static getDatabases = async () => {
        const response = (await _fetchService.get("api/DynamicData/Databases")) as any;
        return response.map((database) => ({
            id: database,
            text: database,
        }));
    };

    public static getMetadata = async (queryId) => {
        const { Database, Sql, Type, Title, Id, Meta } = (await _fetchService.get(
            `/api/DynamicData/metadata?queryId=${queryId}`,
        )) as any;
        return {
            database: Database,
            type: Type.toLowerCase(),
            title: Title,
            queryId: Id,
            sql: transformDynamicParamsFromServer(Sql, Meta.dynamicParams),
            meta: {
                rawColumns: Meta.columns,
                columns: Meta.columns ? Object.values(Meta.columns) : [],
                dynamicParams: Meta.dynamicParams || {},
                yaxis: Meta.yaxis || "",
                granularity: Meta.granularity || "daily",
                feedback: {
                    sendTo:
                        Meta.feedback && Meta.feedback.sendTo
                            ? Meta.feedback.sendTo
                            : swSettings.user.username,
                    questions:
                        Meta.feedback && Meta.feedback.questions ? Meta.feedback.questions : [],
                },
            },
        };
    };

    public static validateQury = async (params, sql, dynamicParams, db, granularity) => {
        return await _fetchService.post(`/api/DynamicData/validate?${params}`, {
            sql,
            dynamicParams,
            db,
            granularity,
        });
    };

    public static ExecuteQuery = async (params, payload) => {
        return await _fetchService.post(`/api/DynamicData/ExecuteQuery?${params}`, payload);
    };

    public static SaveTableQuery = async (params, sql, dynamicParams) => {
        return await _fetchService.post(
            `/api/DynamicData/SaveTableQuery?${params}`,
            transformDynamicParamsToServer(sql, dynamicParams),
        );
    };

    public static SaveGraphQuery = async (params, sql, dynamicParams) => {
        return await _fetchService.post(
            `/api/DynamicData/SaveGraphQuery?${params}`,
            transformDynamicParamsToServer(sql, dynamicParams),
        );
    };

    public static SavePieChartQuery = async (params, sql, dynamicParams) => {
        return await _fetchService.post(
            `/api/DynamicData/SavePieChartQuery?${params}`,
            transformDynamicParamsToServer(sql, dynamicParams),
        );
    };

    public static DeleteQuery = async (queryId) => {
        return await _fetchService.delete(`/api/DynamicData/DeleteQuery?queryId=${queryId}`);
    };

    public static sendFeedback = async (params, questionsAndAnswers) => {
        return await _fetchService.post(
            `/api/DynamicData/SendFeedback?${params}`,
            questionsAndAnswers,
        );
    };
}
