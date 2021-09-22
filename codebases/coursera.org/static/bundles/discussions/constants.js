import keysToConstants from 'js/lib/keysToConstants';

export const forumLimit = 500;

export const questions = {
  limitsPerPage: {
    peerReview: 15,
    lecture: 5,
    aggregate: 15,
  },
  thought: {
    minChars: 1,
    maxChars: 120,
  },
  details: {
    warnChars: 9850,
    maxChars: 10000,
  },
};

export const answers = {
  limitPerPage: 15,
  thought: {
    warnChars: 9850,
    maxChars: 10000,
  },
};

export const comments = {
  limitPerPage: 15,
};

export const DTD_NAME = 'discussion/1';

export const FluxibleActions = keysToConstants([
  'UPDATE_LOADING_STATE',
  'SEARCH_RESULTS_RECEIVED',
  'SEARCH_PAGE_CHANGE',
  'SEARCH_API_ERROR',
  'CLEAR_DISCUSSIONS_SEARCH_STORE',
]);

export const loadingStates = {
  LOADING: 'LOADING',
  DONE: 'DONE',
  ERROR: 'ERROR',
};

export const savingStates = {
  UNCHANGED: 'UNCHANGED',
  UNSAVED_CHANGES: 'UNSAVED_CHANGES',
  SAVING: 'SAVING',
  SAVED: 'SAVED',
  ERROR: 'ERROR',
};

export const APIConstants = {
  limit: 15,
  searchResource: '/api/onDemandDiscussionSearch.v1',
};

export const answerSorts = {
  oldestSort: 'createdAtAsc',
  popularSort: 'upvotesDesc',
  newestSort: 'createdAtDesc',
};

export const questionSorts = {
  mostRecentSort: 'lastActivityAtDesc',
  popularSort: 'popularityDesc',
  unansweredSort: 'answerCountAsc',
};

export const defaults = {
  detailSort: answerSorts.newestSort,
  detailPage: 1,
  listSort: questionSorts.mostRecentSort,
  listAnswered: undefined,
  listPage: 1,
};

// these are provisional, and may change.
export const naptimeForumTypes = keysToConstants([
  'weekForumType',
  'itemForumType',
  'rootForumType',
  'customForumType',
  'groupForumType',
  'mentorForumType',
  'gradedDiscussionPrompt',
]);

export const forumVisibilityTypes = keysToConstants(['ALWAYS_VISIBLE', 'ALWAYS_HIDDEN']);
export const gradedDiscussionPromptTypes = keysToConstants(['allPosts', 'mySubmissionsOnly']);
export const forumAnswerBadgeTagType = 'HIGHLIGHTED';
