import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

class PaymentChoice extends React.Component {
  static propTypes = {
    title: PropTypes.node.isRequired,
    type: PropTypes.oneOf(['full', 'single', 'free', 'program', 'group', 'subscription']).isRequired,
    currentType: PropTypes.oneOf(['full', 'single', 'free', 'program', 'group', 'subscription']).isRequired,
    children: PropTypes.node,
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
  };

  static contextTypes = {
    uniqueRadioName: PropTypes.string,
  };

  static defaultProps = {
    disabled: false,
  };

  handleClick = () => {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'onClick' does not exist on type 'Readonl... Remove this comment to see the full error message
    if (this.props.onClick) {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'onClick' does not exist on type 'Readonl... Remove this comment to see the full error message
      this.props.onClick(this.props.type);
    }
  };

  render() {
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const componentClasses = 'bt3-radio rc-PaymentChoice styleguide ' + this.props.type;
    const titleClasses = classNames('choice-title', {
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'disabled' does not exist on type 'Readon... Remove this comment to see the full error message
      disabled: this.props.disabled,
    });
    const { uniqueRadioName } = this.context;
    const computedRadioName = uniqueRadioName ? `payment-choice-${uniqueRadioName}` : 'payment-choice';
    // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Readonly<{... Remove this comment to see the full error message
    const descriptionId = `payment-choice-secondary-description-${this.props.type}`;
    return (
      <div className={componentClasses}>
        <label className="horizontal-box align-items-vertical-center">
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'disabled' does not exist on type 'Readon... Remove this comment to see the full error message */}
          {!this.props.disabled && (
            <input
              type="radio"
              name={computedRadioName}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Readonly<{... Remove this comment to see the full error message
              value={this.props.type}
              // @ts-expect-error ts-migrate(2339) FIXME: Property 'type' does not exist on type 'Readonly<{... Remove this comment to see the full error message
              defaultChecked={this.props.type === this.props.currentType}
              onClick={this.handleClick}
              aria-describedby={descriptionId}
            />
          )}
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'disabled' does not exist on type 'Readon... Remove this comment to see the full error message */}
          {!this.props.disabled && (
            <span className="cif-stack payment-choice-radio-button">
              <i className="cif-circle-thin cif-stack-2x" />
              <i className="cif-circle cif-stack-1x" />
            </span>
          )}
          {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'disabled' does not exist on type 'Readon... Remove this comment to see the full error message */}
          {this.props.disabled && <i className="cif-times" />}
          <h4 className={titleClasses} aria-describedby="choice-title-label">
            {/* @ts-expect-error ts-migrate(2339) FIXME: Property 'title' does not exist on type 'Readonly<... Remove this comment to see the full error message */}
            {this.props.title}
          </h4>
        </label>
        {this.props.children && (
          <span id={descriptionId} className="color-secondary-text choice-description">
            {this.props.children}
          </span>
        )}
      </div>
    );
  }
}

export default PaymentChoice;
