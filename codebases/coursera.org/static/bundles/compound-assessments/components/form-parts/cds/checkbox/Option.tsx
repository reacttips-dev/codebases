import React from 'react';

import { Checkbox, color } from '@coursera/coursera-ui';
import { Typography } from '@coursera/cds-core';
import CMLOrHTML from 'bundles/cml/components/CMLOrHTML';
import initBem from 'js/lib/bem';

import { Option as OptionType } from 'bundles/compound-assessments/types/FormParts';

import 'css!./__styles__/Option';

const bem = initBem('Option');

type Props = {
  option: OptionType;
  isSelected: boolean;
  onChange: (event: { target: HTMLInputElement }) => void;
  isDisabled: boolean;
  isReadOnly: boolean;
  isRadio?: boolean;
  promptId: string;
  inputHtmlAttributes?: React.InputHTMLAttributes<HTMLInputElement>;
};

const Option = ({
  onChange,
  option,
  isSelected,
  isDisabled,
  isReadOnly,
  promptId,
  isRadio = false,
  inputHtmlAttributes,
}: Props) => (
  <div className={bem(undefined, { isReadOnly })}>
    <Checkbox
      disabled={isDisabled}
      onChange={onChange}
      checked={isSelected}
      value={option.id}
      isRadio={isRadio}
      readOnly={isReadOnly}
      name={promptId}
      {...(isReadOnly
        ? {
            uncheckedColor: color.secondaryText,
            uncheckedHoverColor: color.secondaryText,
            checkedColor: color.secondaryText,
            checkedHoverColor: color.secondaryText,
          }
        : {})}
      inputHtmlAttributes={inputHtmlAttributes}
    >
      <Typography variant="body1">
        <CMLOrHTML value={option.display} display="inline-block" />
      </Typography>
    </Checkbox>
  </div>
);

export default Option;
