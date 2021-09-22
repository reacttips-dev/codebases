// Due to some strange typing naming in lib.dom.d.ts, this is added as a workaround
export interface DataTransferWorkaround extends DataTransfer {
    setDragImage: (element: HTMLElement, x: number, y: number) => void;
}

// Mininum mouse movement for the potential drag
export const MIN_MOUSE_MOVE_FOR_DRAG = 5;

// Whether SetDragImage is supported by this browser
// see http://caniuse.com/#feat=dragndrop
// Check window undefined for when this is server-side rendering
export const IsSetDragImageSupported =
    typeof window !== typeof undefined &&
    window.hasOwnProperty('DataTransfer') &&
    (DataTransfer.prototype as DataTransferWorkaround).setDragImage;
