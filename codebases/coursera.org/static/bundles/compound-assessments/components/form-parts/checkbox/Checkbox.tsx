import React from 'react';

import initBem from 'js/lib/bem';
import Option from 'bundles/compound-assessments/components/form-parts/checkbox/Option';

import { typeNames } from 'bundles/compound-assessments/constants';

import GradeNotification from 'bundles/compound-assessments/components/form-parts/GradeNotification';

import {
  CheckboxPrompt,
  CheckboxReflectPrompt,
  CheckboxResponse,
  CheckboxReflectResponse,
} from 'bundles/compound-assessments/types/FormParts';
import { FormPartsValidationStatus } from 'bundles/compound-assessments/components/form-parts/lib/checkResponsesInvalid';

import 'css!./__styles__/Checkbox';

const bem = initBem('FormPartsCheckbox');

type Prompt = CheckboxPrompt | CheckboxReflectPrompt;
type Response = CheckboxResponse | CheckboxReflectResponse;

type Props = {
  prompt?: Prompt;
  response?: Response;
  onChangeResponse: (response: Response) => void;
  isDisabled: boolean;
  isReadOnly: boolean;
};

export const checkInvalid = (response: Response): FormPartsValidationStatus | null => null;

class Checkbox extends React.Component<Props> {
  toggleValue = (value: string) => {
    const { onChangeResponse, response } = this.props;
    const chosen = [...((((response || {}).definition || {}).value || {}).chosen || [])];

    const chosenIndex = chosen.indexOf(value);

    if (chosenIndex === -1) {
      chosen.push(value);
    } else {
      chosen.splice(chosenIndex, 1);
    }

    onChangeResponse({
      typeName: typeNames.AUTO_GRADABLE_RESPONSE,
      definition: {
        value: {
          chosen,
        },
      },
    });
  };

  render() {
    const { prompt, response, isDisabled, isReadOnly } = this.props;

    if (prompt) {
      const chosen = (((response || {}).definition || {}).value || {}).chosen || [];
      const { options } = prompt.variant.definition;
      return (
        <div className={bem()}>
          {options &&
            options.map((option) => (
              <div key={option.id} className={bem('optionContainer')}>
                <Option
                  // @ts-expect-error TSMIGRATION
                  question={prompt}
                  onChange={() => this.toggleValue(option.id)}
                  option={option}
                  isSelected={chosen.includes(option.id)}
                  isDisabled={isDisabled}
                  isReadOnly={isReadOnly}
                  promptId={prompt.id}
                />
                <GradeNotification prompt={prompt} option={option} />
              </div>
            ))}
          <GradeNotification prompt={prompt} />
        </div>
      );
    }
    return null;
  }
}

export default Checkbox;
