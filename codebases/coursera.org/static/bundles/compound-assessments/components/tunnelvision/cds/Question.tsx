import React from 'react';

import initBem from 'js/lib/bem';
import { FormattedMessage, FormattedNumber } from 'js/lib/coursera.react-intl';
import { Typography } from '@coursera/cds-core';
import _t from 'i18n!nls/compound-assessments';
import ReviewRubricHeader from 'bundles/compound-assessments/components/form-parts/cds/ReviewRubricHeader';

import CMLOrHTML from 'bundles/cml/components/CMLOrHTML';

import QuestionPoints from 'bundles/compound-assessments/components/form-parts/cds/QuestionPoints';

import FormPart from 'bundles/compound-assessments/components/form-parts/cds/FormPart';
import getFormPartData from 'bundles/compound-assessments/components/form-parts/lib/getFormPartData';
import getQuestionGradeFeedbackInfo, {
  GradeFeedbackStrings,
} from 'bundles/compound-assessments/lib/utils/getQuestionGradeFeedbackInfo';
import type { AssignmentRole } from 'bundles/compound-assessments/types/Roles';

import SuggestedMaterialCard from 'bundles/post-assessment-help/components/SuggestedMaterialCard';

import { typeNames } from 'bundles/compound-assessments/constants';

import type {
  QuizQuestionPrompt,
  QuizQuestionResponse,
  SubmissionPartPrompt,
  SubmissionPartResponse,
} from 'bundles/compound-assessments/types/FormParts';
// post-quiz-help-experiment
import type { PostQuizSuggestion } from 'bundles/post-assessment-help/types';

import type { FormPart as FormPartType } from 'bundles/compound-assessments/components/api/AssignmentPresentation';

import 'css!./__styles__/Question';

/* We have another rc-Question class, so this one is rc-FormPartsQuestion.
  This selector is used in bundles/authoring/content-authoring/components/CMLEditorV2.jsx
  and shouldn't be removed. */
const bem = initBem('FormPartsQuestion');

type Props = {
  index?: number | null;
  isReadOnly?: boolean | null;
  isReviewPhase?: boolean;
  isDisabled?: boolean | null;
  formPart: FormPartType;
  // post-quiz-help-experiment
  postQuizSuggestions?: PostQuizSuggestion;
  localScopeId?: string | null;
  showValidation?: boolean | null;
  courseId?: string;
  itemId?: string;
  userId?: number;
  hideRubric?: boolean;
  role?: AssignmentRole;
  /** Sets FormPart's isReadOnly prop to true for the answer FormPart and false
   *  for grader rubrics FormPart(s) in grading view.
   *  This is needed because FormPart reads from the ChangedResponse
   *  state for non-readonly children and this prevents updates to the readonly view
   */
  isGraderView?: boolean;
};

/**
 * This component renders any question type.
 */
