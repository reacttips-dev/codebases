import _ from 'underscore';
import epicClient from 'bundles/epic/client';
import { naptimeForumTypes } from 'bundles/discussions/constants';

const { mentorForumType, groupForumType, gradedDiscussionPrompt } = naptimeForumTypes;

// TODO: Remove when backend supports all forum types
const blacklistedForumTypes = [mentorForumType, groupForumType, gradedDiscussionPrompt];

export default (courseId, forumType) => {
  if (_(blacklistedForumTypes).contains(forumType)) {
    return false;
  }

  return epicClient.get('DiscussionsHighlightPosts', 'DiscussionsHighlightPostsEnabled', {
    course_id: courseId,
  });
};
