import type AugLoopViewState from '../store/schema/AugLoopViewState';
import type HandlerViewState from '../store/schema/HandlerViewState';
import { ObservableMap } from 'mobx';
import createComposeFeedbackViewState from 'owa-compose-feedback/lib/utils/createComposeFeedbackViewState';

export default function createAugLoopViewState(): AugLoopViewState {
    return {
        handlerViewStates: new ObservableMap<string, HandlerViewState>(),
        composeFeedbackViewState: createComposeFeedbackViewState(),
    };
}
