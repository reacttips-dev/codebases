import styled from '@emotion/styled';
import React from 'react';
import {
  FieldSelectProps,
  NestedOptionType,
  OptGroupType,
  OptionType,
  OptionVariant,
  Variant,
} from './types';

function getNestedOptionSelected(selectElement: HTMLSelectElement) {
  const { selectedOptions } = selectElement;
  if (selectedOptions.length === 0) return false;
  return selectedOptions[0].getAttribute('data-nested-option') === 'true';
}

function getSubOptions(options: OptionVariant[]) {
  let allSubOptions: OptionType[] = [];
  options.forEach(option => {
    const optionType = getOptionType(option);
    if (optionType === 'nested-option') {
      const { subOptions } = option as NestedOptionType;
      allSubOptions = [...allSubOptions, ...subOptions];
    }
  });
  return allSubOptions;
}

const Select = styled.select<SelectComponentProps>`
  height: 46px;
  padding: ${({ isValueNestedOption }) =>
    `12px 12px 12px ${isValueNestedOption ? 0 : 12}px`};
  width: 100%;
  border: 2px solid ${({ isError }) => (isError ? '#e54751' : '#dedfe0')};
  border-radius: 6px;
  color: #292f36;
  font-weight: normal;
  -webkit-appearance: none;
  background: #fff
    url("data:image/svg+xml;utf8,<svg viewBox='0 0 140 140' width='12' height='12' xmlns='http://www.w3.org/2000/svg'><g><path d='m121.3,34.6c-1.6-1.6-4.2-1.6-5.8,0l-51,51.1-51.1-51.1c-1.6-1.6-4.2-1.6-5.8,0-1.6,1.6-1.6,4.2 0,5.8l53.9,53.9c0.8,0.8 1.8,1.2 2.9,1.2 1,0 2.1-0.4 2.9-1.2l53.9-53.9c1.7-1.6 1.7-4.2 0.1-5.8z' fill='black'/></g></svg>")
    no-repeat;
  background-position: right 12px top 50%;
  line-height: 2rem;
  font-size: 1.4rem;

  &:focus,
  &:active {
    outline: 0;
    border-color: #5000b9;
  }
  &::placeholder {
    color: #7f8287;
    font-weight: normal;
  }
  &:invalid {
    color: #7f8287;

    option:not(:disabled) {
      color: #292f36;
    }
  }
`;

export const FieldSelect = React.forwardRef(
  (
    {
      id,
      name,
      value,
      options,
      placeholder,
      onChange,
      error,
      ...rest
    }: FieldSelectProps,
    ref: React.Ref<HTMLSelectElement>
  ) => {
    // `isValueNestedOption` allows us to adjust the padding on the select element
    // based on the seleted value type. We display nested options with three spaces
    // prepended in order to get the visual of it being nested in the select
    // dropdown, side effect here is when it's displayed in the select input,
    // you see the spaces. removing the padding will make this look not weird
    const [isValueNestedOption, setIsValueNestedOption] = React.useState<
      boolean | null
    >(null);
    React.useEffect(() => {
      if (isValueNestedOption === null && options && options.length > 0) {
        setIsValueNestedOption(
          getSubOptions(options).some(option => option.value === value)
        );
      }
    }, [value, options, isValueNestedOption]);
    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
      setIsValueNestedOption(getNestedOptionSelected(e.currentTarget));
      if (onChange) {
        onChange(e);
      }
    }

    return (
      <Select
        {...rest}
        isError={!!error}
        ref={ref}
        id={id}
        name={name}
        data-cy={name}
        value={value}
        onChange={handleChange}
        isValueNestedOption={isValueNestedOption}
        data-value={value}
      >
        {placeholder !== undefined && (
          <option value="" disabled={true}>
            {placeholder}
          </option>
        )}
        {options !== undefined &&
          options.map(option => {
            const { label: displayLabel } = option;
            const optionType = getOptionType(option);
            // eslint-disable-next-line default-case
            switch (optionType) {
              case 'option': {
                const { value: optionValue } = option as OptionType;
                return (
                  <Option
                    key={`select-option-${id}-${optionValue}-${displayLabel}`}
                    value={optionValue}
                    label={displayLabel}
                  />
                );
              }
              case 'optgroup': {
                const { subOptions } = option as OptGroupType;
                return (
                  <OptGroup
                    key={`select-optgroup-${id}-${displayLabel}`}
                    label={displayLabel}
                    subOptions={subOptions}
                    currentValue={(value as string) || ''}
                  />
                );
              }
              case 'nested-option': {
                // this nested option is a design/product driven UX where the parent
                // and nested options are both selectable -- this isn't supported
                // by the native html select. contrasting this from the optgroup
                // where the 'parent' with optgroups are _NOT_ selectable
                const {
                  value: nestedOptionValue,
                  subOptions: nestedSubOptions,
                } = option as NestedOptionType;
                return (
                  <React.Fragment
                    key={`select-nested-option-${id}-${nestedOptionValue}-${displayLabel}`}
                  >
                    <Option value={nestedOptionValue} label={displayLabel} />
                    {nestedSubOptions.map(subOption => {
                      const {
                        label: subOptionLabel,
                        value: subOptionValue,
                      } = subOption;
                      return (
                        <Option
                          key={`select-sub-option-${id}-${nestedOptionValue}-${displayLabel}-${subOptionValue}`}
                          value={subOptionValue}
                          label={subOptionLabel}
                          isNestedSubOption={true}
                        />
                      );
                    })}
                  </React.Fragment>
                );
              }
              default: {
                return null;
              }
            }
          })}
      </Select>
    );
  }
);

function OptGroup({
  label,
  subOptions,
}: OptGroupType & { currentValue: string }) {
  return (
    <optgroup label={label}>
      {subOptions.map(({ label: optionLabel, value }) => (
        <Option
          key={`optgroup-option-${value}`}
          value={value}
          label={optionLabel}
        />
      ))}
    </optgroup>
  );
}

function Option({
  label,
  value,
  isNestedSubOption = false,
}: OptionType & { isNestedSubOption?: boolean }) {
  // this is a hacky solution to be able to visually indent a child
  // option for nested-options
  return isNestedSubOption ? (
    // adding the `&nbsp;` will give the illusion that these options are nested
    <option value={value} data-nested-option="true">
      &nbsp;&nbsp;&nbsp;{label}
    </option>
  ) : (
    <option value={value}>{label}</option>
  );
}

type SelectComponentProps = {
  isValueNestedOption: boolean | null;
  isError?: boolean;
};

function getOptionType(
  option: OptionType | OptGroupType | NestedOptionType
): Variant {
  // regular option - no sub-options
  if (!Object.prototype.hasOwnProperty.call(option, 'subOptions')) {
    return 'option';
  }
  // optgroup - has sub-options, but no value
  // nested option - has sub-options and a value
  return Object.prototype.hasOwnProperty.call(option, 'value')
    ? 'nested-option'
    : 'optgroup';
}

export { ControlledFieldSelect } from './ControlledFieldSelect';
