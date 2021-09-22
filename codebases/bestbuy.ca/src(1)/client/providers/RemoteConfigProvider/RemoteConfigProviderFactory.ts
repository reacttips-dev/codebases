import { RemoteConfigProvider } from "./";
import { ApiRemoteConfigProvider } from "./ApiRemoteConfigProvider";
import { CachedRemoteConfigProvider } from "./CachedRemoteConfigProvider";

export function createRemoteConfigProvider(remoteConfigUrl: string): RemoteConfigProvider {
    if ( typeof(window) === "undefined") {
        return new CachedRemoteConfigProvider(new ApiRemoteConfigProvider(remoteConfigUrl));
    }
    return new ApiRemoteConfigProvider(remoteConfigUrl);
}
