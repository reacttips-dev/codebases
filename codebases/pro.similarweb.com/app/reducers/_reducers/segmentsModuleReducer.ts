import {
    CHANGE_PREF_USE_ADVANCED,
    CUSTOM_SEGMENT_CREATED_UPDATED,
    DELETE_SEGMENT_GROUP_SUCCESS,
    GROUP_CREATED_UPDATED,
    GROUP_DELETED,
    UPDATING_CHANGE_PREF_USE_ADVANCED,
    RECEIVE_SEGMENTS_MODULE_META_DATA,
    REQUEST_SEGMENTS_MODULE_META_DATA,
    TOGGLE_CREATE_UPDATE_SEGMENT_GROUP_MODAL,
    TOGGLE_DELETE_SEGMENT_GROUP_MODAL,
} from "action_types/segments_module_action_types";
import {
    ICustomSegmentsGroup,
    ICustomSegmentsMetaData,
} from "services/segments/segmentsApiService";

export interface ISegmentsModuleState {
    segmentGroup: ICustomSegmentsGroup;
    createUpdateGroupSegmentModalIsOpen: boolean;
    deleteSegmentGroupIsOpen: boolean;
    customSegmentsMeta?: ICustomSegmentsMetaData;
    segmentsLoading: false;
    compareToSegment: string;
    prefUseAdvanced: { value: boolean; isUpdating: boolean };
}

/**
 * Get default state. id the screen width is less than 1200px, the sidebar is closed by default;
 * @returns {ILayoutState}
 */
function getDefaultState(): ISegmentsModuleState {
    return {
        segmentGroup: undefined,
        segmentsLoading: false,
        createUpdateGroupSegmentModalIsOpen: false,
        deleteSegmentGroupIsOpen: false,
        compareToSegment: undefined,
        prefUseAdvanced: { value: undefined, isUpdating: false },
    };
}

function segmentsModule(state: ISegmentsModuleState = getDefaultState(), action): object {
    switch (action.type) {
        case RECEIVE_SEGMENTS_MODULE_META_DATA:
            return {
                ...state,
                customSegmentsMeta: action.customSegmentsMeta,
                segmentsLoading: action.segmentsLoading,
            };
        case REQUEST_SEGMENTS_MODULE_META_DATA:
            return {
                ...state,
                segmentsLoading: action.segmentsLoading,
            };
        case TOGGLE_CREATE_UPDATE_SEGMENT_GROUP_MODAL:
            return {
                ...state,
                createUpdateGroupSegmentModalIsOpen: action.isOpen,
                segmentGroup: action.segmentGroup,
                compareToSegment: action.segmentToCompare,
            };
        case TOGGLE_DELETE_SEGMENT_GROUP_MODAL:
            return {
                ...state,
                deleteSegmentGroupIsOpen: action.isOpen,
                segmentGroup: action.segmentGroup,
            };
        case DELETE_SEGMENT_GROUP_SUCCESS:
            return {
                ...state,
                deleteSegmentGroupIsOpen: false,
                segmentGroup: undefined,
                customSegmentsMeta: {
                    ...state.customSegmentsMeta,
                    SegmentGroups: [
                        ...state.customSegmentsMeta.SegmentGroups.filter(
                            (group) => group.id !== action.segmentGroup.id,
                        ),
                    ],
                },
            };
        case GROUP_CREATED_UPDATED:
            return {
                ...state,
                createUpdateGroupSegmentModalIsOpen: false,
                customSegmentsMeta: {
                    ...state.customSegmentsMeta,
                    SegmentGroups: [
                        ...state.customSegmentsMeta.SegmentGroups.filter(
                            (group) => group.id !== action.segmentGroup.id,
                        ),
                        action.segmentGroup,
                    ],
                },
            };
        case GROUP_DELETED:
            return {
                ...state,
                customSegmentsMeta: {
                    ...state.customSegmentsMeta,
                    SegmentGroups: [
                        ...state.customSegmentsMeta.SegmentGroups.filter(
                            (group) => group.id !== action.segmentGroupId,
                        ),
                    ],
                },
            };
        case CUSTOM_SEGMENT_CREATED_UPDATED:
            return {
                ...state,
                customSegmentsMeta: {
                    ...state.customSegmentsMeta,
                    Segments: [
                        ...state.customSegmentsMeta.Segments.filter(
                            (seg) => seg.id !== action.customSegment.id,
                        ),
                        action.customSegment,
                    ],
                    AccountSegments: [
                        ...state.customSegmentsMeta.AccountSegments.filter(
                            (seg) => seg.id !== action.customSegment.id,
                        ),
                        action.customSegment,
                    ],
                },
            };
        case UPDATING_CHANGE_PREF_USE_ADVANCED:
            return {
                ...state,
                prefUseAdvanced: {
                    ...state.prefUseAdvanced,
                    isUpdating: action.isUpdating,
                },
            };
        case CHANGE_PREF_USE_ADVANCED:
            return {
                ...state,
                prefUseAdvanced: {
                    ...state.prefUseAdvanced,
                    value: action.useAdvanced,
                },
            };
        default:
            return state;
    }
}

export default segmentsModule;
