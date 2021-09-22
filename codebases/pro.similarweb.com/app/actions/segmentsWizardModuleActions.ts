import {
    IWordPredictions,
    IRule,
    IFolderPredictions,
} from "components/RulesQueryBuilder/src/RulesQueryBuilderTypes";
import {
    RECEIVE_WORD_PREDICTIONS_DATA,
    REQUEST_WORD_PREDICTIONS_DATA,
    SET_SEGMENT_RULES_DATA,
    REQUEST_SEGMENTS_PREVIEW_DATA,
    SET_SHOW_WIZARD_TIPS,
    REQUEST_FOLDER_PREDICTIONS_DATA,
    RECEIVE_FOLDER_PREDICTIONS_DATA,
    RESET_SEGMENTS_WIZARD_DATA,
    SET_SEGMENTS_READY,
} from "action_types/segments_wizard_module_action_types";

export const requestWordPredictions = (wordPredictionsLoading: boolean) => {
    return {
        type: REQUEST_WORD_PREDICTIONS_DATA,
        wordPredictionsLoading: wordPredictionsLoading,
    };
};

export const receiveWordPredictions = (wordPredictions: IWordPredictions) => {
    return {
        type: RECEIVE_WORD_PREDICTIONS_DATA,
        wordPredictions: wordPredictions,
    };
};

export const requestFolderPredictions = (folderPredictionsLoading: boolean) => {
    return {
        type: REQUEST_FOLDER_PREDICTIONS_DATA,
        folderPredictionsLoading: folderPredictionsLoading,
    };
};

export const receiveFolderPredictions = (folderPredictions: IFolderPredictions) => {
    return {
        type: RECEIVE_FOLDER_PREDICTIONS_DATA,
        folderPredictions: folderPredictions,
    };
};

export const requestSegmentsPreview = (segmentsPreviewLoading: boolean) => {
    return {
        type: REQUEST_SEGMENTS_PREVIEW_DATA,
        segmentsPreviewLoading: segmentsPreviewLoading,
    };
};

export const setSegmentRules = (segmentRules: IRule[]) => {
    return {
        type: SET_SEGMENT_RULES_DATA,
        segmentRules: segmentRules,
    };
};

export const setShowWizardTips = (showWizardTips: boolean) => {
    return {
        type: SET_SHOW_WIZARD_TIPS,
        showWizardTips: showWizardTips,
    };
};

export const resetSegmentsWizardData = () => {
    return {
        type: RESET_SEGMENTS_WIZARD_DATA,
    };
};

export const setSegmentsReady = (segmentsReady: boolean) => {
    return {
        type: SET_SEGMENTS_READY,
        segmentsReady,
    };
};
