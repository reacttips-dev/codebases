import {
  QuizQuestionLegacyResponse,
  QuizQuestionPrompt,
  QuizQuestionResponse,
} from 'bundles/compound-assessments/types/FormParts';
import { typeNames } from '../../../compound-assessments/constants';

type QuizFormData = {
  prompt: QuizQuestionPrompt;
  response: QuizQuestionResponse;
};

const getDefaultResponseValue = (questionPrompt: QuizQuestionPrompt) => {
  if (((questionPrompt || {}).question || {}).type === 'widget') {
    return {
      answer: {},
    };
  }
  return null;
};

const transformQuizToFormData = (
  quizQuestions: Array<QuizQuestionPrompt>,
  quizResponses?: Array<QuizQuestionLegacyResponse>,
  getResponseFromQuestionsFeedback?: boolean
): Array<QuizFormData> => {
  if (!quizResponses) {
    // @ts-expect-error TSMIGRATION
    return (
      quizQuestions &&
      quizQuestions.map((prompt) => {
        return {
          prompt,
          response: {
            typeName: typeNames.AUTO_GRADABLE_RESPONSE,
            definition: {
              value:
                getResponseFromQuestionsFeedback && ((prompt || {}).effectiveResponse || {}).response
                  ? ((prompt || {}).effectiveResponse || {}).response
                  : getDefaultResponseValue(prompt),
            },
          },
        };
      })
    );
  }

  const responseMap = quizResponses.reduce((map, quizResponse) => {
    return {
      ...map,
      [quizResponse.questionInstance]: quizResponse.response,
    };
  }, {});
  return (
    quizQuestions &&
    quizQuestions.map((prompt) => {
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const response = responseMap[prompt.id];
      return {
        prompt,
        response: {
          typeName: typeNames.AUTO_GRADABLE_RESPONSE,
          definition: {
            value: response,
          },
        },
      };
    })
  );
};

export default transformQuizToFormData;
