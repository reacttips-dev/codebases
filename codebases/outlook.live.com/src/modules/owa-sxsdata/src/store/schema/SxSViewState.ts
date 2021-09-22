import type EventEmitter from 'owa-event-emitter';
import type PreviewPaneViewState from './PreviewPaneViewState';

export enum RightPaneDisplay {
    Initial, // Initializes the preview and right pane widths
    Adaptive, // Only display the right pane if enough space
    Show, // The user has requested showing the right pane
    Hide, // The user has requested hiding the right pane
    AlwaysHide, // Hide the right pane and don't allow the user to show it
}

interface SxSViewState {
    previewPane: PreviewPaneViewState | null;

    minLeftPaneWidth?: number;
    minRightPaneWidth?: number;

    /**
     * the properties below should not be modified directly
     * and should be modified by
     * updatePanesSize/setRightPaneDisplayAndUpdateSize/setRightPaneDisplay/setPanesSize actions in this package
     *
     * By default whether the right pane (reading pane) depends on its available width.
     * However the user can override this so that the reading pane is hidden
     * regardless of the available width, or show if there is not enough
     * available width. The requested state of this is stored here.
     */
    rightPaneDisplay?: RightPaneDisplay;

    didAutoHideRightPane: boolean;
    hideRightPane: boolean;
    rightPaneSize: number; // ratio
    leftPaneSizePixels: number; // actual size in pixel
    rightPaneSizePixels: number; // actual size in pixel
    eventManager: EventEmitter;
}

export default SxSViewState;
