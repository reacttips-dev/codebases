import type CardLoadPerfCheckpoints from '../../store/schema/CardLoadPerfCheckpoints';
import { OwaDate, owaDate } from 'owa-datetime';
import PerfMarker from '../../store/schema/PerfMarker';
import { trace } from 'owa-trace';

/**
 * This funstion stamp the time on the  perfCheckpoints
 */
export default function markPerfCheckpoint(
    perfCheckpoints: CardLoadPerfCheckpoints,
    perfMarker: PerfMarker,
    checkPointTime?: OwaDate
) {
    const time = checkPointTime || owaDate();
    switch (perfMarker) {
        case PerfMarker.LoadStart:
            perfCheckpoints.loadStart = time;
            break;
        case PerfMarker.AutoInvokeActionStart:
            perfCheckpoints.autoInvokeActionStart = time;
            break;
        case PerfMarker.AutoInvokeActionEnd:
            perfCheckpoints.autoInvokeActionEnd = time;
            break;
        case PerfMarker.CardRenderStart:
            perfCheckpoints.currentCardCheckpoints.cardRenderStart = time;
            break;
        case PerfMarker.CardRenderEnd:
            perfCheckpoints.currentCardCheckpoints.cardRenderEnd = time;
            break;
        case PerfMarker.ThemeResolveStart:
            perfCheckpoints.currentCardCheckpoints.themeResolveStart = time;
            break;
        case PerfMarker.ThemeResolveEnd:
            perfCheckpoints.currentCardCheckpoints.themeResolveEnd = time;
            break;
        case PerfMarker.CardCreateStart:
            perfCheckpoints.currentCardCheckpoints.cardCreateStart = time;
            break;
        case PerfMarker.CardCreateEnd:
            perfCheckpoints.currentCardCheckpoints.cardCreateEnd = time;
            break;
        case PerfMarker.CardLibraryRenderStart:
            perfCheckpoints.currentCardCheckpoints.cardLibraryRenderStart = time;
            break;
        case PerfMarker.CardLibraryRenderEnd:
            perfCheckpoints.currentCardCheckpoints.cardLibraryRenderEnd = time;
            break;
        case PerfMarker.PrepareCardStart:
            perfCheckpoints.currentCardCheckpoints.prepareCardStart = time;
            break;
        case PerfMarker.PrepareCardEnd:
            perfCheckpoints.currentCardCheckpoints.prepareCardEnd = time;
            break;
        default:
            trace.info(
                'Actionable Message Card: markPerfCheckpointMutator called with unespected PerfMarker'
            );
            break;
    }
}
