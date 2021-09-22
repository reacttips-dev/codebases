import {
    FileSuggestion,
    FileSuggestionImmersiveViewSupported,
    FileSuggestionType,
} from 'owa-search-service';
import { getFileSuggestionImmersiveViewSupported } from 'owa-search-actions';

export default function getIsFileImmersiveViewSupported(suggestion: FileSuggestion): boolean {
    // Non-classic PDFs should open in a new tab until PDF bugs are fixed in SxS
    if (
        suggestion.FileExtension.toLowerCase() === 'pdf' &&
        suggestion.FileSuggestionType !== FileSuggestionType.ClassicAttachment
    ) {
        return false;
    }

    if (!suggestion.ImmersiveViewSupported) {
        getFileSuggestionImmersiveViewSupported(suggestion);
    }

    // If the check is in progress, default to isSupported true. Non-PDFs are expected to be able to open in SxS
    return (
        suggestion.ImmersiveViewSupported === FileSuggestionImmersiveViewSupported.Supported ||
        suggestion.ImmersiveViewSupported === FileSuggestionImmersiveViewSupported.Checking
    );
}
