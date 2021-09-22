import RestForumPostById from './queries/RestForumPostById';
import RestForumAnswersByQuestionId, { ForumAnswerByIdProvider } from './queries/RestForumAnswersById';

export default RestForumPostById;

export const Providers = {
  Questions: RestForumPostById,
  Answers: RestForumAnswersByQuestionId,
  AnswerById: ForumAnswerByIdProvider,
};
