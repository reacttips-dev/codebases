import {
    NotificationBar,
    NotificationBarContainer,
} from "@similarweb/ui-components/dist/notification-bar";
import I18n from "components/React/Filters/I18n";
import { default as React, useState } from "react";
import styled from "styled-components";
import { BetaLabel } from "components/BetaLabel/BetaLabel";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";
import { i18nFilter } from "filters/ngFilters";
import { Button } from "@similarweb/ui-components/dist/button";
import { showSuccessToast } from "actions/toast_actions";
import { connect } from "react-redux";
import { Injector } from "common/ioc/Injector";
import { FeedbackSurveyModal, IQuestion } from "components/Modals/src/FeedbackSurveyModal";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { allTrackers } from "services/track/track";
import AllContexts from "pages/workspace/common components/AllContexts";
import { MMXMobileWebNotificationBarQuestions } from "pages/website-analysis/traffic-sources/mmx/components/MMXMobileWebNotificationBarQuestions";
import { PreferencesService } from "services/preferences/preferencesService";

const MobileWebNotificationBar = styled.div`
    ${NotificationBarContainer} {
        font-size: 14px;
        margin-bottom: 20px;
        padding: 10px;
        border-radius: 4px;
        > div {
            justify-content: flex-start;

            > div {
                width: 100%;
            }
        }
    }
`;

const TextWrapper = styled.span`
    width: 70%;
    margin-left: 10px;
`;

const MMX_NEW_ALGO_FEEDBACK_NAME = "MMX New Algo Feedback";

export const MMXMobileWebNotificationBar = ({ showToast }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [votingQuestion, setVotingQuestion] = useState();

    const swNavigator = Injector.get<any>("swNavigator");
    const i18n = Injector.get<any>("i18nFilter");

    const onSubmitFeedbackModal = async (question: IQuestion, answer) => {
        await PreferencesService.add({
            [MMX_NEW_ALGO_FEEDBACK_NAME]: {
                votingQuestion: "voting question",
                votingAnswer: votingQuestion,
                textQuestion: "text question",
                textAnswer: answer,
            },
        });
        setIsModalOpen(false);
        showToast(i18nFilter()("mmx.mobile.new.algorithm.feedback.modal.toast"));
    };

    const onNextFeedbackModal = async (question: IQuestion, answer) => {
        setVotingQuestion(answer);
    };

    const onClick = () => {
        setIsModalOpen(true);

        TrackWithGuidService.trackWithGuid(
            "website_analysis.marketing_channels.channel_analysis.mobileweb_new_algo.feedback",
            "click",
        );
    };

    return (
        <>
            <MobileWebNotificationBar>
                <NotificationBar>
                    <FlexRow justifyContent="space-between" alignItems="center">
                        <FlexRow justifyContent="flex-start">
                            <BetaLabel />
                            <TextWrapper>
                                <I18n>mmx.mobile.new.algorithm.title</I18n>
                            </TextWrapper>
                        </FlexRow>
                        <Button type="inverted" onClick={onClick} width="194px">
                            {i18nFilter()("mmx.mobile.new.algorithm.feedback.button")}
                        </Button>
                    </FlexRow>
                </NotificationBar>
            </MobileWebNotificationBar>
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
                    surveyQuestions={MMXMobileWebNotificationBarQuestions}
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

export default connect(null, mapDispatchToProps)(MMXMobileWebNotificationBar);
