import {
    getOptionsForFeature,
    lazyCreateOrUpdateOptionsForFeature,
    OwsOptionsFeatureType,
    CommandingOptions,
} from 'owa-outlook-service-options';
import { getCommandingOptionsFromServer } from '../selectors/getCommandingOptionsFromServer';

export async function saveCommandingOptions(options: Partial<CommandingOptions>) {
    const serverOptions =
        (await getCommandingOptionsFromServer()) ||
        getOptionsForFeature<CommandingOptions>(OwsOptionsFeatureType.Commanding);
    const mergedOptions: CommandingOptions = {
        ...serverOptions,
        ...options,
    };
    lazyCreateOrUpdateOptionsForFeature.importAndExecute(
        OwsOptionsFeatureType.Commanding,
        mergedOptions
    );
}
