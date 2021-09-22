import { getFileSuggestionImmersiveViewSupported } from 'owa-search-actions';
import { FileSuggestionImmersiveViewSupported } from 'owa-search-service/lib/data/schema/SuggestionSet';
import { lazyIsFileImmersiveViewSupported } from 'owa-attachment-file-suggestion';
import { updateFileSuggestionImmersiveViewSupported } from '../actions/internalActions';
import { orchestrator } from 'satcheljs';

export default orchestrator(getFileSuggestionImmersiveViewSupported, async actionMessage => {
    const { suggestion } = actionMessage;

    if (!suggestion.ImmersiveViewSupported) {
        updateFileSuggestionImmersiveViewSupported(
            suggestion,
            FileSuggestionImmersiveViewSupported.Checking
        );

        const isFileImmersiveViewSupported = await lazyIsFileImmersiveViewSupported.import();
        const supported = await isFileImmersiveViewSupported(suggestion);

        updateFileSuggestionImmersiveViewSupported(
            suggestion,
            supported
                ? FileSuggestionImmersiveViewSupported.Supported
                : FileSuggestionImmersiveViewSupported.NotSupported
        );
    }
});
