import React from 'react';
import cx from 'classnames';
import { TestId } from '@trello/test-ids';

import styles from './Textfield.less';
import { makeComponentClasses } from '../makeComponentClasses';

type TextfieldAppearance =
  | 'default'
  | 'transparent' // input appears without border, bg, etc. but still functional
  | 'subtle' // input has no bg when idle, but still has hover and focus states, for example Board Create menu
  | 'borderless'; // input has no border when idle or hovered, but shows the default border when focused

type TextfieldType = 'text' | 'number';

export interface TextfieldProps
  extends Omit<
    React.TextareaHTMLAttributes<HTMLInputElement>,
    'label' | 'disabled' | 'invalid' | 'required' | 'readonly'
  > {
  /**
   * A string of classnames to be applied
   *
   * @default ''
   **/
  className?: string;
  /**
   * Determines the appearance of the text field
   * @default default
   */
  appearance?: TextfieldAppearance;
  /**
   * The width of the textfield.
   * @default null
   */
  width?: string | number;
  /**
   * Sets the field as uneditable, with a changed hover state.
   * @default false
   */
  isDisabled?: boolean;
  /**
   * Sets styling to indicate that the input is invalid
   * @default false
   */
  isInvalid?: boolean;
  /**
   * If true, prevents the value of the input from being edited.
   * @default false
   */
  isReadOnly?: boolean;
  /**
   * Set required for form that the field is part of.
   * @default false
   */
  isRequired?: boolean;
  /**
   * Icon rendered at the end of the input (inside textfield).
   * @default null
   */
  iconAfter?: JSX.Element;
  /**
   * Icon rendered at the beginning of the input (inside textfield).
   * @default null
   */
  iconBefore?: JSX.Element;
  /**
   * A string or component that describes the input rendered inside a <label> tag
   * @default null
   */
  label?: JSX.Element | string | null;
  /**
   * A string that appears inside input if no text is there
   * @default null
   */
  placeholder?: string;
  /**
   * A string to help identify the component during integration tests.
   */
  testId?: TestId;
  /**
   * The HTML input type for this field
   * @default 'text'
   */
  type?: TextfieldType;
  /**
   * Affects the height of the input control. This prop is intended to mirror
   * the spacing prop of the Select control, which itself mirrors the prop with
   * the same name in AKSelect: https://atlassian.design/components/select/code
   * @default default
   */
  spacing?: 'default' | 'compact';
}

export const Textfield = React.forwardRef<HTMLInputElement, TextfieldProps>(
  (props: TextfieldProps, ref) => {
    const {
      appearance,
      className,
      label: labelContent,
      iconAfter,
      iconBefore,
      id,
      isDisabled,
      isInvalid,
      isRequired,
      isReadOnly,
      placeholder,
      width,
      testId,
      type = 'text',
      spacing = 'default',
      ...htmlProps
    } = props;

    const { componentCx: textfieldCx } = makeComponentClasses(
      Textfield.displayName!,
    );

    const hasIcon = iconAfter || iconBefore;

    let inputComponent = (
      <input
        className={cx(
          textfieldCx('input'),
          styles[textfieldCx('input')],
          styles[textfieldCx('input', appearance)],
          {
            [styles[textfieldCx('input', spacing)]]: spacing !== 'default',
            [styles[textfieldCx('input', 'invalid')]]: isInvalid,
            [styles[textfieldCx('input', 'withIconBefore')]]: iconBefore,
            [styles[textfieldCx('input', 'withIconAfter')]]: iconAfter,
          },
        )}
        type={type}
        id={id}
        ref={ref}
        disabled={isDisabled}
        required={isRequired}
        placeholder={placeholder}
        readOnly={isReadOnly}
        data-test-id={testId}
        aria-invalid={isInvalid}
        aria-required={isRequired}
        aria-placeholder={placeholder}
        {...htmlProps}
      />
    );

    if (hasIcon) {
      const defaultIconColor = appearance === 'subtle' ? 'light' : 'dark';
      inputComponent = (
        <div className={styles[textfieldCx('iconContainer')]}>
          {iconBefore &&
            React.cloneElement(iconBefore, {
              color: iconBefore.props.color || defaultIconColor,
              dangerous_className: cx(
                styles[textfieldCx('icon', 'before')],
                iconBefore.props.dangerous_className,
              ),
            })}
          {inputComponent}
          {iconAfter &&
            React.cloneElement(iconAfter, {
              color: iconAfter.props.color || defaultIconColor,
              dangerous_className: cx(
                styles[textfieldCx('icon', 'after')],
                iconAfter.props.dangerous_className,
              ),
            })}
        </div>
      );
    }

    const inputWithLabel: JSX.Element | null | undefined = (
      <label className={cx(styles[textfieldCx('label')])} htmlFor={id}>
        {labelContent}
        {inputComponent}
      </label>
    );

    const extraProps: { style?: { maxWidth?: string | number } } = {};

    if (width) {
      extraProps.style = {
        maxWidth: width,
      };
    }

    return (
      <div className={cx(styles[textfieldCx()], className)} {...extraProps}>
        {labelContent ? inputWithLabel : inputComponent}
      </div>
    );
  },
);
Textfield.displayName = 'Textfield';
