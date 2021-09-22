import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/discussions';

class EditIndicator extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  render() {
    const { post } = this.props;
    if (!post.state.edited) return null;
    const editedByModerator = post.state.edited.userId !== post.creator.userId;
    return (
      <span className="rc-EditIndicator">
        <span>&nbsp;·&nbsp;</span>
        {editedByModerator ? _t('Edited by moderator') : _t('Edited')}
      </span>
    );
  }
}

export default EditIndicator;
