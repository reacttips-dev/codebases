import { QuizQuestionPrompt, Option, CMLOrHTMLContent } from 'bundles/compound-assessments/types/FormParts';
import { QuizPartTypes } from 'bundles/compound-assessments/constants';
import cmlObjectContainsValue from 'bundles/compound-assessments/lib/utils/cmlObjectContainsValue';
import _t from 'i18n!nls/compound-assessments';

export type Props = {
  prompt: QuizQuestionPrompt;
  option?: Option;
};

type NotificationInfo = {
  label?: string | null;
  description?: CMLOrHTMLContent | string | null;
};

export type QuestionGradeFeedbackInfo = {
  type: string;
  notificationInfo: Array<NotificationInfo>;
  hideNotificationIcon?: boolean;
};

export const GradeFeedbackStrings = {
  SUCCESS: 'success',
  FAILURE: 'failure',
  PARTIAL: 'partial',
  CHECKBOX_SUCCESS_LABEL: 'checkboxSuccessLabel',
  CHECKBOX_FAILURE_SELECTED_LABEL: 'checkboxFailureSelectedLabel',
  CHECKBOX_FAILURE_NOT_SELECTED_LABEL: 'checkboxFailureNotSelectedLabel',
  CORRECT: 'correct',
  CORRECT_ANSWER: 'correctAnswer',
  PARTIAL_ANSWER: 'partialAnswer',
  NO_ANSWER_SELECTED: 'noAnswerSelected',
  EXPLANATION: 'explanation',
  INCORRECT: 'incorrect',
} as const;

export const getTranslation = (key: typeof GradeFeedbackStrings[keyof typeof GradeFeedbackStrings]) => {
  const translations = {
    [GradeFeedbackStrings.SUCCESS]: _t('success'),
    [GradeFeedbackStrings.FAILURE]: _t('failure'),
    [GradeFeedbackStrings.PARTIAL]: _t('partial'),
    [GradeFeedbackStrings.CHECKBOX_SUCCESS_LABEL]: _t('Correct'),
    [GradeFeedbackStrings.CHECKBOX_FAILURE_SELECTED_LABEL]: _t('This should not be selected'),
    [GradeFeedbackStrings.CHECKBOX_FAILURE_NOT_SELECTED_LABEL]: _t('This should be selected'),
    [GradeFeedbackStrings.CORRECT]: _t('Correct'),
    [GradeFeedbackStrings.CORRECT_ANSWER]: _t('Correct Answer'),
    [GradeFeedbackStrings.PARTIAL_ANSWER]: _t('You didn’t select all the correct answers'),
    [GradeFeedbackStrings.NO_ANSWER_SELECTED]: _t('You didn’t select an answer.'),
    [GradeFeedbackStrings.EXPLANATION]: _t('Explanation'),
    [GradeFeedbackStrings.INCORRECT]: _t('Incorrect'),
  };
  return translations[key];
};

const getStandardInfo = ({ prompt: { feedback } }: Props): QuestionGradeFeedbackInfo => {
  const isAnswerCorrect = !!feedback?.definition?.isCorrect;
  return {
    type: isAnswerCorrect ? GradeFeedbackStrings.SUCCESS : GradeFeedbackStrings.FAILURE,
    notificationInfo: [
      {
        label: isAnswerCorrect
          ? getTranslation(GradeFeedbackStrings.CORRECT)
          : getTranslation(GradeFeedbackStrings.INCORRECT),
        description: feedback && 'display' in feedback.definition ? feedback.definition.display : null,
      },
    ],
  };
};

