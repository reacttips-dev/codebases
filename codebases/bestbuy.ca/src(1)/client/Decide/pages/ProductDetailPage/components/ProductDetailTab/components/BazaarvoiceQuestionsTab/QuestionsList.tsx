import * as React from "react";
import {useState, useEffect, useRef} from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";

import messages from "./translations/messages";
import * as styles from "./styles.css";

export interface Props {
    productId: string;
}

type QuestionsListProps = Props & InjectedIntlProps;

export const QuestionsList: React.FC<QuestionsListProps> = ({productId = "", intl}) => {
    const bazaarVoiceRef: React.RefObject<HTMLDivElement> = useRef();
    const [isLoadingError, setIsLoadingError] = useState(false);

    useEffect(() => {
        const checkQuestionsLists = () => {
            if (bazaarVoiceRef.current) {
                // we check for BV rendered elements to verify if we have avaialble questions
                // having no elements means client cant get to BV
                const bvContainer: any = bazaarVoiceRef.current.children;
                const bvContainerCount =
                    bvContainer && bvContainer.BVQAContainer && bvContainer.BVQAContainer.childElementCount;

                setIsLoadingError(!bvContainerCount);
            }
        };
        // we give the DOM sometime to render BV content before checking
        const timer = setTimeout(checkQuestionsLists, 9000);

        return () => clearTimeout(timer);
    }, [productId]);

    return !isLoadingError ? (
        <>
            <h2 className={styles.containerText} data-automation="question-list-intro-copy-container" id="intro-copy">
                {intl.formatMessage(messages.pageIntroCopy)}
            </h2>
            <div
                id="questions"
                ref={bazaarVoiceRef}
                data-bv-show="questions"
                data-bv-product-id={productId}
                data-automation="question-list-container"
            />
        </>
    ) : (
        <h2 className={styles.containerText} data-automation="question-list-error-message-container" id="error-message">
            {intl.formatMessage(messages.errorLoadingQuestions)}
        </h2>
    );
};

export default injectIntl(QuestionsList);
