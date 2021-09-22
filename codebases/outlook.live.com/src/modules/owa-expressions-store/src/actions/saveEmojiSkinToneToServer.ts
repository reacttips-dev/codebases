import expressionStore from '../store/expressionStore';
import { action } from 'satcheljs/lib/legacy';
import {
    getOptionsForFeature,
    lazyCreateOrUpdateOptionsForFeature,
    OwsOptionsFeatureType,
    DiverseEmojisOptions,
} from 'owa-outlook-service-options';
import { logUsage } from 'owa-analytics';
import SaveEmojiSkinToneToServerError from '../store/schema/SaveEmojiSkinToneToServerError';

export default action('saveEmojiSkinToneToServer')(function saveEmojiSkinToneToServer(
    logResults?: boolean
) {
    let diverseEmojisOptions = getOptionsForFeature<DiverseEmojisOptions>(
        OwsOptionsFeatureType.DiverseEmojis
    );

    if (diverseEmojisOptions.diverseEmojisSelectedSkinTone != expressionStore.selectedSkinTone) {
        diverseEmojisOptions.diverseEmojisSelectedSkinTone = expressionStore.selectedSkinTone;
        let promise = lazyCreateOrUpdateOptionsForFeature.importAndExecute(
            OwsOptionsFeatureType.DiverseEmojis,
            diverseEmojisOptions
        );

        if (logResults) {
            const eventName = 'ExpressionPicker_EmojiSkinToneSavedToServer';
            promise
                .then(() => {
                    logUsage(eventName, [true]);
                })
                .catch(error => {
                    logUsage(eventName, [
                        false,
                        expressionStore.selectedSkinTone,
                        getErrorCode(error.toString()),
                    ]);
                });
        }
    }
});

// Returns a number specifying the error retrieved after the server call failed
//     0: OptionsNotLoaded
//     1: ErrorProcessingOptions
//     2: Other
function getErrorCode(error: string) {
    // See createOrUpdateOptionsForFeature.ts for details on error cases
    switch (error) {
        case 'Options are not loaded. Cannot update options.':
            return SaveEmojiSkinToneToServerError.OptionsNotLoaded;
        case 'Error: Error processing options response':
            return SaveEmojiSkinToneToServerError.ErrorProcessingOptions;
        default:
            return SaveEmojiSkinToneToServerError.Other;
    }
}
