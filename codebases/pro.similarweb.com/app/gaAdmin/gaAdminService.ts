import config from "./config";

export interface IGAProfilesListParams {
    page: number;
    pageSize: number;
}

const defaultFetchGetData = (response: Response) => response.json();

export class GAAdminService {
    public static paramsToQueryString(params: { [key: string]: any } = {}) {
        return Object.keys(params)
            .map(
                (key) =>
                    `${encodeURIComponent(String(key))}=${encodeURIComponent(
                        String(params[key]) ?? "",
                    )}`,
            )
            .join("&");
    }

    public readonly ERROR_FETCH_STATUS = "FetchStatusError";
    public readonly ERROR_FETCH_UNREACHABLE = "FetchUnreachableError";

    private readonly gaProfilesUrl: string;

    constructor() {
        this.gaProfilesUrl = `${config.gaAdminBackendUrl}/gaProfiles`;
    }

    public async getGAProfiles(params?: IGAProfilesListParams) {
        const { page = 1, pageSize = 50 } = params || {};
        const qs = GAAdminService.paramsToQueryString({
            page,
            pageSize,
        });
        const responsePromise = fetch(`${this.gaProfilesUrl}/list?${qs}`);
        return await this._fetchData(responsePromise);
    }

    public async getGAProfileByDomain(domain) {
        const qs = GAAdminService.paramsToQueryString({
            value: domain,
        });
        const responsePromise = fetch(`${this.gaProfilesUrl}/domain?${qs}`);
        return await this._fetchData(responsePromise);
    }

    public async getGAProfilesByEmail(email, params?: IGAProfilesListParams) {
        const { page = 1, pageSize = 50 } = params || {};
        const qs = GAAdminService.paramsToQueryString({
            value: email,
            page,
            pageSize,
        });
        const responsePromise = fetch(`${this.gaProfilesUrl}/email?${qs}`);
        return await this._fetchData(responsePromise);
    }

    public async getGAProfilesBySWUserEmail(email, params?: IGAProfilesListParams) {
        const { page = 1, pageSize = 50 } = params || {};
        const qs = GAAdminService.paramsToQueryString({
            value: email,
            page,
            pageSize,
        });
        const responsePromise = fetch(`${this.gaProfilesUrl}/swUserEmail?${qs}`);
        return await this._fetchData(responsePromise);
    }

    private async _fetchData(
        fetchPromise: Promise<Response>,
        getData: (response) => any = defaultFetchGetData,
    ) {
        let response;
        try {
            response = await fetchPromise;
        } catch (err) {
            let error = err;
            if (err instanceof TypeError) {
                error = new Error(`Request failure`);
                error.name = this.ERROR_FETCH_UNREACHABLE;
            }
            throw error;
        }
        if (!response.ok) {
            const error = new Error(`Request failure (status ${response.status})`);
            error.name = this.ERROR_FETCH_STATUS;
            error["status"] = response.status;
            throw error;
        }
        return getData(response);
    }
}

export default new GAAdminService();
