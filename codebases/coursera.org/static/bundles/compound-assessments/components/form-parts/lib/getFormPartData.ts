import {
  AnyData,
  FormElement,
  GitRepositoryPromptElement,
  Prompt,
  Response,
  Responses,
  ResponseId,
  ResponseMetadata,
  ResponseScore,
  ReviewPartSchema,
  ReviewResponse,
  SubmissionPartSchema,
  SubmissionPrompt,
  SubmissionPartResponseTypeName,
  ReviewPartTypeNames,
} from 'bundles/compound-assessments/components/api/types/CompoundAssessmentsForm';
import {
  CMLContent,
  HTMLContent,
  CMLOrHTMLContent,
  QuizQuestionType,
} from 'bundles/compound-assessments/types/FormParts';
import { typeNames } from 'bundles/compound-assessments/constants';
import { SubmissionPartSchemaDetailsTypeName } from 'bundles/assess-common/types/NaptimeSubmissionSchema';
import { stringKeyToTuple } from 'js/lib/stringKeyTuple';

// Intentionally not typing `prompt` with CompoundAssessmentsForm.Content
const fixPrompt = (prompt: $TSFixMe): CMLOrHTMLContent => {
  if (prompt.typeName === 'cmlContent') {
    return {
      ...prompt,
      typeName: 'cml',
    } as CMLContent;
  } else {
    return {
      ...prompt,
      typeName: prompt.typeName.replace('Content', ''),
    } as HTMLContent;
  }
};

const RESPONSE_TYPE_NAMES_TO_SCHEMA_TYPE_NAME_MAP: {
  [typeName in SubmissionPartResponseTypeName]: SubmissionPartSchemaDetailsTypeName;
} = {
  richTextResponse: 'richText',
  urlResponse: 'url',
  offPlatformResponse: 'offPlatform',
  fileUploadResponse: 'fileUpload',
  plainTextResponse: 'plainText',
  gitResponse: 'git',
};
const fixQuestionTypeForSubmissionPart = (
  typeName: SubmissionPartResponseTypeName
): SubmissionPartSchemaDetailsTypeName => {
  return RESPONSE_TYPE_NAMES_TO_SCHEMA_TYPE_NAME_MAP[typeName];
};
// This is effectively doing nothing (for now), but at least forces us to check types (if the function name wasn't obvious enough).
const fixQuestionTypeForReviewPart = (typeName: ReviewPartTypeNames): ReviewPartTypeNames => {
  return typeName;
};

export type FormPartData = {
  id?: ResponseId;
  prompt?: SubmissionPartSchema | ReviewPartSchema | AnyData;
  response?: Response | null;
  responses?: Responses;
  metadata?: ResponseMetadata;
  score?: number;
  maxScore?: number;
  promptText?: CMLOrHTMLContent;
  questionType?: SubmissionPartSchemaDetailsTypeName | ReviewPartTypeNames | QuizQuestionType;
  isReadOnly?: boolean;
  isExtraCreditQuestion?: boolean;
};

export const getFormPartData = (element: FormElement): FormPartData => {
  const { definition } = element;

  let id: ResponseId = '';
  let responses: Responses | undefined;
  let response: Response | undefined;
  let metadata: ResponseMetadata | undefined;
  let elementPrompt: Prompt | undefined;
  let responseScore: ResponseScore | undefined;

  if ('responseId' in definition) {
    id = definition.responseId;
  }

  if ('responses' in definition) {
    responses = definition.responses;
  }

  if ('response' in definition) {
    response = definition.response;
  }

  if ('responseMetadata' in definition) {
    metadata = definition.responseMetadata;
  }

  if ('prompt' in definition) {
    elementPrompt = definition.prompt;
  }

  if ('score' in definition) {
    responseScore = definition.score;
  }

  // Git has no `response || responses`, so make up our own
  if (element.typeName === typeNames.GIT_REPOSITORY_PROMPT_ELEMENT) {
    const gitDefinition = element.definition as GitRepositoryPromptElement;
    const prompt: SubmissionPrompt = gitDefinition.prompt.definition;
    const gitResponse: Response = {
      typeName: 'submissionResponse',
      definition: {
        submissionPartResponse: {
          typeName: 'gitResponse',
          definition: {
            ...(gitDefinition.gitRepositoryId && {
              repositoryId: gitDefinition.gitRepositoryId,
            }),
            // gitDefinition.gitCommit is gitRepositoryId~gitCommit
            ...(gitDefinition.gitCommit && {
              commitHash: stringKeyToTuple(gitDefinition.gitCommit)[1],
            }),
            // If gitCommitHash is present, use this instead.
            ...(gitDefinition.gitCommitHash && {
              commitHash: gitDefinition.gitCommitHash,
            }),
          },
        },
      },
    };

    return {
      id: gitDefinition.gitRepositoryId,
      prompt,
      response: gitResponse,
      responses,
      metadata,
      score: responseScore?.points,
      maxScore: responseScore?.maxPoints,
      promptText: fixPrompt(prompt.submissionPartSchema.promptContent),
      questionType: fixQuestionTypeForSubmissionPart(gitResponse?.definition.submissionPartResponse.typeName),
      isReadOnly: true,
    };
  } else if (id && (response || (responses || [])[0]) && elementPrompt) {
    const isReadOnly: boolean =
      element.typeName === typeNames.PROMPT_WITH_RESPONSE_ELEMENT ||
      element.typeName === typeNames.PROMPT_WITH_MULTIPLE_RESPONSES_ELEMENT;

    if (
      elementPrompt.typeName === typeNames.SUBMISSION_PROMPT &&
      response?.typeName === typeNames.SUBMISSION_RESPONSE
    ) {
      const prompt: SubmissionPartSchema = elementPrompt.definition.submissionPartSchema;
      return {
        id,
        prompt,
        response,
        responses,
        metadata,
        score: responseScore?.points,
        maxScore: responseScore?.maxPoints,
        promptText: fixPrompt(prompt.promptContent),
        questionType: fixQuestionTypeForSubmissionPart(response.definition.submissionPartResponse.typeName),
        isReadOnly,
      };
    } else if (elementPrompt.typeName === typeNames.REVIEW_PROMPT) {
      const prompt: ReviewPartSchema = elementPrompt.definition.reviewPromptSchema;
      const reviewResponse: Response = (response || (responses && responses[0].response)) as Response;
      const reviewResponseDefinition: ReviewResponse = reviewResponse?.definition as ReviewResponse;
      return {
        id,
        prompt,
        response,
        responses,
        metadata,
        score: responseScore?.points,
        maxScore: responseScore?.maxPoints,
        promptText: fixPrompt(prompt.promptContent),
        questionType: fixQuestionTypeForReviewPart(reviewResponseDefinition.reviewPart.typeName),
        isReadOnly,
      };
    } else if (elementPrompt.typeName === typeNames.AUTO_GRADABLE_PROMPT) {
      const prompt: AnyData = elementPrompt.definition.value;
      return {
        id,
        prompt,
        response,
        responses,
        metadata,
        promptText: prompt.variant?.definition?.prompt as CMLOrHTMLContent | undefined,
        questionType: prompt.question?.type as QuizQuestionType | undefined,
        score: prompt.weightedScoring?.score as number | undefined,
        maxScore: prompt.weightedScoring?.maxScore as number | undefined,
        isReadOnly,
        isExtraCreditQuestion: !!prompt.extraCredit,
      };
    }
  }
  return {};
};

export default getFormPartData;
