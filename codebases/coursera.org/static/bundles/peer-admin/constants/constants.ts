import _t from 'i18n!nls/peer-admin';

const GradeValues = {
  GRADED: 'graded',
  NOT_GRADED: 'notGraded',
  ALL: 'all',
};

const GradeOptions = [
  {
    value: GradeValues.GRADED,
    get display() {
      return _t('Graded');
    },
  },
  {
    value: GradeValues.NOT_GRADED,
    get display() {
      return _t('Ungraded');
    },
  },
  {
    value: GradeValues.ALL,
    get display() {
      return _t('Both graded/ungraded');
    },
  },
];

const DeleteValues = {
  DELETED: 'deleted',
  NOT_DELETED: 'notDeleted',
  ALL: 'all',
};

const DeleteOptions = [
  {
    value: DeleteValues.DELETED,
    get display() {
      return _t('Deleted');
    },
  },
  {
    value: DeleteValues.NOT_DELETED,
    get display() {
      return _t('Not-Deleted');
    },
  },
  {
    value: DeleteValues.ALL,
    get display() {
      return _t('Both deleted/not-deleted');
    },
  },
];

const SortValues = {
  CREATION_NEWEST: 'CREATION_NEWEST',
  CREATION_OLDEST: 'CREATION_OLDEST',
  REVIEWS_MOST: 'REVIEWS_MOST',
  REVIEWS_LEAST: 'REVIEWS_LEAST',
  SKIPS: 'SKIPS',
};

const SortOptions = [
  {
    value: SortValues.CREATION_NEWEST,
    get display() {
      return _t('Creation Date: Newest to Oldest');
    },
  },
  {
    value: SortValues.CREATION_OLDEST,
    get display() {
      return _t('Creation Date: Oldest to Newest');
    },
  },
  {
    value: SortValues.REVIEWS_MOST,
    get display() {
      return _t('Reviews Received: High to Low');
    },
  },
  {
    value: SortValues.REVIEWS_LEAST,
    get display() {
      return _t('Reviews Received: Low to High');
    },
  },
  {
    value: SortValues.SKIPS,
    get display() {
      return _t('Number of Flags');
    },
  },
];

const PeerAdminCapabilities = {
  doAdministrativeAction: 'DO_ADMINISTRATIVE_ACTION',
  viewSubmissionList: 'VIEW_SUBMISSION_LIST',
  reviewMentorGraded: 'REVIEW_MENTOR_GRADED',
  previewRubric: 'PREVIEW_RUBRIC',
};

const exported = {
  GradeValues,
  GradeOptions,
  DeleteValues,
  DeleteOptions,
  SortValues,
  SortOptions,
  SubmissionTableRoute: 'submissionTable',
  PeerAdminCapabilities,
};

export default exported;
export { GradeValues, GradeOptions, DeleteValues, DeleteOptions, SortValues, SortOptions, PeerAdminCapabilities };

export const { SubmissionTableRoute } = exported;
