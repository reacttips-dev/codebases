import PropTypes from 'prop-types';
import React from 'react';

import classNames from 'classnames';
import 'css!bundles/author-code-evaluator/components/__styles__/TestCasePill';

class TestCasePill extends React.Component<{
  onClick?: (index: number) => void;
  name: string;
  index: number;
  isSelected: boolean;
  isPassed: boolean;
  isFailed: boolean;
}> {
  static propTypes = {
    onClick: PropTypes.func.isRequired,
    name: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    isSelected: PropTypes.bool.isRequired,
    isPassed: PropTypes.bool.isRequired,
    isFailed: PropTypes.bool.isRequired,
  };

  onClick = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.index);
    }
  };

  render() {
    const { name, isSelected, isPassed, isFailed } = this.props;

    const classes = classNames('rc-TestCasePill', 'nostyle', 'body-2-text', {
      selected: isSelected,
      passed: isPassed,
      failed: isFailed,
      default: !isPassed && !isFailed,
    });

    return (
      <button className={classes} onClick={this.onClick} disabled={!this.props.onClick}>
        {name || <span>&nbsp;</span>}
      </button>
    );
  }
}

export default TestCasePill;
