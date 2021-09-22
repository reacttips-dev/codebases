import { RemoteConfig } from "../../models";
import { RemoteConfigProvider } from "./";
import remoteConfigCache from "./RemoteConfigCache";

export class CachedRemoteConfigProvider implements RemoteConfigProvider {

    constructor(private remoteConfigProvider: RemoteConfigProvider) {}

    public async getConfigs(): Promise<RemoteConfig> {

        const REMOTE_CONFIG_CACHE_KEY = "remote-config";

        let remoteConfig: RemoteConfig = remoteConfigCache.get(REMOTE_CONFIG_CACHE_KEY);

        if ( remoteConfig ) {
            return Promise.resolve(remoteConfig);
        }

        remoteConfig = await this.remoteConfigProvider.getConfigs();
        remoteConfigCache.set(REMOTE_CONFIG_CACHE_KEY, remoteConfig);
        return remoteConfig;
    }
}
