import { GeneralFetchService } from "services/fetchService";
import { ApiKey } from "./types";

export class ApiManagementService {
    private fetchService: GeneralFetchService;
    constructor() {
        this.fetchService = GeneralFetchService.getInstance();
    }

    public async getUserKeys(): Promise<ApiKey[]> {
        return this.fetchService.get<ApiKey[]>("/api/api-management/user-keys");
    }
}
