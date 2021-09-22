import { IQuestion, QuestionType } from "components/Modals/src/FeedbackSurveyModal";

export const MMXMobileWebNotificationBarQuestions: IQuestion[] = [
    {
        id: 1,
        questionType: QuestionType.Rating,
        title: "",
        subtitle: "mmx.mobile.new.algorithm.feedback.modal.question.1.subtitle",
        maxLabel: "mmx.mobile.new.algorithm.feedback.modal.question.1.maxLabel",
        minLabel: "mmx.mobile.new.algorithm.feedback.modal.question.1.minLabel",
    },
    {
        id: 2,
        questionType: QuestionType.Open,
        title: "",
        subtitle: "mmx.mobile.new.algorithm.feedback.modal.question.2.subtitle",
    },
];
