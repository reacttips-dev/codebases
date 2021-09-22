import { IQuestion, QuestionType } from "../Modals/src/FeedbackSurveyModal";

export const WorkspaceSurvey: IQuestion[] = [
    {
        id: 1,
        questionType: QuestionType.Rating,
        title: "workspace.survey.question.1.title",
        subtitle: "workspace.survey.question.1.subtitle",
        maxLabel: "workspace.survey.question.1.maxLabel",
        minLabel: "workspace.survey.question.1.minLabel",
    },
    {
        id: 2,
        questionType: QuestionType.Open,
        title: "workspace.survey.question.2.title",
        subtitle: "workspace.survey.question.2.subtitle",
    },
    {
        id: 3,
        questionType: QuestionType.Rating,
        title: "workspace.survey.question.3.title",
        subtitle: "workspace.survey.question.3.subtitle",
        maxLabel: "workspace.survey.question.3.maxLabel",
        minLabel: "workspace.survey.question.3.minLabel",
    },
    {
        id: 4,
        questionType: QuestionType.Open,
        title: "workspace.survey.question.4.title",
        subtitle: "workspace.survey.question.4.subtitle",
    },
    {
        id: 5,
        questionType: QuestionType.Open,
        title: "workspace.survey.question.5.title",
        subtitle: "workspace.survey.question.5.subtitle",
    },
];
