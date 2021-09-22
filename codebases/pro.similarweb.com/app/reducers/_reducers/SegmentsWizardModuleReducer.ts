import {
    RECEIVE_FOLDER_PREDICTIONS_DATA,
    RECEIVE_WORD_PREDICTIONS_DATA,
    REQUEST_FOLDER_PREDICTIONS_DATA,
    REQUEST_SEGMENTS_PREVIEW_DATA,
    REQUEST_WORD_PREDICTIONS_DATA,
    SET_SEGMENT_RULES_DATA,
    SET_SHOW_WIZARD_TIPS,
    RESET_SEGMENTS_WIZARD_DATA,
    SET_SEGMENTS_READY,
} from "action_types/segments_wizard_module_action_types";
import {
    IFolderPredictions,
    IRule,
    IWordPredictions,
} from "components/RulesQueryBuilder/src/RulesQueryBuilderTypes";

export interface ISegmentsWizardModuleState {
    segmentsReady: boolean;
    wordPredictionsLoading: boolean;
    segmentsPreviewLoading: boolean;
    folderPredictionsLoading: boolean;
    wordPredictions: IWordPredictions;
    folderPredictions: IFolderPredictions;
    segmentRules: IRule[];
    showWizardTips: boolean;
}

function getDefaultState(): ISegmentsWizardModuleState {
    return {
        segmentsReady: false,
        wordPredictionsLoading: false,
        segmentsPreviewLoading: false,
        folderPredictionsLoading: false,
        wordPredictions: undefined,
        folderPredictions: undefined,
        segmentRules: [],
        showWizardTips: true,
    };
}

function segmentsWizardModule(
    state: ISegmentsWizardModuleState = getDefaultState(),
    action,
): object {
    switch (action.type) {
        case REQUEST_WORD_PREDICTIONS_DATA:
            return {
                ...state,
                wordPredictionsLoading: action.wordPredictionsLoading,
            };

        case RECEIVE_WORD_PREDICTIONS_DATA:
            return {
                ...state,
                wordPredictions: action.wordPredictions,
            };

        case REQUEST_FOLDER_PREDICTIONS_DATA:
            return {
                ...state,
                folderPredictionsLoading: action.folderPredictionsLoading,
            };

        case RECEIVE_FOLDER_PREDICTIONS_DATA:
            return {
                ...state,
                folderPredictions: action.folderPredictions,
            };

        case SET_SEGMENT_RULES_DATA:
            return {
                ...state,
                segmentRules: [...action.segmentRules],
            };

        case REQUEST_SEGMENTS_PREVIEW_DATA:
            return {
                ...state,
                segmentsPreviewLoading: action.segmentsPreviewLoading,
            };

        case SET_SHOW_WIZARD_TIPS:
            return {
                ...state,
                showWizardTips: action.showWizardTips,
            };

        case SET_SEGMENTS_READY:
            return {
                ...state,
                segmentsReady: action.segmentsReady,
            };

        case RESET_SEGMENTS_WIZARD_DATA:
            return getDefaultState();

        default:
            return state;
    }
}

export default segmentsWizardModule;
