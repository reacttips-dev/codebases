import { get } from "lodash";

import { ISegmentsData } from "services/conversion/ConversionSegmentsService";
import {
    RECEIVE_SEGMENTS_DATA,
    REQUEST_SEGMENTS_DATA,
    TOGGLE_DELETE_SEGMENT_GROUP_MODAL,
    TOGGLE_RENAME_SEGMENT_GROUP_MODAL,
} from "../../action_types/conversion_module_action_types";

declare var window;

export interface IConversionModuleState {
    deleteGroupSegmentModalIsOpen: boolean;
    renameGroupSegmentModalIsOpen: boolean;
    gid: string;
    segments?: ISegmentsData;
    segmentsLoading: false;
}

/**
 * Get default state. id the screen width is less than 1200px, the sidebar is closed by default;
 * @returns {ILayoutState}
 */
function getDefaultState(): IConversionModuleState {
    return {
        deleteGroupSegmentModalIsOpen: false,
        renameGroupSegmentModalIsOpen: false,
        gid: undefined,
        // segments key is presented from bootstrap
        segmentsLoading: false,
    };
}

function conversionModule(state: IConversionModuleState = getDefaultState(), action): object {
    switch (action.type) {
        case TOGGLE_DELETE_SEGMENT_GROUP_MODAL: {
            return {
                ...state,
                deleteGroupSegmentModalIsOpen: action.isOpen,
                gid: action.gid,
            };
        }
        case TOGGLE_RENAME_SEGMENT_GROUP_MODAL: {
            return {
                ...state,
                renameGroupSegmentModalIsOpen: action.isOpen,
                gid: action.gid,
            };
        }
        case RECEIVE_SEGMENTS_DATA:
            return {
                ...state,
                segments: action.segments,
                segmentsLoading: action.segmentsLoading,
            };
        case REQUEST_SEGMENTS_DATA:
            return {
                ...state,
                segmentsLoading: action.segmentsLoading,
            };
        default:
            return state;
    }
}

export default conversionModule;
