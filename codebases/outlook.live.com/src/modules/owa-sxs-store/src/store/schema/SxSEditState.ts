import type { ClientItemId } from 'owa-client-ids';

export enum EditMode {
    View,
    EnteringEdit,
    Edit,
    Saving, // Exiting edit
}

interface SxSEditState {
    mode: EditMode;
    editAllowed: boolean;
    itemId: ClientItemId;
    isDraft: boolean;
}

export default SxSEditState;
