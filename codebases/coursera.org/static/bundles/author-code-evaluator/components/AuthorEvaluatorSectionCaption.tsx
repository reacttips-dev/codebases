import PropTypes from 'prop-types';
import React from 'react';

class AuthorEvaluatorSectionCaption extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    style: PropTypes.object,
  };

  render() {
    return (
      // @ts-expect-error ts-migrate(2339) FIXME: Property 'style' does not exist on type 'Readonly<... Remove this comment to see the full error message
      <div className="rc-AuthorEvaluatorSectionCaption caption-text color-secondary-text" style={this.props.style}>
        {this.props.children}
      </div>
    );
  }
}

export default AuthorEvaluatorSectionCaption;
