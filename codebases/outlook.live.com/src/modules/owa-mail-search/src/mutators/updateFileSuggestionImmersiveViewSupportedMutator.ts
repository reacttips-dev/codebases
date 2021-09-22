import { mutator } from 'satcheljs';
import { updateFileSuggestionImmersiveViewSupported } from '../actions/internalActions';

export default mutator(updateFileSuggestionImmersiveViewSupported, actionMessage => {
    const { suggestion, immersiveViewSupported } = actionMessage;
    suggestion.ImmersiveViewSupported = immersiveViewSupported;
});
