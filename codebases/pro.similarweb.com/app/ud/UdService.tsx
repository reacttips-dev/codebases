import { DefaultFetchService } from "services/fetchService";

export interface IUDService {
    getFeatureFlags();
}

export default class UDService implements IUDService {
    protected fetchService;

    constructor() {
        this.fetchService = DefaultFetchService.getInstance();
    }

    public getFeatureFlags() {
        return this.fetchService.get("ud/flags");
    }

    public saveFeatureFlags(featureFlags: any) {
        return this.fetchService.post("/ud/save", {
            features: featureFlags,
        });
    }
}
