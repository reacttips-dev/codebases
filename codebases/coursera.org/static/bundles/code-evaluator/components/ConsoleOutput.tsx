import PropTypes from 'prop-types';
import React from 'react';
import 'css!./__styles__/ConsoleOutput';

class ConsoleOutput extends React.Component {
  static propTypes = {
    children: PropTypes.node,
  };

  render() {
    return <pre className="rc-ConsoleOutput">{this.props.children}</pre>;
  }
}

export default ConsoleOutput;
