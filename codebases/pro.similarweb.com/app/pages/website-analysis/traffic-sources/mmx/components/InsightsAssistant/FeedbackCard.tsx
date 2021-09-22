import * as React from "react";
import {
    BoldText,
    CardContent,
    FeedbackCTA,
    FeedbackCardContainer,
    FeedbackContentWrapper,
    FeedbackIconWrapper,
    FeedbackTitleWrapper,
    StyledIcon,
} from "./StyledComponents";
import I18n from "components/WithTranslation/src/I18n";
import { colorsPalettes } from "@similarweb/styles";
import { FeedbackSurveyModal, IQuestion } from "components/Modals/src/FeedbackSurveyModal";
import { useState } from "react";
import AllContexts from "pages/workspace/common components/AllContexts";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { Injector } from "common/ioc/Injector";
import { InsightsFeedbackQuestions } from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/InsightsFeedbackQuestions";
import { showSuccessToast } from "actions/toast_actions";
import { connect } from "react-redux";
import { i18nFilter } from "filters/ngFilters";
import { PreferencesService } from "services/preferences/preferencesService";

const INSIGHTS_FEEDBACK_NAME = "Insights Feedback";

const FeedbackCard = ({ showToast, isCompare }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [votingQuestion, setVotingQuestion] = useState();

    const swNavigator = Injector.get<any>("swNavigator");
    const i18n = Injector.get<any>("i18nFilter");

    const onSubmitFeedbackModal = async (question: IQuestion, answer) => {
        await PreferencesService.add({
            [INSIGHTS_FEEDBACK_NAME]: {
                votingQuestion: "voting question",
                votingAnswer: votingQuestion,
                textQuestion: "text question",
                textAnswer: answer,
            },
        });
        setIsModalOpen(false);
        showToast(i18nFilter()("mmx.insights.toast"));
    };

    const onNextFeedbackModal = async (question: IQuestion, answer) => {
        setVotingQuestion(answer);
    };

    const onCardClick = () => {
        setIsModalOpen(true);

        TrackWithGuidService.trackWithGuid(
            "website_analysis.marketing_channels.channel_analysis.insights.feedback",
            "click",
        );
    };

    return (
        <>
            <FeedbackCardContainer onClick={onCardClick} isCompare={isCompare}>
                <CardContent>
                    <FeedbackTitleWrapper>
                        <FeedbackIconWrapper>
                            <StyledIcon
                                size="sm"
                                iconName={"response"}
                                fill={colorsPalettes.blue["400"]}
                            />
                        </FeedbackIconWrapper>
                        <BoldText>
                            <I18n>mmx.insights.feedback.title</I18n>
                        </BoldText>
                    </FeedbackTitleWrapper>
                    <FeedbackContentWrapper>
                        <I18n>mmx.insights.feedback.subtitle</I18n>
                    </FeedbackContentWrapper>
                </CardContent>
                <FeedbackCTA isCompare={isCompare}>
                    <I18n>mmx.insights.feedback</I18n>
                </FeedbackCTA>
            </FeedbackCardContainer>
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
                    surveyQuestions={InsightsFeedbackQuestions}
                />
            </AllContexts>
        </>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        showToast: (text?: string) => dispatch(showSuccessToast(text)),
    };
}

export default connect(null, mapDispatchToProps)(FeedbackCard);
