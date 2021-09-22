import fetch from "../../utils/fetch";
import * as url from "url";

export default class StoreMessageProvider {
    constructor(private baseUrl: string) {}

    public async getStoreMessages() {
        const storeStatusUrl = url.format(url.parse(`${this.baseUrl}/all.json`));
        const response = await fetch(storeStatusUrl);
        return response.json();
    }
}
