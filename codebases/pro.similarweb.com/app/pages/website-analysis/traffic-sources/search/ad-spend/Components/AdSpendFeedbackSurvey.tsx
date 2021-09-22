import { FeedbackBar } from "@similarweb/ui-components/dist/feedback-bar";
import { default as React, useState } from "react";
import styled from "styled-components";
import { i18nFilter } from "filters/ngFilters";
import { showSuccessToast } from "actions/toast_actions";
import { connect } from "react-redux";
import { Injector } from "common/ioc/Injector";
import { FeedbackSurveyModal, IQuestion } from "components/Modals/src/FeedbackSurveyModal";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { allTrackers } from "services/track/track";
import AllContexts from "pages/workspace/common components/AllContexts";
import { AdSpendSurveyQuestions } from "./AdSpendSurveyQuestions";
import { I18nService } from "app/@types/I18nInterfaces";
import { SwNavigator } from "common/services/swNavigator";
import { PreferencesService } from "services/preferences/preferencesService";

const FeedbackWrapper = styled.div`
    padding-bottom: 16px;
`;

const AD_SPEND_FEEDBACK = "Ad Spend Feedback";

export const AdSpendFeedbackSurvey = ({ showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [votingQuestion, setVotingQuestion] = useState();

    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const i18n = Injector.get<I18nService>("i18nFilter");
    const translate = i18nFilter();

    const onSubmitFeedbackModal = async (question: IQuestion, answer) => {
        await PreferencesService.add({
            [AD_SPEND_FEEDBACK]: {
                votingQuestion: "voting question",
                votingAnswer: votingQuestion,
                textQuestion: "text question",
                textAnswer: answer,
            },
        });
        setIsModalOpen(false);
        showToast(i18nFilter()("analysis.search.adspend.feedback.modal.toast"));
    };

    const onNextFeedbackModal = async (question: IQuestion, answer) => {
        setVotingQuestion(answer);
    };

    const onClick = () => {
        setIsModalOpen(true);
        TrackWithGuidService.trackWithGuid(
            "website_analysis.marketing_channels.adspend.feedback",
            "click",
        );
    };

    return (
        <FeedbackWrapper>
            <FeedbackBar
                onClick={onClick}
                buttonText={translate("analysis.search.adspend.feedback.button")}
            >
                {translate("analysis.search.adspend.feedback.title")}
            </FeedbackBar>
            <AllContexts
                translate={i18n}
                track={allTrackers.trackEvent.bind(allTrackers)}
                linkFn={swNavigator.href.bind(swNavigator)}
                trackWithGuid={TrackWithGuidService.trackWithGuid}
            >
                <FeedbackSurveyModal
                    isOpen={isModalOpen}
                    onCloseClick={() => setIsModalOpen(false)}
                    onSubmitClick={onSubmitFeedbackModal}
                    onNextClick={onNextFeedbackModal}
                    surveyQuestions={AdSpendSurveyQuestions}
                />
            </AllContexts>
        </FeedbackWrapper>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        showToast: (text?: string) => dispatch(showSuccessToast(text)),
    };
}

export default connect(null, mapDispatchToProps)(AdSpendFeedbackSurvey);
