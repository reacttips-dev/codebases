import nodeFetch from "node-fetch";
import getLogger from "../../../common/logging/getLogger";
import {ConnectionError, HttpRequestError, HttpRequestType, StatusCode} from "../../errors";
import https from "https";
import http from "http";
import AbortController from "abort-controller";

const agentOptions = {
    keepAlive: true,
    maxSockets: process.env.HTTPS_AGENT_MAX_SOCKETS ? Number(process.env.HTTPS_AGENT_MAX_SOCKETS) : 160,
    maxFreeSockets: process.env.HTTPS_AGENT_MAX_FREE_SOCKETS ? Number(process.env.HTTPS_AGENT_MAX_FREE_SOCKETS) : 10,
    timeout: process.env.HTTPS_AGENT_TIMEOUT ? Number(process.env.HTTPS_AGENT_TIMEOUT) : 60000,
};

const DEFAULT_API_TIMEOUT = 3 * 1000;

const httpAgent = http && new http.Agent(agentOptions);
const httpsAgent = https && new https.Agent(agentOptions);

/**
 * Uses fetch API to fetch resources accross the network. Rejects the promise if there's ConnectionError or HttpRequestError
 * @param  {string} url The url to be fetched
 * @param  {HttpRequestType} httpRequestType The type of API
 * @returns {Promise<any>}
 */
export default async (
    url: string,
    httpRequestType?: HttpRequestType,
    init?: RequestInit,
    doNotModifyFailures?: boolean,
): Promise<any> => {
    let response;
    const isServerSide = typeof window === "undefined";
    const fetch: (input: RequestInfo, init?: RequestInit) => Promise<Response> = isServerSide
        ? (nodeFetch as any)
        : window.fetch;
    const endPoint = httpRequestType ? HttpRequestType[httpRequestType] : url;
    getLogger().info(`Making a request to ${url}`);

    const controller = isServerSide ? new AbortController() : null;
    const timeout = controller
        ? setTimeout(() => {
              getLogger().info(`Request timed out: ${url}`);
              controller.abort();
          }, Number(process.env.API_TIMEOUT) || DEFAULT_API_TIMEOUT)
        : null;
    try {
        const opts: RequestInit & {agent: https.Agent | http.Agent | null} = {
            headers: {
                Connection: "keep-alive",
            },
            credentials: "omit",
            ...(init || {}),
            agent: (parsedURL) => {
                if (!isServerSide || !https || !http) {
                    return null;
                }
                if (parsedURL.protocol === "http:") {
                    return httpAgent;
                } else {
                    return httpsAgent;
                }
            },
            signal: controller ? controller.signal : null,
        };
        response = await fetch(url, opts);
    } catch (error) {
        let errorMessage = `Error connecting to ${endPoint}-${error.message}`;
        // this helps identify CORS issues from users accessing site from non-public domain (i.e. azure)
        if (typeof window !== "undefined" && window.location && window.location.origin) {
            errorMessage = errorMessage.concat(` (window.location.origin=${window.location.origin})`);
        }

        const connectionError = new ConnectionError(httpRequestType, url, errorMessage, error);

        getLogger().error(connectionError);
        clearTimeout(timeout);
        return Promise.reject(connectionError);
    }

    clearTimeout(timeout);

    if (response.status !== StatusCode.OK) {
        const httpRequestError = new HttpRequestError(
            httpRequestType,
            url,
            `Error getting response from ${endPoint} (${response.status})`,
            null,
            response.status,
            response.headers,
            null,
        );

        getLogger().error(httpRequestError);
        if (doNotModifyFailures) {
            return response;
        }
        return Promise.reject(httpRequestError);
    }

    return response;
};
