import React from 'react';
import { forNamespace } from '@trello/i18n';
import { TeamTypes } from '@trello/organizations';
import { Select } from '@trello/nachos/select';
import { chain } from 'underscore';
import styles from './TeamTypeSelect.less';

const componentFormat = forNamespace('team type dropdown');
const teamTypesFormat = forNamespace('team vertical selection');

/**
 * TeamTypeSelectProps
 * isDisabled - disables the input
 * onChange - called onChange of the select input, returns the selected teamType's string value for form submission
 * initialValue - if the organization already has a team type, this prop will be used as the select input's value
 * testId - data-test-id attribute you want to add to the component
 */
interface TeamTypeSelectProps {
  isDisabled?: boolean;
  onChange: (teamTypeValue: string) => void;
  initialValue?: string;
  testId?: string;
  label?: string;
  required?: boolean;
  placeholder?: string;
}

// eslint-disable-next-line @trello/no-module-logic
const teamTypeSelectOptions = chain(Object.values(TeamTypes))
  .without(TeamTypes.Other)
  .shuffle()
  .value()
  .concat(TeamTypes.Other)
  .map((teamTypeValue) => {
    return {
      label: teamTypesFormat(teamTypeValue),
      value: teamTypeValue,
    };
  });

export const TeamTypeSelect: React.FunctionComponent<TeamTypeSelectProps> = ({
  isDisabled,
  onChange,
  initialValue,
  testId,
  required,
  label,
  placeholder,
}) => {
  let defaultValue = initialValue
    ? { label: teamTypesFormat(initialValue), value: initialValue }
    : { label: componentFormat('default option'), value: '' };

  if (!teamTypeSelectOptions.some((type) => type.value === initialValue)) {
    defaultValue = {
      label: placeholder ? placeholder : componentFormat('default option'),
      value: '',
    };
  }

  let options = teamTypeSelectOptions;
  if (testId) {
    options = options.map((option) => ({
      ...option,
      testId: `${testId}-${option.value}`,
    }));
  }

  return (
    <>
      <label htmlFor="teamTypeSelect">
        {label ? label : componentFormat('input label')}
        {required && <span className={styles.createTeamLabelstar}>*</span>}
      </label>
      <Select
        inputId="teamTypeSelect"
        defaultValue={defaultValue}
        isDisabled={isDisabled}
        options={options}
        // eslint-disable-next-line react/jsx-no-bind
        onChange={(option: { label: string; value: string }) => {
          onChange(option.value);
        }}
        testId={testId}
      />
    </>
  );
};
