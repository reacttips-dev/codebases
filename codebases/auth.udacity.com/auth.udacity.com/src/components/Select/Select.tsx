import Downshift, { ControllerStateAndHelpers } from "downshift";
import React from "react";
import classNames from "classnames";
import SelectOnKeyPressContainer from "./SelectOnKeyPressContainer";

const PREFIX = "vds-select";

/** Select Props */

export interface SelectProps {
  /** Unique ID to associate the label with the Select */
  id: string;

  /**
   * Text label associated with the Select (required for a11y).
   * If you use HTML instead of a string, please ensure it includes proper a11y
   * labels/props.
   */
  label: string | React.ReactNode;

  /** List of options to choose from */
  options: {
    value: string | number;
    label?: string;
  }[];

  /** Initial selected value (for uncontrolled components) */
  defaultValue?: string | number;

  /** Indicates the Select is not available for interaction */
  disabled?: boolean;

  /** Hide label visually */
  hiddenLabel?: boolean;

  /** Callback when Select loses focus */
  onBlur?(event: React.FocusEvent<HTMLButtonElement>): void;

  /** Callback when Select value changes */
  onChange?(
    selectedItem: {
      value: string | number;
      label?: string;
    } | null,
    stateAndHelpers?: ControllerStateAndHelpers<any>
  ): void;

  /** Callback when Select receives focus */
  onFocus?(event: React.FocusEvent<HTMLButtonElement>): void;

  /** Text displayed next to label for non-required fields. Only use this prop to internationalize the default string */
  optionalLabel?: string;

  /** Indicates that a user must select a value before submitting */
  required?: boolean;

  /** A unique value for `data-testid` to serve as a hook for automated tests */
  testID?: string;

  /** The `FormValidation` component */
  validation?: JSX.Element;

  /** Controlled selected value (for controlled components). Requires `onChange` handler */
  value?: string | number;
}

/** Select is a control for selecting a single choice from a list of four or more options. */

const Select: React.FC<SelectProps> = ({
  id,
  label,
  options,
  defaultValue,
  disabled,
  hiddenLabel,
  onBlur,
  onChange,
  onFocus,
  optionalLabel = "Optional",
  required,
  testID,
  validation,
  value
}: SelectProps) => {
  // Null/undefined checks are necessary to catch all cases.
  // We assume the default prop value is applied when validation
  // is present, but the variant property is undefined.

  const isError =
    (validation && validation.props.variant === undefined) ||
    (validation && validation.props.variant === "error");

  const className = classNames(
    PREFIX,
    isError && `${PREFIX}--error`,
    !isError && validation && `${PREFIX}--${validation.props.variant}`
  );

  const labelClassName = classNames(
    `${PREFIX}__label`,
    hiddenLabel && `vds-visually-hidden`
  );

  return (
    <Downshift itemToString={stringifyItem} onChange={onChange}>
      {({
        getItemProps,
        getLabelProps,
        getMenuProps,
        getToggleButtonProps,
        highlightedIndex,
        selectedItem,
        setHighlightedIndex,
        isOpen
      }): React.ReactNode => (
        <div
          className={classNames(className, !isOpen && `${PREFIX}--hidden`)}
          aria-invalid={isError}
          role={undefined}
        >
          <SelectOnKeyPressContainer
            options={options}
            isOpen={isOpen}
            highlightedIndex={highlightedIndex}
            setHighlightedIndex={setHighlightedIndex}
          >
            {/* eslint-disable-next-line */}
            <label
              {...getLabelProps({ className: labelClassName, htmlFor: id })}
            >
              {label}
              {!required && (
                <span className={`${PREFIX}__optional`}>
                  {`(${optionalLabel})`}
                </span>
              )}
            </label>
            <div className={`${PREFIX}__input-container`}>
              <button
                data-testid={testID}
                {...getToggleButtonProps({
                  className: `${PREFIX}__toggle`,
                  disabled,
                  id,
                  onBlur,
                  onFocus
                })}
              >
                {value || getItemLabel(selectedItem) || defaultValue}
              </button>
              {IconArrow}
              <ul {...getMenuProps({ className: `${PREFIX}__options` })}>
                {options.map((item, index) => (
                  <li
                    key={index}
                    {...getItemProps({
                      className: getOptionClassName(index, highlightedIndex),
                      item
                    })}
                  >
                    {getItemLabel(item)}
                  </li>
                ))}
              </ul>
            </div>
            {validation}
          </SelectOnKeyPressContainer>
        </div>
      )}
    </Downshift>
  );
};

export default Select;

const getOptionClassName = (
  optionIndex: number,
  highlightedIndex: number | null
): string => {
  const isSelected = optionIndex === highlightedIndex;
  return classNames(
    `${PREFIX}__option`,
    isSelected && `${PREFIX}__option-selected`
  );
};

const stringifyItem = (
  item: {
    value: string | number;
    label?: string;
  } | null
): string => (item ? String(item.value) : "");

const getItemLabel = (
  item: {
    value: string | number;
    label?: string;
  } | null
): string | number | null => {
  if (item) {
    return item.label ? item.label : item.value;
  }
  return null;
};

const IconArrow = (
  <i
    className="vds-icon vds-icon--sm vds-icon--arrow"
    role="img"
    aria-hidden="true"
  >
    <svg viewBox="0 0 32 32">
      <path
        d="M8.16 11.411l7.13 10.175c.297.422.903.541 1.356.265a.947.947 0 0 0 .292-.276l6.91-10.175c.29-.425.153-.99-.304-1.259A1.033 1.033 0 0 0 23.02 10H8.98c-.542 0-.98.409-.98.912 0 .178.055.351.16.5z"
        fillRule="evenodd"
      />
    </svg>
  </i>
);
