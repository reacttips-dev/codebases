import { PropTypes } from 'prop-types';
import cmlPropType from 'bundles/cml/propTypes/cml';

export const profilePropType = PropTypes.shape({
  fullName: PropTypes.string,
  userId: PropTypes.number.isRequired,
  externalUserId: PropTypes.string.isRequired,
});

export const replyPropType = PropTypes.shape({
  createdAt: PropTypes.number,
  creatorId: PropTypes.number,
  isUpvoted: PropTypes.bool,
  id: PropTypes.string,
  content: cmlPropType,
  upvoteCount: PropTypes.number,
  childAnswerCount: PropTypes.number,
  isFlagged: PropTypes.bool,
  creator: profilePropType,
  forumType: PropTypes.string,
  topLevelForumAnswerId: PropTypes.string,
  forumCommentId: PropTypes.string,
  type: PropTypes.string,
  order: PropTypes.number,
  questionId: PropTypes.string,
  highlighted: PropTypes.bool,
});
