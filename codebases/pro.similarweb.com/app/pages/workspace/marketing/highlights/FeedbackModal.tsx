import { i18nFilter } from "filters/ngFilters";
import AllContexts from "pages/workspace/common components/AllContexts";
import { allTrackers } from "services/track/track";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { FeedbackSurveyModal, IQuestion } from "components/Modals/src/FeedbackSurveyModal";
import { InsightsFeedbackQuestions } from "pages/website-analysis/traffic-sources/mmx/components/InsightsAssistant/InsightsFeedbackQuestions";
import { FeedbackWrapper } from "pages/workspace/marketing/highlights/StyledComponents";
import React, { FC, useState } from "react";
import { Injector } from "common/ioc/Injector";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { SwNavigator } from "common/services/swNavigator";
import { PreferencesService } from "services/preferences/preferencesService";

const HIGHLIGHTS_FEEDBACK_NAME = "Highlights Feedback";

export const FeedbackModal: FC<any> = ({ showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [votingQuestion, setVotingQuestion] = useState();
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const i18n = i18nFilter();

    const onSubmitFeedbackModal = async (question: IQuestion, answer) => {
        await PreferencesService.add({
            [HIGHLIGHTS_FEEDBACK_NAME]: {
                votingQuestion: "voting question",
                votingAnswer: votingQuestion,
                textQuestion: "text question",
                textAnswer: answer,
            },
        });
        setIsModalOpen(false);
        showToast(i18n("workspace.arena.strategic-overview.highlights.toast"));
        TrackWithGuidService.trackWithGuid(
            "workspace.arena.strategic_overview.highlights.feedback.submit",
            "click",
        );
    };

    const onNextFeedbackModal = async (question: IQuestion, answer) => {
        setVotingQuestion(answer);
    };

    const onFeedbackClick = () => {
        setIsModalOpen(true);

        TrackWithGuidService.trackWithGuid(
            "workspace.arena.strategic_overview.highlights.feedback.open",
            "click",
        );
    };

    return (
        <FeedbackWrapper>
            <IconButton type="flat" iconName="response" onClick={onFeedbackClick}>
                {i18n("arena.strategic-overview.highlights.feedback.title")}
            </IconButton>
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
        </FeedbackWrapper>
    );
};
