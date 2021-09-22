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
import SegmentsApiService, {
    ICustomSegment,
    ICustomSegmentsGroup,
} from "services/segments/segmentsApiService";

export const requestSegmentsModuleMeta = () => {
    return {
        type: REQUEST_SEGMENTS_MODULE_META_DATA,
        segmentsLoading: true,
    };
};

export const receiveSegmentsModuleMeta = (customSegmentsMeta) => {
    return {
        type: RECEIVE_SEGMENTS_MODULE_META_DATA,
        customSegmentsMeta,
        segmentsLoading: false,
    };
};

export const toggleCreateUpdateSegmentGroupModal = (
    isOpen: boolean,
    segmentGroup?: ICustomSegmentsGroup,
    segmentToCompare?: string,
) => {
    return {
        type: TOGGLE_CREATE_UPDATE_SEGMENT_GROUP_MODAL,
        isOpen,
        segmentGroup,
        segmentToCompare,
    };
};

export const toggleDeleteSegmentGroupModal = (
    isOpen: boolean,
    segmentGroup?: ICustomSegmentsGroup,
) => {
    return {
        type: TOGGLE_DELETE_SEGMENT_GROUP_MODAL,
        isOpen,
        segmentGroup,
    };
};

export const deleteSegmentGroupSuccess = (segmentGroup: ICustomSegmentsGroup) => {
    return {
        type: DELETE_SEGMENT_GROUP_SUCCESS,
        segmentGroup,
    };
};

export const groupCreatedUpdated = (segmentGroup: ICustomSegmentsGroup) => {
    return {
        type: GROUP_CREATED_UPDATED,
        segmentGroup,
    };
};

export const groupDeleted = (segmentGroupId: string) => {
    return {
        type: GROUP_DELETED,
        segmentGroupId,
    };
};

export const customSegmentCreatedUpdated = (customSegment: ICustomSegment) => {
    return {
        type: CUSTOM_SEGMENT_CREATED_UPDATED,
        customSegment,
    };
};

export const setUpdatingChangePrefUseAdvanced = (isUpdating: boolean) => {
    return {
        type: UPDATING_CHANGE_PREF_USE_ADVANCED,
        isUpdating,
    };
};

export const setChangePrefUseAdvanced = (useAdvanced: boolean) => {
    return {
        type: CHANGE_PREF_USE_ADVANCED,
        useAdvanced,
    };
};
