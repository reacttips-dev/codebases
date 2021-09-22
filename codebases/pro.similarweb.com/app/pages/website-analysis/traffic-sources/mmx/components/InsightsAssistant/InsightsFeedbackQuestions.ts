import { IQuestion, QuestionType } from "components/Modals/src/FeedbackSurveyModal";

export const InsightsFeedbackQuestions: IQuestion[] = [
    {
        id: 1,
        questionType: QuestionType.Rating,
        title: "mmx.insights.feedback.modal.title",
        subtitle: "mmx.insights.feedback.modal.question.1.subtitle",
        maxLabel: "mmx.insights.feedback.modal.question.1.maxLabel",
        minLabel: "mmx.insights.feedback.modal.question.1.minLabel",
    },
    {
        id: 2,
        questionType: QuestionType.Open,
        title: "mmx.insights.feedback.modal.title",
        subtitle: "mmx.insights.feedback.modal.question.2.subtitle",
    },
];