const Question: React.FC<Props> = ({
  index,
  isReviewPhase,
  formPart,
  // post-quiz-help-experiment
  postQuizSuggestions,
  /**
   * isReadOnly means that field is not editable and it is read-only. It is used to render
   * submitted or graded assignment in view-only mode.
   */
  isReadOnly,
  /** isDisabled indicates that field is editable but temporarily disabled. */
  isDisabled,
  localScopeId,
  showValidation,
  courseId,
  itemId,
  userId,
  role,
  hideRubric = false,
  isGraderView,
}) => {
  const {
    root: { element, children },
  } = formPart;

  const formPartData = getFormPartData(element);
  const { promptText, score, maxScore, isExtraCreditQuestion } = formPartData;
  const questionNumber = typeof index === 'number' && index + 1;

  const questionPrompt =
    'prompt' in formPart.root.element.definition ? formPart.root.element.definition.prompt : undefined;
  const questionPromptValue =
    questionPrompt && 'value' in questionPrompt.definition ? questionPrompt.definition.value : undefined;
  const feedback = getQuestionGradeFeedbackInfo({ prompt: questionPromptValue });
  const showQuestionPrompt = questionPrompt?.typeName !== typeNames.REVIEW_PROMPT;

  const legendId = formPart.id + '-legend';

  /**
   * The layout of this component is based on a 3x3 grid where the first and third columns contain
   * optional data and empty divs are used to fill out the grid.  If number or points data is not
   * provided, those column may optionally not render.
   * -------------------------------
   * | number |   prompt  | points |
   * -------------------------------
   * |        |   input   |        |
   * -------------------------------
   * |        | quiz help |        |
   * -------------------------------
   * The reason for this layout is to create an explicit structure based on boxes to support RTL display
   * instead of using CSS negative margins, absolute positioning, or coordinate transforms that can
   * have difficulty being converted for RTL display.
   */
  return (
    <div role="group" className={bem()} aria-labelledby={legendId}>
      {showQuestionPrompt && (
        <div id={legendId} className={bem('row')} data-test="legend" aria-hidden>
          {questionNumber && (
            <div className={bem('numberCell')}>
              <Typography variant="h3bold" aria-hidden>
                <FormattedNumber value={questionNumber} aria-hidden />.
              </Typography>
              <span className="screenreader-only">
                <FormattedMessage message={_t('Question {questionNumber}')} questionNumber={questionNumber} />
              </span>
            </div>
          )}
          <div className={bem('contentCell')}>
            <Typography variant="body1">
              <CMLOrHTML value={promptText} display="inline-block" />
            </Typography>
          </div>

          {maxScore && (
            <div className={bem('pointsCell')}>
              <QuestionPoints score={score} maxScore={maxScore} isExtraCreditQuestion={isExtraCreditQuestion} />
            </div>
          )}
        </div>
      )}

      <div className={bem('row')}>
        {questionNumber && <div className={bem('numberCell')} />}
        <div className={bem('contentCell')}>
          <FormPart
            formPart={element}
            isReadOnly={isGraderView ? true : !!isReadOnly}
            isDisabled={!!isDisabled}
            localScopeId={localScopeId}
            showValidation={isReviewPhase ? false : !!showValidation}
            courseId={courseId}
            itemId={itemId}
            userId={userId}
            role={role}
            ariaLabelledBy={legendId}
            isGraderView={isGraderView}
          />
          {children && children.length > 0 && !hideRubric && (
            <div data-test="questionRubric">
              <ReviewRubricHeader>
                <Typography variant="h3bold">{_t('Grading Rubric')}</Typography>
              </ReviewRubricHeader>
              {children.map(({ element: childFormPart }) => (
                <FormPart
                  formPart={childFormPart}
                  isReadOnly={isGraderView ? false : !!isReadOnly}
                  isDisabled={!!isDisabled}
                  localScopeId={localScopeId}
                  showValidation={!!showValidation}
                  courseId={courseId}
                  itemId={itemId}
                  userId={userId}
                  role={role}
                />
              ))}
            </div>
          )}
        </div>
        <div className={bem('pointsCell')} /> {/* Extra space for prompt width to adjust */}
      </div>

      {/* post-quiz-help-experiment */}
      {feedback &&
        (feedback.type === GradeFeedbackStrings.FAILURE || feedback.type === GradeFeedbackStrings.PARTIAL) &&
        postQuizSuggestions && (
          <div className={bem('row')}>
            {questionNumber && <div className={bem('numberCell')} />}
            <div className={bem('contentCell')}>
              <SuggestedMaterialCard
                items={postQuizSuggestions.suggestedItems}
                questionInternalId={formPart.id}
                additionalEventData={{
                  courseBranchId: postQuizSuggestions.courseBranchId,
                  versionedQuestionId: postQuizSuggestions.versionedQuestionId,
                  versionedAssessmentId: postQuizSuggestions.versionedAssessmentId,
                  suggestedItemIds: postQuizSuggestions.suggestedItems.map((item) => item.id),
                }}
              />
            </div>
            {maxScore && <div className={bem('pointsCell')} />}
          </div>
        )}
    </div>
  );
};

type QuizQuestionProps = {
  index: number;
  isReadOnly?: boolean;
  isDisabled?: boolean;
  quizQuestion: {
    prompt: QuizQuestionPrompt | SubmissionPartPrompt;
    response: QuizQuestionResponse | SubmissionPartResponse;
  };
  // post-quiz-help-experiment
  postQuizSuggestions?: PostQuizSuggestion;
  showValidation?: boolean;
};

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  index,
  /**
   * isReadOnly means that field is not editable and it is read only. It is used to render
   * submitted or graded assignment in view only mode.
   */
  isReadOnly,
  isDisabled,
  quizQuestion: { prompt, response },
  // post-quiz-help-experiment
  postQuizSuggestions,
  showValidation,
}) => {
  const formPart = {
    id: prompt.id,
    root: {
      element: {
        definition: {
          prompt: {
            typeName: typeNames.AUTO_GRADABLE_PROMPT,
            definition: {
              value: prompt,
            },
          },
          response,
          responseId: prompt.id,
        },
        typeName: typeNames.PROMPT_REQUIRING_RESPONSE_ELEMENT,
      },
      children: [],
    },
  } as FormPartType;
  return (
    <Question
      {...{
        index,
        formPart,
        isReadOnly: !!isReadOnly,
        isDisabled: !!isDisabled,
        showValidation: !!showValidation,
        // post-quiz-help-experiment
        postQuizSuggestions,
      }}
    />
  );
};

export default Question;
