import {
    formatKnowledgeUnreadSummary,
    formatStudentHubUnreadSummary,
} from 'helpers/state-helper/_services-state-helper';
import Actions from 'actions';

const initialState = {
    studentHub: {},
    knowledge: {},
};

export default function(state = initialState, action) {
    if (action.error) {
        return state;
    }

    switch (action.type) {
        case Actions.Types.FETCH_KNOWLEDGE_UNREADS_COMPLETED:
            state = {
                ...state,
                knowledge: {
                    unreads_summary: formatKnowledgeUnreadSummary(action.payload),
                },
            };
            break;
        case Actions.Types.FETCH_STUDENT_HUB_UNREADS_COMPLETED:
            state = {
                ...state,
                studentHub: {
                    unreads_summary: formatStudentHubUnreadSummary(action.payload),
                },
            };
            break;
    }
    return state;
}