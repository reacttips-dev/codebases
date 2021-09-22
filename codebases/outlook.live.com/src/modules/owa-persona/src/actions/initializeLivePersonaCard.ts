import { action } from 'satcheljs/lib/legacy';
import initializeLivePersonaCardAsync from '../services/initializeLivePersonaCardAsync';
import initializeLivePersonaEditorAsync from '../services/initializeLivePersonaEditorAsync';
import type ComposeEmailFunction from '../ComposeEmailFunction';
import store from '../store/Store';
import { trace } from 'owa-trace';
import { LazyModule } from 'owa-bundling';
import {
    LivePersonaCardInitializationState,
    LivePersonaEditorInitializationState,
} from '../store/schema/PersonaControlStore';
import { setLivePersonaCardInitializationStatus } from '../mutators/setLivePersonaCardInitializationStatus';
import { setLivePersonaEditorInitializationStatus } from '../mutators/setLivePersonaEditorInitializationStatus';

// Pulling this number out of a hat. Happy to revisit.
const REINITIALIZATION_THRESHOLD: Number = /* 2 minutes */ 2 * 60 * 1000;

const lazyStyles = new LazyModule(
    () =>
        import(/* webpackChunkName: "LivePersonaCard" */ '../components/LivePersonaCardFonts.scss')
);

const handleLivePersonaCardInitialized = action('handleLivePersonaCardInitialized')(function () {
    setLivePersonaCardInitializationStatus(LivePersonaCardInitializationState.Initialized);
});

const handleLivePersonaCardFailedToInitialize = action('handleLivePersonaCardFailedToInitialize')(
    function (reason: any) {
        setLivePersonaCardInitializationStatus(LivePersonaCardInitializationState.Failed);

        // This is an expected case if the network is down, so we should not be reporting it as an error
        trace.info(reason);
    }
);

export default action('initializeLivePersonaCard')(function initializeLivePersonaCard(
    composeEmailOverride?: ComposeEmailFunction
) {
    if (shouldInitializeLivePersonaCard()) {
        setLivePersonaCardInitializationStatus(LivePersonaCardInitializationState.Initializing);

        // TMP: Dynamically load css for card.  LPC will eventually fix this
        // and ship with the required fonts.
        lazyStyles.import();

        initializeLivePersonaCardAsync(composeEmailOverride)
            .then(handleLivePersonaCardInitialized)
            .catch(reason => handleLivePersonaCardFailedToInitialize(reason))
            .then(() => initializeLivePersonaEditorAsync())
            .then((result: Boolean) => {
                if (result) {
                    setLivePersonaEditorInitializationStatus(
                        LivePersonaEditorInitializationState.Initialized
                    );
                } else {
                    setLivePersonaEditorInitializationStatus(
                        LivePersonaEditorInitializationState.Failed
                    );
                }
            });
    }
});

function shouldInitializeLivePersonaCard(): boolean {
    // This is not the best retry strategy because it only works if initializeLivePersonaCard
    // is repeatedly called through the app's lifespan. At the moment, that happens every time
    // a LivePersonaCardHoverTarget is mounted.
    return (
        store.livePersonaCardInitializationStatus.state ===
            LivePersonaCardInitializationState.NotInitialized ||
        (store.livePersonaCardInitializationStatus.state ===
            LivePersonaCardInitializationState.Failed &&
            Date.now() - store.livePersonaCardInitializationStatus.timestamp >
                REINITIALIZATION_THRESHOLD)
    );
}
