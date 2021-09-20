import Actions from 'actions';

const initialState = {
    inLessonPreviewMode: false,
    isLoadingLessonPreview: false,
    previewLessonUrl: '',
    lastViewedConcepts: {},
};

export default function(state = initialState, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.PREVIEW_LESSON:
            return {
                ...state,
                inLessonPreviewMode: true,
                isLoadingLessonPreview: true,
                previewLessonUrl: action.payload,
            };
        case Actions.Types.PREVIEW_LESSON_COMPLETE:
            return { ...state,
                isLoadingLessonPreview: false
            };
        case Actions.Types.UPDATE_PREVIEW_LESSON_LAST_VIEWED_CONCEPT:
            const lastViewedConcepts = Object.assign({},
                state.lastViewedConcepts,
                action.payload
            );
            return { ...state,
                lastViewedConcepts
            };
        default:
            return state;
    }
}