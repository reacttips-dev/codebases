import { IQuestion, QuestionType } from "components/Modals/src/FeedbackSurveyModal";

export const HighlightsFeedbackQuestions: IQuestion[] = [
    {
        id: 1,
        questionType: QuestionType.Rating,
        title: "workspace.arena.strategic-overview.highlights.feedback.modal.title",
        subtitle:
            "workspace.arena.strategic-overview.highlights.feedback.modal.question.1.subtitle",
        maxLabel:
            "workspace.arena.strategic-overview.highlights.feedback.modal.question.1.maxLabel",
        minLabel:
            "workspace.arena.strategic-overview.highlights.feedback.modal.question.1.minLabel",
    },
    {
        id: 2,
        questionType: QuestionType.Open,
        title: "workspace.arena.strategic-overview.highlights.feedback.modal.title",
        subtitle:
            "workspace.arena.strategic-overview.highlights.feedback.modal.question.2.subtitle",
    },
];
