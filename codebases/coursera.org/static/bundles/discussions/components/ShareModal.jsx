import _t from 'i18n!nls/discussions';
import PropTypes from 'prop-types';
import React from 'react';
import Modal from 'bundles/phoenix/components/Modal';
import { buildUrl } from 'bundles/discussions/utils/discussionsUrl';
import CopyLink from 'bundles/ui/components/CopyLink/CopyLink';
import 'css!./__styles__/ShareModal';

class ShareModal extends React.Component {
  static propTypes = {
    handleClose: PropTypes.func.isRequired,
    post: PropTypes.object.isRequired,
    forumLink: PropTypes.string,
  };

  render() {
    const { post, handleClose, forumLink } = this.props;
    const postUrl =
      window.location.origin + buildUrl(forumLink, post.questionId, post.topLevelForumAnswerId, post.forumCommentId);

    return (
      <Modal modalName={_t('Share Post')} handleClose={handleClose} className="rc-ShareModal">
        <h3 className="c-modal-title headline-3-text">{_t('Share Post')}</h3>
        <CopyLink shareLink={postUrl} message={_t('Copy the url for the post')} />
      </Modal>
    );
  }
}

export default ShareModal;
