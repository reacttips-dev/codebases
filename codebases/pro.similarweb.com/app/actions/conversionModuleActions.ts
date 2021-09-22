import swLog from "@similarweb/sw-log";
import { ConversionSegmentsService } from "services/conversion/ConversionSegmentsService";
import {
    RECEIVE_SEGMENTS_DATA,
    REQUEST_SEGMENTS_DATA,
    TOGGLE_DELETE_SEGMENT_GROUP_MODAL,
    TOGGLE_RENAME_SEGMENT_GROUP_MODAL,
} from "../action_types/conversion_module_action_types";

export const toggleDeleteSegmentModal = (isOpen: boolean, gid: string) => {
    return {
        type: TOGGLE_DELETE_SEGMENT_GROUP_MODAL,
        isOpen,
        gid,
    };
};

export const toggleRenameSegmentModal = (isOpen: boolean, gid: string) => {
    return {
        type: TOGGLE_RENAME_SEGMENT_GROUP_MODAL,
        isOpen,
        gid,
    };
};

export const requestSegments = () => {
    return {
        type: REQUEST_SEGMENTS_DATA,
        segmentsLoading: true,
    };
};

export const receiveSegments = (segments) => {
    return {
        type: RECEIVE_SEGMENTS_DATA,
        segments,
        segmentsLoading: false,
    };
};

export const fetchSegmentsdata = () => {
    return (dispatch, getState) => {
        if (getState().conversionModule.segmentsLoading) {
            return;
        }

        dispatch(requestSegments());

        return ConversionSegmentsService.getInstance()
            .getAllSegmentsData()
            .then((segments) => {
                dispatch(receiveSegments(segments));
            })
            .catch((error) => {
                swLog.error("request failed", error);
            });
    };
};
