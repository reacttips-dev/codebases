import React from 'react';

import Option from 'bundles/compound-assessments/components/form-parts/checkbox/Option';
import PollHistogram from 'bundles/compound-assessments/components/form-parts/poll/PollHistogram';
import QuestionTypes from 'bundles/author-questions/constants/QuestionTypes';

import { PollPrompt, PollResponse, PollFeedbackResponseDefinition } from 'bundles/compound-assessments/types/FormParts';
import { typeNames } from 'bundles/compound-assessments/constants';

type Props = {
  prompt?: PollPrompt;
  response?: PollResponse;
  onChangeResponse: (response: PollResponse) => void;
  isDisabled: boolean;
  isReadOnly: boolean;
  showValidation: boolean;
};

class Poll extends React.Component<Props> {
  handleResponse(optionID: string) {
    const { onChangeResponse, response, prompt } = this.props;

    const chosen = response?.definition?.value?.chosen;
    const questionType = prompt?.question?.type;
    const isRadio = questionType === QuestionTypes.Poll;

    let value: string | string[] = optionID;

    if (Array.isArray(chosen)) {
      value = [...chosen];

      const optionIndex = value.indexOf(optionID);

      if (optionIndex < 0) {
        value.push(optionID);
      } else {
        value.splice(optionIndex, 1);
      }
    } else if (!isRadio) {
      value = [optionID];
    }

    onChangeResponse({
      typeName: typeNames.AUTO_GRADABLE_RESPONSE,
      definition: {
        value: {
          chosen: value,
        },
      },
    });
  }

  render() {
    const { prompt, response, isReadOnly, isDisabled } = this.props;

    if (!prompt) {
      return null;
    }

    const histogram = prompt?.variant?.definition?.histogram;
    const feedback = (prompt?.feedback?.definition as PollFeedbackResponseDefinition)?.options;
    const chosen = response?.definition?.value?.chosen;
    const options = prompt?.variant?.definition?.options;
    const previousResponse = prompt?.variant?.definition?.previousResponse;
    const questionType = prompt?.question?.type;
    const isRadio = questionType === 'poll';

    let responses: string[] = [];

    if (Array.isArray(chosen)) {
      responses = chosen;
    } else if (chosen) {
      responses = [chosen];
    } else if (previousResponse) {
      responses = [previousResponse];
    }

    if (options && (chosen || previousResponse) && (histogram || feedback)) {
      return <PollHistogram responses={responses} histogram={histogram || feedback} options={options} />;
    }

    return (
      <div>
        {options &&
          options.map((option) => (
            <Option
              key={option.id}
              onChange={() => this.handleResponse(option?.id)}
              option={option}
              isSelected={responses?.includes(option?.id) ?? false}
              isDisabled={isDisabled}
              isReadOnly={isReadOnly}
              isRadio={isRadio}
              promptId={prompt?.id ?? ''}
            />
          ))}
      </div>
    );
  }
}

export default Poll;
