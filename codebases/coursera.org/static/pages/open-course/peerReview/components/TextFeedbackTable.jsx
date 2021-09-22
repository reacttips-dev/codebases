import React from 'react';

class TextFeedbackTable extends React.Component {
  static propTypes = {
    children: React.PropTypes.node,
  };

  render() {
    return (
      <div className="rc-TextFeedbackTable" style={{ marginTop: 16 }}>
        {this.props.children}
      </div>
    );
  }
}

export default TextFeedbackTable;
