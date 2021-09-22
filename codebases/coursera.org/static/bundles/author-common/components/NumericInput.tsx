import React from 'react';
import 'css!bundles/author-common/components/__styles__/NumericInput';

type Props = {
  initialValue?: number | string | null;

  min?: number | null;
  max?: number | null;

  width?: number | string;
  height?: number;

  // The allowEmpty flag allows users to clear out the input while editing
  // without defaulting the value to 0, which could be below the set minimum.
  allowEmpty?: boolean | null;

  allowDecimal?: boolean | null;
  allowNegative?: boolean | null;
  disabled?: boolean | null;

  // this allows a parent to have access to the input element's ref
  inputRef?: React.Ref<HTMLInputElement> | null;

  onChange?: ((x: number) => void) | null;
  id?: string | null;
  ariaLabel?: string;
  ariaDescribedBy?: string;
};

type State = {
  value?: number | string | null;
};

class NumericInput extends React.Component<Props, State> {
  static defaultProps = {
    width: 90,
    height: 50,
    allowEmpty: false,
    allowDecimal: true,
    allowNegative: true,
    onChange: () => undefined,
  };

  state: State = {
    value: undefined,
  };

  constructor(props: Props) {
    super(props);

    if (props.initialValue !== null && props.initialValue !== undefined) {
      this.state = {
        value: props.initialValue,
      };
    }
  }

  componentWillReceiveProps(newProps: Props) {
    // avoid overriding empty intermediate states that can exist when allowEmpty = true
    if (this.state.value !== '') {
      this.setState({
        value: newProps.initialValue,
      });
    }
  }

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const whitelistedKeys = [
      37, // Left arrow
      38, // Up arrow
      39, // Right arrow
      40, // Down arrow
      9, // Tab
      8, // Backspace
      46, // Delete
      96, // numpad 0
      97, // numpad 1
      98, // numpad 2
      99, // numpad 3
      100, // numpad 4
      101, // numpad 5
      102, // numpad 6
      103, // numpad 7
      104, // numpad 8
      105, // numpad 9
    ];

    const { allowDecimal, allowNegative } = this.props;

    if (allowDecimal) {
      whitelistedKeys.push(190); // .
    }

    if (allowNegative) {
      whitelistedKeys.push(189); // -
      whitelistedKeys.push(173); // - (Firefox has a different key code for this than other browsers)
    }

    if (
      whitelistedKeys.indexOf(event.which) === -1 &&
      !event.metaKey &&
      !event.ctrlKey &&
      /[^0-9]/.test(String.fromCharCode(event.which))
    ) {
      event.preventDefault();
    }
  };

  handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let newValue: number | string | undefined | null = event.target.value;

    const { allowEmpty, allowDecimal, allowNegative, max, min, onChange } = this.props;
    const { value } = this.state;

    // When negative numbers are allowed, allow entry of the negative symbol after the default field value of 0 and
    // allow deletion that causes the input to only contain the negative symbol
    if (allowNegative && (newValue === '-' || (newValue === '0-' && value === 0))) {
      newValue = '-';
    } else if (newValue === '') {
      if (!allowEmpty) {
        // Give the input a value of 0 if it is empty
        newValue = '0';
      }
    } else if (Number.isNaN(newValue)) {
      // Ignore all other invalid (non-numeric) inputs
      return;
    }

    const lastChar = newValue.toString().slice(-1);
    const hasDecimalTrailingZero = newValue.indexOf('.') !== -1 && lastChar === '0';

    // Only parse the input's value and update the model if the value is valid
    // The ignored cases are input states encountered while composing valid numbers. They are cleaned up in handleBlur.
    if (
      newValue !== '' &&
      newValue !== '-' &&
      newValue !== '-0' &&
      !(allowDecimal && (lastChar === '.' || hasDecimalTrailingZero))
    ) {
      if (allowDecimal) {
        newValue = parseFloat(newValue);
      } else {
        newValue = parseInt(newValue, 10);
      }

      if ((typeof max === 'number' && newValue > max) || (typeof min === 'number' && newValue < min)) {
        // reset to current state for out-of-range input
        newValue = value;
      }

      if (onChange && typeof newValue === 'number') {
        onChange(newValue);
      }
    }

    // We support some strings here, like a temporary negative. Take another look when we move to TypeScript.
    this.setState({ value: newValue });
  };

  handleBlur = () => {
    const { allowDecimal, onChange, initialValue } = this.props;
    let { value } = this.state;

    // Check the input field's value to see if it is an invalid number allowed to be entered for composition purposes
    // If the input value is invalid, reset the input field to have a value of 0
    if (typeof value === 'string') {
      // If the input value is empty, reset the input field to its initial value
      if (value === '') {
        this.setState({ value: initialValue });
        return;
      }
      const lastChar = value.slice(-1);
      if (value === '-' || value === '-0' || lastChar === '.') {
        value = 0;
        this.setState({ value });
        if (onChange) {
          onChange(value);
        }
      } else if (allowDecimal && lastChar === '0') {
        value = parseFloat(value);
        this.setState({ value });
        if (onChange) {
          onChange(value);
        }
      }
    }
  };

  handleFocus = (event: React.FocusEvent<HTMLInputElement>) => event.target.select();

  render() {
    const { disabled, height, id, min, max, width, ariaLabel, inputRef, ariaDescribedBy } = this.props;
    const { value } = this.state;
    const style = {
      width,
      height,
    };

    return (
      <input
        type="text"
        style={style}
        min={min === null ? undefined : min}
        max={max === null ? undefined : max}
        value={value === null ? undefined : value}
        className="rc-NumericInput"
        disabled={disabled || false}
        onFocus={this.handleFocus}
        onKeyDown={this.handleKeyDown}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        id={id === null ? undefined : id}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        {...(inputRef && { ref: inputRef })}
      />
    );
  }
}

export default NumericInput;
