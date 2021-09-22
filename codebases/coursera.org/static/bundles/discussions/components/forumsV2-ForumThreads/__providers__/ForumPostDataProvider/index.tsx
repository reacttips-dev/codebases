import RestForumPostById from './queries/RestForumPostById';
import RestForumAnswersByQuestionId from './queries/RestForumAnswersById';

export default RestForumPostById;

export const Providers = {
  Questions: RestForumPostById,
  Answers: RestForumAnswersByQuestionId,
  AnswerById: RestForumAnswersByQuestionId,
};
