import { lazyLaunchStoreUrl } from 'owa-addins-marketplace';

export interface InClientStoreRouteParameters {
    assetId?: string;
    campaignId?: string;
    providerId?: string;
}

export default function inClientStoreRouteHandler(parameters: InClientStoreRouteParameters) {
    if (parameters.assetId) {
        if (parameters.campaignId && parameters.providerId) {
            lazyLaunchStoreUrl.import().then(launchDetailsPage => {
                launchDetailsPage(
                    false /*openHomePage = false*/,
                    parameters.assetId,
                    parameters.campaignId,
                    parameters.providerId
                );
            });
        } else {
            lazyLaunchStoreUrl.import().then(launchDetailsPage => {
                launchDetailsPage(false /*openHomePage = false*/, parameters.assetId);
            });
        }
    } else {
        lazyLaunchStoreUrl.import().then(launchHomePage => {
            launchHomePage(true /*openHomePage = true*/);
        });
    }
}
