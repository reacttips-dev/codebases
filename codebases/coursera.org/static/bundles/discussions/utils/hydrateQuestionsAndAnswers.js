import _ from 'underscore';
import { naptimeForumTypes, forumAnswerBadgeTagType } from 'bundles/discussions/constants';

export const legacyHydrate = (naptimeResponse) => {
  return _(naptimeResponse.elements).each(function (item) {
    _(naptimeResponse.links.elements).each(function (link, linkId) {
      if (link === 'profiles.v0') {
        const userId = item[linkId];
        item.creator = _(naptimeResponse.linked[link]).where({ id: userId })[0];
      } else if (link === 'flags.v1') {
        item.flagDetails = _(naptimeResponse.linked[link]).filter(
          (flagDetails) => item.id === flagDetails.contentId
        )[0];
      } else {
        item[link] = _(naptimeResponse.linked[link]).where({
          id: item[linkId],
        })[0];
      }
    });
  });
};

const hydrateHelper = (elements, links, forumType) => {
  return elements.map((element) => {
    let creator;
    let lastAnsweredBy;

    links['onDemandSocialProfiles.v1'].forEach((profile) => {
      if (!!element.creatorId && element.creatorId === profile.userId) {
        creator = profile;
      }

      if (!!element.lastAnsweredBy && element.lastAnsweredBy === profile.userId) {
        lastAnsweredBy = profile;
      }
    });

    if (links['forumHelpers.v1'] && links['forumHelpers.v1'].length > 0) {
      links['forumHelpers.v1'].forEach((forumHelper) => {
        if (forumHelper && forumHelper.id === creator.userId) {
          creator.helperStatus = forumHelper.helperStatus;
        }
      });
    }

    return Object.assign({}, element, {
      creator,
      lastAnsweredBy,
      forumType,
    });
  });
};

const getLinkedAnswers = (response, forumType) => {
  if (forumType === naptimeForumTypes.mentorForumType) {
    return response.linked['onDemandMentorForumAnswers.v1'];
  } else if (forumType === naptimeForumTypes.groupForumType) {
    return response.linked['onDemandGroupForumAnswers.v1'];
  } else if (forumType === naptimeForumTypes.gradedDiscussionPrompt) {
    return response.linked['onDemandDiscussionPromptAnswers.v1'];
  }

  return response.linked['onDemandCourseForumAnswers.v1'];
};

/*
 * Adds some extra helper answer fields to an answer.
 *
 * @returns answer, with some additional fields:
 *  - type: 'comment' if it has a parent answer, or 'answer' if it does not
 *  - questionId: uncombined UUID of the question that the answer belongs to.
 *  - forumCommentId: UUID of the comment, if the answer is a comment (without being combined with any forum, course,
 *      etc ID)
 *  - topLevelAnswerId: UUID of the answer if it is a top-level answer, or the UUID of the parentForumAnswerId if the
 *      answer is a comment.
 *
 * Why do we split these IDs? Because the 'id' field of the answer is a combined id of the answer UUID, forum UUID, and
 * context UUID (usually a course or a group). Since we include these UUIDs in the URL, but not the other parts of the
 * combined id, we need to split these to make it easier to directly compare them.
 */
export const addAnswerFields = (forumType, answer, questionId) => {
  let splitId;
  let isComment;
  let splitParentId;

  if (forumType === naptimeForumTypes.gradedDiscussionPrompt) {
    splitId = answer.id.split('~')[3];
    isComment = !!answer.parentCourseItemForumAnswerId;
    splitParentId = isComment ? answer.parentCourseItemForumAnswerId.split('~')[2] : undefined;
  } else {
    splitId = answer.id.split('~')[2];
    isComment = !!answer.parentForumAnswerId;
    splitParentId = isComment ? answer.parentForumAnswerId.split('~')[1] : undefined;
  }

  return Object.assign(answer, {
    type: isComment ? 'comment' : 'answer',
    forumCommentId: isComment ? splitId : undefined,
    topLevelForumAnswerId: isComment ? splitParentId : splitId,
    questionId,
  });
};

export const hydrateAnswers = (response, forumType, questionId) => {
  let answers = hydrateHelper(response.elements, response.linked, forumType);
  const linkedAnswerElements = getLinkedAnswers(response, forumType);

  if (linkedAnswerElements) {
    answers = answers.concat(hydrateHelper(linkedAnswerElements, response.linked, forumType));
  }

  return answers.map((answer) => addAnswerFields(forumType, answer, questionId));
};

export const hydrateQuestion = (response, forumType) => {
  const question = hydrateHelper(response.elements, response.linked, forumType)[0];

  const splitId = question.id.split('~');
  question.questionId = splitId[2];

  let answers;
  let highlightedPost;

  const linkedAnswerElements = getLinkedAnswers(response, forumType);

  const highlightedElement =
    response.elements &&
    response.elements[0] &&
    response.elements[0].forumAnswerBadgeTagMap &&
    response.elements[0].forumAnswerBadgeTagMap[forumAnswerBadgeTagType];

  if (linkedAnswerElements) {
    answers = hydrateHelper(linkedAnswerElements, response.linked, forumType).map((answer) =>
      addAnswerFields(forumType, answer, question.questionId)
    );
  }

  if (highlightedElement) {
    const { forumAnswer, forumAnswerId } = highlightedElement;

    highlightedPost = { ...forumAnswer, id: forumAnswerId };
    highlightedPost = hydrateHelper([highlightedPost], response.linked, forumType).map((answer) =>
      addAnswerFields(forumType, answer, question.questionId)
    )[0];
  }

  return { question, answers, highlightedPost };
};

export const hydrateQuestions = (response, forumType) => {
  let questions = hydrateHelper(response.elements, response.linked, forumType);
  questions = questions.map((question) => {
    const splitId = question.id.split('~');
    return Object.assign(question, {
      questionId: splitId[2],
    });
  });

  return questions;
};
