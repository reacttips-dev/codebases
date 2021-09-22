import * as React from "react";

import QuestionsList from "./QuestionsList";
import useTrackTabVisit from "hooks/useTrackVisit";

interface CommonQuestionsTabProps {
    sku: string;
}

const BazaarvoiceQuestionsTab: React.FC<CommonQuestionsTabProps> = ({sku}) => {
    const {ref} = useTrackTabVisit({
        payload: {
            sku,
            customLink: "Common Questions Impression",
        },
        event: "PDP_TAB_IMPRESSION",
    });

    return (
        <div ref={ref}>
            <div id="questions_tab">
                <QuestionsList productId={sku} />
            </div>
        </div>
    );
};

export default BazaarvoiceQuestionsTab;
