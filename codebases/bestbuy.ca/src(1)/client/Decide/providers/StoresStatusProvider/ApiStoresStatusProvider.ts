import * as url from "url";

import fetch from "utils/fetch";
import {HttpRequestType} from "errors";

export default class ApiStoresStatusProvider {
    constructor(private baseUrl: string) {}

    public async getStoresStatus() {
        const storeStatusUrl = url.format(url.parse(`${this.baseUrl}/all.json`));
        try {
            const response = await fetch(storeStatusUrl, HttpRequestType.StoreStatusApi);
            const json = await response.json();
            return json;
        } catch (e) {
            return null;
        }
    }
}
