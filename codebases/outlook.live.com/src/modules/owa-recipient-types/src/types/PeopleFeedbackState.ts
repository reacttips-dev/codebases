import type { OwaDate } from 'owa-datetime';

export interface PeopleFeedbackState {
    live?: PeopleFeedback;
    cache?: PeopleFeedback;
    directory?: PeopleFeedback;
}

export interface PeopleFeedback {
    CorrelationId: string;
    TimeStamp?: OwaDate;
    QueryString: string;
    SuggestionSource: string;
    RawResponse: string;
    TraceId?: string;
}

export function createPeopleFeedback(): PeopleFeedback {
    return {
        CorrelationId: '',
        QueryString: '',
        SuggestionSource: '',
        RawResponse: '',
    };
}
