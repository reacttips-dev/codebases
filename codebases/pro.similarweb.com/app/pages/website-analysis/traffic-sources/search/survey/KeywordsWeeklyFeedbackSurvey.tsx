import { FeedbackBar } from "@similarweb/ui-components/dist/feedback-bar";
import { PureComponent } from "react";
import * as React from "react";
import styled from "styled-components";
import {
    FeedbackSurveyModal,
    IQuestion,
} from "../../../../../../.pro-features/components/Modals/src/FeedbackSurveyModal";
import AllContexts from "../../../../../../.pro-features/pages/workspace/common components/AllContexts";
import { Injector } from "../../../../../../scripts/common/ioc/Injector";
import DurationService from "../../../../../services/DurationService";
import { allTrackers } from "../../../../../services/track/track";
import { TrackWithGuidService } from "../../../../../services/track/TrackWithGuidService";
import { KeywordsWeeklySurveyQuestions } from "./KeywordsWeeklySurveyQuestions";
import { PreferencesService } from "services/preferences/preferencesService";

const KEYWORDS_WEEKLY_SURVEY_NAME = "Weekly Keywords Survey";

const FeedbackWrapper = styled.div`
    padding-bottom: 16px;
`;

export class KeywordsWeeklyFeedbackSurvey extends PureComponent<any, any> {
    private services;

    constructor(props, context) {
        super(props, context);
        this.services = {
            swNavigator: Injector.get<any>("swNavigator"),
            i18n: Injector.get<any>("i18nFilter"),
        };
        this.state = {
            feedbackSurveyModalIsOpen: false,
            votingQuestion: "",
        };
    }

    public render() {
        const params = this.services.swNavigator.getParams();
        const durationRaw = DurationService.getDurationData(params.duration).raw;
        const showFeedbackSurvey = durationRaw.isDaily;

        const { feedbackSurveyModalIsOpen } = this.state;
        if (!showFeedbackSurvey) {
            return null;
        }
        return (
            <FeedbackWrapper>
                <FeedbackBar
                    onClick={() => this.setState({ feedbackSurveyModalIsOpen: true })}
                    buttonText={this.services.i18n("keywordsweekly.survey.bar.button")}
                >
                    {this.services.i18n("keywordsweekly.survey.bar")}
                </FeedbackBar>
                <AllContexts
                    translate={this.services.i18n}
                    track={allTrackers.trackEvent.bind(allTrackers)}
                    linkFn={this.services.swNavigator.href.bind(this.services.swNavigator)}
                    trackWithGuid={TrackWithGuidService.trackWithGuid}
                >
                    <FeedbackSurveyModal
                        isOpen={feedbackSurveyModalIsOpen}
                        onCloseClick={this.closeFeedbackSurveyModal}
                        onSubmitClick={this.onSubmitFeedbackSurveyModal}
                        onNextClick={this.onNextFeedbackSurveyModal}
                        surveyQuestions={KeywordsWeeklySurveyQuestions}
                    />
                </AllContexts>
            </FeedbackWrapper>
        );
    }

    private closeFeedbackSurveyModal = () => {
        this.setState({
            ...this.state,
            feedbackSurveyModalIsOpen: false,
        });
    };

    private onSubmitFeedbackSurveyModal = async (question: IQuestion, answer) => {
        await PreferencesService.add({
            [KEYWORDS_WEEKLY_SURVEY_NAME]: {
                votingQuestion: "voting question",
                votingAnswer: this.state.votingQuestion,
                textQuestion: "text question",
                textAnswer: answer,
            },
        });
        this.setState({
            ...this.state,
            feedbackSurveyModalIsOpen: false,
        });
    };

    private onNextFeedbackSurveyModal = async (question: IQuestion, answer) => {
        this.setState({
            votingQuestion: answer,
        });
    };
}
