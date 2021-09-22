import { IQuestion, QuestionType } from "components/Modals/src/FeedbackSurveyModal";

export const BetaBranchSurveyQuestions: IQuestion[] = [
    {
        id: 1,
        page: 1,
        questionType: QuestionType.Rating,
        title: "beta.branch.survey.question.1.title",
        subtitle: "beta.branch.survey.question.1.subtitle",
        maxLabel: "beta.branch.survey.question.1.maxLabel",
        midLabel: "beta.branch.survey.question.1.midLabel",
        minLabel: "beta.branch.survey.question.1.minLabel",
    },
    {
        id: 2,
        page: 2,
        questionType: QuestionType.MultipleChoice,
        title: "beta.branch.survey.question.2.title",
        subtitle: "beta.branch.survey.question.2.subtitle",
        possibleAnswers: [
            "beta.branch.survey.question.2.possible.answer.1",
            "beta.branch.survey.question.2.possible.answer.2",
        ],
    },
    {
        id: 3,
        page: 2,
        questionType: QuestionType.Open,
        title: "beta.branch.survey.question.3.title",
        subtitle: "beta.branch.survey.question.3.subtitle",
    },
];
