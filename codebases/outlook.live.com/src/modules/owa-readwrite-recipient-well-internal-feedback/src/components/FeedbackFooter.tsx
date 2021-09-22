import { peopleFeedbackSubmitSearchFeedback } from './FeedbackFooter.locstring.json';
import loc from 'owa-localize';
import * as React from 'react';

export interface FeedbackFooterProps {
    className: string;
}

const FeedbackFooter = (props: FeedbackFooterProps) => {
    return <div className={props.className}>{loc(peopleFeedbackSubmitSearchFeedback)}</div>;
};

export default FeedbackFooter;
