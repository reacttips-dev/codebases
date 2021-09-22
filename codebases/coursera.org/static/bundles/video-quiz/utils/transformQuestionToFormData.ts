import transformQuizToFormData from 'bundles/quiz-compound-assessment/lib/util/transformQuizToFormData';

import type { InVideoQuestion } from 'bundles/video-quiz/types';
import { typeNames } from 'bundles/compound-assessments/constants';
import type { FormPart as FormPartType } from 'bundles/compound-assessments/components/api/AssignmentPresentation';
import type { QuizQuestionPrompt } from 'bundles/compound-assessments/types/FormParts';

const transformQuestionToFormData = <T extends QuizQuestionPrompt>(question: InVideoQuestion<T>): FormPartType => {
  const [{ prompt, response }] = transformQuizToFormData([question as QuizQuestionPrompt], undefined, true);

  return {
    id: prompt.id,
    root: {
      element: {
        definition: {
          prompt: {
            typeName: typeNames.AUTO_GRADABLE_PROMPT,
            definition: {
              value: {
                effectiveResponse: prompt.effectiveResponse,
                variant: {
                  definition: prompt.variant,
                },
                question: prompt.question,
                feedback: prompt.feedback,
              },
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
};

export default transformQuestionToFormData;
