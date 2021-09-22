import React from 'react';

import transformQuestionToFormData from 'bundles/video-quiz/utils/transformQuestionToFormData';
import getFormPartData from 'bundles/compound-assessments/components/form-parts/lib/getFormPartData';
import CMLOrHTML from 'bundles/cml/components/CMLOrHTML';
import FormPart from 'bundles/compound-assessments/components/form-parts/FormPart';

import { GradeFeedbackStrings } from 'bundles/compound-assessments/lib/utils/getQuestionGradeFeedbackInfo';

import type { InVideoQuestion, VideoQuizState } from 'bundles/video-quiz/types';
import type { QuizQuestionPrompt } from 'bundles/compound-assessments/types/FormParts';

import 'css!./__styles__/VideoQuizQuestionArea';

type Props<T extends QuizQuestionPrompt> = {
  question: InVideoQuestion<T> | null;
  isDisabled?: boolean;
  isReadonly?: boolean;
  currentState: VideoQuizState;
};

class VideoQuizQuestionArea<T extends QuizQuestionPrompt> extends React.Component<Props<T>> {
  // @ts-ignore ts-migrate(7008) FIXME: Member 'containerRef' implicitly has an 'any' type... Remove this comment to see the full error message
  private containerRef;

  componentDidUpdate() {
    // Attempt to show the failure feedback first
    let selector = `[data-test='GradeFeedback-${GradeFeedbackStrings.FAILURE}]`;

    // If there isn't any, just show the first piece of feedback
    if (!this.containerRef.querySelector(selector)) {
      selector = "[data-test^='GradeFeedback-']";
    }

    this.containerRef.scrollTop = this.containerRef.querySelector(selector)?.offsetTop ?? 0;
  }

  render() {
    const { question, isDisabled, isReadonly } = this.props;

    if (!question) {
      return null;
    }

    const {
      root: { element, children },
    } = transformQuestionToFormData(question);

    const { promptText } = getFormPartData(element);

    return (
      <div
        ref={(r) => {
          this.containerRef = r;
        }}
        className="rc-VideoQuizQuestionArea"
        aria-live="assertive"
      >
        <CMLOrHTML value={promptText} />
        <div className="rc-VideoQuizQuestionArea__responseBox">
          <FormPart isReadOnly={isReadonly} isDisabled={isDisabled} formPart={element} />
          {children && children.length > 0 && (
            <div>
              {children.map(({ element: childFormPart }) => (
                <FormPart isReadOnly={isReadonly} isDisabled={isDisabled} formPart={childFormPart} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default VideoQuizQuestionArea;
