import {
    lazyGetServerOptionsForFeature,
    WebPushNotificationsOptions,
    OwsOptionsFeatureType,
} from 'owa-outlook-service-options';

export default async function loadWebPushOptions(): Promise<WebPushNotificationsOptions> {
    let getServerOptionsForFeature = await lazyGetServerOptionsForFeature.import();
    let response = await getServerOptionsForFeature<WebPushNotificationsOptions>(
        OwsOptionsFeatureType.WebPushNotifications
    );
    if (response == null) {
        throw new Error('Failed to load web push options.');
    }

    return response;
}
