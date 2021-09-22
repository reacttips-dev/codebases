var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodeFetch from "node-fetch";
import * as fetch from "isomorphic-fetch";
import { HttpsAgent } from "agentkeepalive";
export var StatusCode;
(function (StatusCode) {
    StatusCode[StatusCode["OK"] = 200] = "OK";
    StatusCode[StatusCode["BadRequest"] = 400] = "BadRequest";
    StatusCode[StatusCode["NotFound"] = 404] = "NotFound";
    StatusCode[StatusCode["InternalServerError"] = 500] = "InternalServerError";
})(StatusCode || (StatusCode = {}));
const agent = typeof window === "undefined" && process.env.APP_ENV === "production" ?
    new HttpsAgent({
        maxSockets: process.env.HTTPS_AGENT_MAX_SOCKETS ? Number(process.env.HTTPS_AGENT_MAX_SOCKETS) : 160,
        maxFreeSockets: process.env.HTTPS_AGENT_MAX_FREE_SOCKETS ? Number(process.env.HTTPS_AGENT_MAX_FREE_SOCKETS) : 10,
        timeout: process.env.HTTPS_AGENT_TIMEOUT ? Number(process.env.HTTPS_AGENT_TIMEOUT) : 60000,
        freeSocketTimeout: process.env.HTTPS_AGENT_FREE_SOCKET_TIMEOUT ? Number(process.env.HTTPS_AGENT_FREE_SOCKET_TIMEOUT) : 300000,
    }) : null;
/**
 * Global Fetch utility for connection pooling
 * @param   {RequestInfo}   input   The url (string) or request object
 * @param   {RequestInit}   init    Request options
 * @returns {Promise<Response>}
 */
export default (input, init) => __awaiter(void 0, void 0, void 0, function* () {
    let response;
    const url = typeof input === 'string' ? input : (input && input.url);
    const _fetch = typeof window === "undefined" ? nodeFetch : fetch;
    try {
        const opts = Object.assign(Object.assign({ headers: {
                Connection: "keep-alive",
            }, credentials: "omit" }, (init || {})), { agent });
        response = yield _fetch(url, opts);
    }
    catch (error) {
        let errorMessage = `Error connecting to ${url} - ${error.message}`;
        // this helps identify CORS issues from users accessing site from non-public domain (i.e. azure)
        if (typeof (window) !== "undefined" && window.location && window.location.origin) {
            errorMessage = errorMessage.concat(` (window.location.origin=${window.location.origin})`);
        }
        console.error(errorMessage);
        return Promise.reject(error);
    }
    if (response.status !== StatusCode.OK) {
        console.error(`Error getting response from ${url} - (${response.status})`);
        return Promise.reject(response);
    }
    return response;
});
//# sourceMappingURL=index.js.map