import React from 'react';
import classNames from 'classnames';
import a11yKeyPress from 'js/lib/a11yKeyPress';
import _t from 'i18n!nls/teach-course';
import { color } from '@coursera/coursera-ui';
import 'css!./__styles__/ToggleSwitch';

export const STATUS = {
  On: 'on',
  Off: 'off',
} as const;

export type StatusEnum = 'on' | 'off';

type Props = {
  defaultStatus?: StatusEnum;
  value?: StatusEnum;
  onToggle: (newStatus: StatusEnum) => void;
  disableToggle?: boolean;
  hideStatusText?: boolean;
  ariaLabel?: string;
  onColor?: string;
  offColor?: string;
  onLabel?: string;
  offLabel?: string;
};

type State = {
  status?: StatusEnum;
};

class ToggleSwitch extends React.Component<Props, State> {
  static defaultProps = {
    disableToggle: false,
    hideStatusText: false,
    onColor: color.success,
    offColor: "#9B9B9B",
    onLabel: _t('Yes'),
    offLabel: _t('No'),
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      status: props.value || props.defaultStatus,
    };
  }

  componentWillReceiveProps(nextProps: Props) {
    if (nextProps.value !== undefined) {
      this.setState({ status: nextProps.value });
    }
  }

  onClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    const { status } = this.state;
    const { onToggle } = this.props;
    const newStatus = status === STATUS.Off ? STATUS.On : STATUS.Off;

    this.setState({
      status: newStatus,
    });

    onToggle(newStatus);
  };

  static getStatus = function () {
    return STATUS;
  };

  render() {
    const { disableToggle, hideStatusText, ariaLabel, onColor, offColor, onLabel, offLabel } = this.props;
    const { status } = this.state;
    const toggleClasses = classNames('rc-ToggleSwitch', status, {
      'is-disabled': disableToggle,
    });
    const statusText = status === STATUS.Off ? offLabel : onLabel;
    const backgroundColor = status === STATUS.Off ? { backgroundColor: offColor } : { backgroundColor: onColor };
    return (
      // eslint-disable-next-line jsx-a11y/interactive-supports-focus
      <div
        style={backgroundColor}
        className={toggleClasses}
        role="button"
        aria-label={ariaLabel}
        onClick={!disableToggle ? this.onClick : undefined}
        onKeyPress={(event) => !disableToggle && a11yKeyPress(event, this.onClick)}
        aria-pressed={status === STATUS.On}
        tabIndex={!disableToggle ? 0 : undefined}
      >
        <span className="toggle-handle" />
        {!hideStatusText && statusText}
      </div>
    );
  }
}

export default ToggleSwitch;
