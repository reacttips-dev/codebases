import PropTypes from 'prop-types';
import React from 'react';
import 'css!bundles/phoenix/components/__styles__/ProgressBar';

class ProgressBar extends React.Component {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    percentComplete: PropTypes.number,
  };

  static defaultProps = {
    width: '200px',
    height: '15px',
    percentComplete: 0,
  };

  render() {
    const { height, width, percentComplete } = this.props;

    return (
      <div className="rc-ProgressBar" style={{ width, height }}>
        <div className="bgcolor-primary" style={{ width: `${percentComplete}%`, height }} />
      </div>
    );
  }
}

export default ProgressBar;
