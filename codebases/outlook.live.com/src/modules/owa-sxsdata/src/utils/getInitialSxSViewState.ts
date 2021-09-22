import EventEmitter from 'owa-event-emitter';
import { PreviewPaneMode } from '../store/schema/PreviewPaneViewState';
import SxSViewState, { RightPaneDisplay } from '../store/schema/SxSViewState';

export default function getInitialSxSViewState(): SxSViewState {
    return {
        previewPane: {
            downloadUrl: null,
            mode: PreviewPaneMode.Blank,
        },
        didAutoHideRightPane: false,
        hideRightPane: false,
        rightPaneSize: 0,
        leftPaneSizePixels: 0,
        rightPaneSizePixels: 0,
        rightPaneDisplay: RightPaneDisplay.Initial,
        eventManager: new EventEmitter(),
    };
}
