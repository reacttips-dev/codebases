import * as url from "url";
import { HttpRequestType } from "../../errors";
import { RemoteConfig } from "../../models";
import fetch from "../../utils/fetch";
import { RemoteConfigProvider } from "./";

export class ApiRemoteConfigProvider implements RemoteConfigProvider {

    constructor(private baseUrl: string) { }

    public async getConfigs(): Promise<RemoteConfig> {
        const remoteConfigUrl = url.parse(this.baseUrl);
        const formattedUrl = url.format(remoteConfigUrl);
        const response = await fetch(formattedUrl, HttpRequestType.RemoteConfigApi);
        const text = await response.text() as string;
        let object = text;
        if (text.indexOf("=") > -1) {
            object = text.substring(text.indexOf("=") + 1, text.lastIndexOf(";"));
        }
        const json = JSON.parse(object);

        const remoteConfig: RemoteConfig = {
            isAddToCartEnabled: json.isAddToCartEnabled,
            isPlpAvailabilityEnabled: json.enablePlpAvailability,
            isQueueItEnabled: json.isQueueItEnabledReactSite,
            isRpuEnabled: json.ispuEnabled,
            isCheckoutQueueEnabled: json.isQueueItEnabledReactSite,
            isServerSideRenderEnabled: json.isServerSideRenderEnabled,
            isTargetEnabled: json.isTargetEnabled,
            isLightweightBasket: !(json.enableExpressCheckout === undefined || json.enableExpressCheckout === true),
        };

        return remoteConfig;
    }
}
