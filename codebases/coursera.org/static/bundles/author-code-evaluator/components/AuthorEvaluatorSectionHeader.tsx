import PropTypes from 'prop-types';
import React from 'react';

class StarterCodeEditorHeader extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
  };

  render() {
    return (
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'style' does not exist on type 'Readonly<... Remove this comment to see the full error message
      <h3 className="rc-AuthorEvaluatorSectionHeader" style={this.props.style}>
        {this.props.children}
      </h3>
    );
  }
}

export default StarterCodeEditorHeader;
