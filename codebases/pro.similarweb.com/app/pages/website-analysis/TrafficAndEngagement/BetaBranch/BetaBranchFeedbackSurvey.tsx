import * as React from "react";
import { useContext } from "react";
import { i18nFilter } from "filters/ngFilters";
import { Injector } from "common/ioc/Injector";
import { FeedbackSurveyModal, IQuestion } from "components/Modals/src/FeedbackSurveyModal";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import { allTrackers } from "services/track/track";
import AllContexts from "pages/workspace/common components/AllContexts";
import { BetaBranchSurveyQuestions } from "pages/website-analysis/TrafficAndEngagement/BetaBranch/BetaBranchSurveyQuestions";
import { BetaBranchContext } from "pages/website-analysis/TrafficAndEngagement/BetaBranch/BetaBranchContainer";
import { PreferencesService } from "services/preferences/preferencesService";

const BETA__BRANCH_SURVEY_NAME = "BETA Branch Survey";

const BetaBranchFeedbackSurvey = (props: any) => {
    const {
        isBetaBranchFeedbackSurveyOpen,
        setIsBetaBranchFeedbackSurveyOpen,
        setIsBetaBranchThankUModalOpen,
    } = useContext(BetaBranchContext);
    const { i18n, swNavigator } = React.useMemo(
        () => ({
            i18n: i18nFilter(),
            swNavigator: Injector.get<any>("swNavigator"),
        }),
        [],
    );
    const closeFeedbackSurveyModal = () => {
        TrackWithGuidService.trackWithGuid(
            "webanalysis.beta.branch.opt.in.feedback.form.close",
            "click",
        );
        setIsBetaBranchFeedbackSurveyOpen(false);
    };
    const onSubmitFeedbackSurveyModal = async (question: IQuestion, answer) => {
        TrackWithGuidService.trackWithGuid(
            "webanalysis.beta.branch.opt.in.feedback.form.submit",
            "click",
        );
        setIsBetaBranchFeedbackSurveyOpen(false);
        onNextFeedbackSurveyModal(question, answer);
        setIsBetaBranchThankUModalOpen(true);
    };

    const onNextFeedbackSurveyModal = async (question: IQuestion, answer) => {
        TrackWithGuidService.trackWithGuid(
            "webanalysis.beta.branch.opt.in.feedback.form.next",
            "click",
            { question: question.id },
        );
        const { key } = swNavigator.getParams();
        await PreferencesService.add({
            [`${BETA__BRANCH_SURVEY_NAME}/${key}/${question.id}`]: {
                question: question.title,
                answer,
            },
        });
    };

    return (
        <div>
            <AllContexts
                translate={i18n}
                track={allTrackers.trackEvent.bind(allTrackers)}
                linkFn={swNavigator.href.bind(swNavigator)}
                trackWithGuid={TrackWithGuidService.trackWithGuid}
            >
                <FeedbackSurveyModal
                    isOpen={isBetaBranchFeedbackSurveyOpen}
                    onCloseClick={closeFeedbackSurveyModal}
                    onSubmitClick={onSubmitFeedbackSurveyModal}
                    onNextClick={onNextFeedbackSurveyModal}
                    surveyQuestions={BetaBranchSurveyQuestions}
                    surveyName={BETA__BRANCH_SURVEY_NAME}
                    customStyles={{
                        customStyles: {
                            content: {
                                height: "280px",
                                padding: "20px 30px",
                                boxSizing: "content-box",
                                width: "518px",
                            },
                        },
                    }}
                />
            </AllContexts>
        </div>
    );
};

export default BetaBranchFeedbackSurvey;
