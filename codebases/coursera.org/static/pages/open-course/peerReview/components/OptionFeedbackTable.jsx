import React from 'react';
import 'css!./__styles__/OptionFeedbackTable';

class OptionFeedbackTable extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  };

  render() {
    return (
      <table className="rc-OptionFeedbackTable">
        <tbody>{this.props.children}</tbody>
      </table>
    );
  }
}

export default OptionFeedbackTable;
