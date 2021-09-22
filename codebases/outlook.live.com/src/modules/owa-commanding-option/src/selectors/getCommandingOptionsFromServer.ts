import {
    lazyGetServerOptionsForFeature,
    OwsOptionsFeatureType,
    CommandingOptions,
} from 'owa-outlook-service-options';

export async function getCommandingOptionsFromServer() {
    const getServerOptionsForFeature = await lazyGetServerOptionsForFeature.import();
    const serverOptions =
        getServerOptionsForFeature &&
        (await getServerOptionsForFeature<CommandingOptions>(OwsOptionsFeatureType.Commanding));

    return serverOptions;
}
