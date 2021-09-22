import { IQuestion, QuestionType } from "components/Modals/src/FeedbackSurveyModal";

export const AdSpendSurveyQuestions: IQuestion[] = [
    {
        id: 1,
        questionType: QuestionType.Rating,
        title: "",
        subtitle: "analysis.search.adspend.feedback.modal.question.1.subtitle",
        maxLabel: "analysis.search.adspend.feedback.modal.question.1.maxLabel",
        minLabel: "analysis.search.adspend.feedback.modal.question.1.minLabel",
    },
    {
        id: 2,
        questionType: QuestionType.Open,
        title: "",
        subtitle: "analysis.search.adspend.feedback.modal.question.2.subtitle",
    },
];
