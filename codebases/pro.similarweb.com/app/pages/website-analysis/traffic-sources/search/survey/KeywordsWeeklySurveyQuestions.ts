import {
    IQuestion,
    QuestionType,
} from "../../../../../../.pro-features/components/Modals/src/FeedbackSurveyModal";

export const KeywordsWeeklySurveyQuestions: IQuestion[] = [
    {
        id: 1,
        questionType: QuestionType.Rating,
        title: "keywordsweekly.survey.question.1.title",
        subtitle: "keywordsweekly.survey.question.1.subtitle",
        maxLabel: "keywordsweekly.survey.question.1.maxLabel",
        minLabel: "keywordsweekly.survey.question.1.minLabel",
    },
    {
        id: 2,
        questionType: QuestionType.Open,
        title: "keywordsweekly.survey.question.2.title",
        subtitle: "keywordsweekly.survey.question.2.subtitle",
    },
];
