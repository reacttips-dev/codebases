import _t from 'i18n!nls/discussions';
import PropTypes from 'prop-types';
import React from 'react';
import 'css!./__styles__/AdminDetails';

class AdminDetails extends React.Component {
  static propTypes = {
    post: PropTypes.object.isRequired,
  };

  render() {
    const { post } = this.props;
    return post.showAdminDetails ? (
      <div className="rc-AdminDetails align-self-end">
        <p>{_t('User ID') + ': ' + post.creator.userId}</p>
      </div>
    ) : null;
  }
}

export default AdminDetails;
