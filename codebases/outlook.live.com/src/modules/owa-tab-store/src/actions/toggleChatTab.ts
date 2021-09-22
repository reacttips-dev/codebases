import { FloatingChatTabViewState, TabState } from '../store/schema/TabViewState';
import { action } from 'satcheljs/lib/legacy';

export default action('toggleChatTab')(function (viewState: FloatingChatTabViewState) {
    viewState.isChatActive = !viewState.isChatActive;
    viewState.state = viewState.isChatActive ? TabState.Active : TabState.Minimized;
    viewState.blink = false;
});
