import _t from 'i18n!nls/compound-assessments';

// TODO: Type the keys and values.
export const typeNames = {
  AUTO_GRADABLE_RESPONSE: 'autoGradableResponse',
  SUBMISSION_RESPONSE: 'submissionResponse',
  REVIEW_RESPONSE: 'reviewResponse',
  VIEW_ONLY_STEP: 'viewOnlyStep',
  INTERACTIVE_STEP: 'interactiveStep',
  SUBMISSION_PROMPT: 'submissionPrompt',
  REVIEW_PROMPT: 'reviewPrompt',
  PROMPT_WITH_RESPONSE_ELEMENT: 'promptWithResponseElement',
  PROMPT_WITH_MULTIPLE_RESPONSES_ELEMENT: 'promptWithMultipleResponsesElement',
  PROMPT_REQUIRING_RESPONSE_ELEMENT: 'promptRequiringResponseElement',
  AUTO_GRADED_RESPONSE_ELEMENT: 'autoGradedResponseElement',
  INSTRUCTIONS_WITH_REVIEW_ELEMENT: 'instructionsWithReviewCriteriaElement',
  INSTRUCTIONS_ELEMENT: 'instructionsElement',
  AUTO_GRADABLE_PROMPT: 'autoGradablePrompt',
  OPTIONS: 'options',
  MULTILINEINPUT: 'multiLineInput',
  MULTILINEINPUTREVIEWSCHEMA: 'multiLineInputReviewSchema',
  YESNO: 'yesNo',
  BOXVIEWDOCUMENTANNOTATION: 'boxViewDocumentAnnotation',
  SINGLELINEINPUT: 'singleLineInput',
  OPTIONSREVIEWSCHEMA: 'optionsReviewSchema',
  GIT_REPOSITORY_PROMPT_ELEMENT: 'gitRepositoryPromptElement',
} as const;

export const submissionStatuses = {
  NOT_STARTED: 'NOT_STARTED',
  NOT_YET_SUBMITTED: 'NOT_YET_SUBMITTED',
  AWAITING_PEER_REVIEW: 'AWAITING_PEER_REVIEW',
  READY_FOR_GRADING: 'READY_FOR_GRADING',
  GRADING_STARTED: 'GRADING_STARTED',
  GRADING_FINISHED: 'GRADING_FINISHED',
  GRADE_RELEASED: 'GRADE_RELEASED',
  DELETED: 'DELETED',
};

export const phaseTypes = {
  SUBMITTER_SUBMISSION: 'SUBMITTER_SUBMISSION',
  PEER_REVIEW: 'PEER_REVIEW',
  SUBMITTER_VIEW_EVALUATION: 'SUBMITTER_VIEW_EVALUATION',
  STAFF_EVALUATION: 'STAFF_EVALUATION',
} as const;

export const errorCodes = {
  AUTH: 'auth',
  BAD_REQUEST: 'badRequest',
  OFFLINE: 'offline',
  SERVER_ERROR: 'serverError',
  UNKNOWN_ERROR: 'unknownError',
} as const;

export type ErrorCode = typeof errorCodes[keyof typeof errorCodes];

export const SubmissionPartResponseTypeNames = {
  URL_RESPONSE: 'urlResponse',
  PLAIN_TEXT_RESPONSE: 'plainTextResponse',
  OFF_PLATFORM_RESPONSE: 'offPlatformResponse',
  FILE_UPLOAD_RESPONSE: 'fileUploadResponse',
  RICH_TEXT_RESPONSE: 'richTextResponse',
  GIT_RESPONSE: 'gitResponse',
} as const;

export const QuizPartTypes = {
  MULTIPLE_CORRECT: 'checkbox',
  SINGLE_CORRECT: 'mcq',
  TEXT_MATCH: 'textExactMatch',
  MATH_EXPRESSION: 'mathExpression',
  NUMERIC: 'singleNumeric',
  REGULAR_EXPRESSION: 'regex',
  CODE_EXPRESSION: 'codeExpression',
  REFLECTIVE_MULTIPLE_CORRECT: 'checkboxReflect',
  REFLECTIVE_SINGLE_CORRECT: 'mcqReflect',
  REFLECTIVE_TEXT: 'reflect',
  PLUGIN: 'widget',
} as const;
export type QuizPartType = typeof QuizPartTypes[keyof typeof QuizPartTypes];

export const INVALID_URL_ERROR = _t('Warning: The URL you provided is invalid');