// TODO (debt) refactor and split this function into smaller functions
const getQuestionGradeFeedbackInfo = (props: Props): QuestionGradeFeedbackInfo | null => {
  const { prompt } = props || {};
  const { effectiveResponse, feedback, question: { type: questionType = undefined } = {}, variant } = prompt || {};
  const questionGradeFeedbackInfo: Partial<QuestionGradeFeedbackInfo> = {};
  let notificationInfoLabel: string | null = null;

  // Partial detail only displays correctness of question without feedback
  if (variant?.detailLevel === 'Partial') {
    const info = getStandardInfo(props);
    info.notificationInfo[0].description = null;
    return info;
  }

  // Explained detail displays correctness and any instructor feedback
  switch (questionType) {
    case QuizPartTypes.REFLECTIVE_MULTIPLE_CORRECT:
    case QuizPartTypes.MULTIPLE_CORRECT: {
      const { option } = props || null;
      // @ts-expect-error TSMIGRATION
      const options = feedback?.definition?.options || [];
      const optionsWithFeedback = options.filter((optionObj: $TSFixMe) => cmlObjectContainsValue(optionObj.feedback));
      // @ts-expect-error TSMIGRATION
      const optionsChosenByUser = effectiveResponse?.response?.chosen || [];

      let isOptionChosenByUserHasFeedback = false;

      optionsWithFeedback.forEach((optionObj: $TSFixMe) => {
        if (optionsChosenByUser.includes(optionObj.id)) {
          isOptionChosenByUserHasFeedback = true;
        }
      });

      // Checkbox Question has an additional <GradeNotification> bar below the question itself.
      // We try to use it for purposes of letting the user know if they have NOT selected all the
      // correct options, or if it is a reflective type, with feedback options that have no individual feedback,
      // We would like to show a correct notification below the question.
      // When a <GradeNotification> component has a checkbox or a checkboxReflect questionType without an 'option'
      // prop, that is to identify (the below line) that this Grade Notification is additional <GradeNotification>
      // notification bar.
      if (!option) {
        const isAnswerCorrect = feedback?.definition?.isCorrect || null;

        // For Checkbox reflect, if there is no feedback for individual options
        // we want to show a correct notification under the question, else we end up showing
        // the feedback for each response and avoid the correct notification.
        if (questionType === QuizPartTypes.REFLECTIVE_MULTIPLE_CORRECT) {
          if (
            optionsChosenByUser.length === 0 ||
            optionsWithFeedback.length === 0 ||
            !isOptionChosenByUserHasFeedback
          ) {
            questionGradeFeedbackInfo.type = GradeFeedbackStrings.SUCCESS;
            questionGradeFeedbackInfo.notificationInfo = [
              {
                label: getTranslation(GradeFeedbackStrings.CORRECT),
                description: null,
              },
            ];

            return questionGradeFeedbackInfo as QuestionGradeFeedbackInfo;
          }
        }

        // Cases for 'checkbox' type questions
        // We don't want to show additional <GradeNotification> bar notification if the user
        // has all options correct, or has even one of the options incorrect.
        const hasIncorrectOptionChosen = options.find((optionObj: $TSFixMe) => {
          const isOptionChosenByUser = optionsChosenByUser.includes(optionObj?.id);
          return isOptionChosenByUser && optionObj?.isCorrect === false;
        });

        if (isAnswerCorrect || hasIncorrectOptionChosen) {
          return null;
        }

        questionGradeFeedbackInfo.type = GradeFeedbackStrings.PARTIAL;
        questionGradeFeedbackInfo.notificationInfo = [
          {
            label: null,
            description: getTranslation(GradeFeedbackStrings.PARTIAL_ANSWER),
          },
        ];

        return questionGradeFeedbackInfo as QuestionGradeFeedbackInfo;
      }

      const isOptionChosenByUser = optionsChosenByUser.includes(option?.id);

      if (
        !isOptionChosenByUser ||
        (!isOptionChosenByUserHasFeedback && questionType === QuizPartTypes.REFLECTIVE_MULTIPLE_CORRECT)
      ) {
        return null;
      }

      const selectedOption = options.find((checkboxOption: $TSFixMe) => checkboxOption?.id === option?.id) || {};
      const selectedOptionFeedback = selectedOption?.feedback || null;

      notificationInfoLabel = null;

      // Checkbox Reflect
      if (
        (typeof selectedOption?.isCorrect === 'undefined' || selectedOption?.isCorrect === null) &&
        questionType === QuizPartTypes.REFLECTIVE_MULTIPLE_CORRECT
      ) {
        if (!selectedOptionFeedback) {
          return null;
        } else {
          notificationInfoLabel = getTranslation(GradeFeedbackStrings.CORRECT);
        }
      }
      // Checkbox
      else if (selectedOption?.isCorrect) {
        notificationInfoLabel = getTranslation(GradeFeedbackStrings.CORRECT);
      } else {
        notificationInfoLabel = getTranslation(GradeFeedbackStrings.CHECKBOX_FAILURE_SELECTED_LABEL);
      }

      questionGradeFeedbackInfo.type =
        typeof selectedOption?.isCorrect === 'undefined' ||
        selectedOption?.isCorrect === null ||
        selectedOption?.isCorrect
          ? GradeFeedbackStrings.SUCCESS
          : GradeFeedbackStrings.FAILURE;

      questionGradeFeedbackInfo.notificationInfo = [
        {
          label: notificationInfoLabel,
          description: selectedOptionFeedback || null,
        },
      ];

      return questionGradeFeedbackInfo as QuestionGradeFeedbackInfo;
    }
    case QuizPartTypes.SINGLE_CORRECT:
    case QuizPartTypes.REFLECTIVE_SINGLE_CORRECT: {
      const info = getStandardInfo(props);
      const response = prompt?.effectiveResponse?.response || {};

      // substitute NO_ANSWER_SELECTED feedback if user did not select any option
      if (!('chosen' in response)) {
        info.notificationInfo[0].description = getTranslation(GradeFeedbackStrings.NO_ANSWER_SELECTED);
      }

      return info;
    }
    case QuizPartTypes.CODE_EXPRESSION:
    case QuizPartTypes.MATH_EXPRESSION:
    case QuizPartTypes.REFLECTIVE_TEXT:
    case QuizPartTypes.REGULAR_EXPRESSION:
    case QuizPartTypes.NUMERIC:
    case QuizPartTypes.TEXT_MATCH:
    case QuizPartTypes.PLUGIN:
      return getStandardInfo(props);
    default:
      return questionGradeFeedbackInfo as QuestionGradeFeedbackInfo;
  }
};

export default getQuestionGradeFeedbackInfo;
