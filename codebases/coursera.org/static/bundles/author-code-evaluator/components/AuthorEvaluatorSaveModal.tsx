import React from 'react';

import Modal from 'bundles/author-common/components/Modal';
import _t from 'i18n!nls/author-code-evaluator';
import 'css!bundles/author-code-evaluator/components/__styles__/AuthorEvaluatorSaveModal';

class AuthorEvaluatorSaveModal extends React.Component {
  render() {
    return (
      <Modal
        // @ts-expect-error TSMIGRATION
        size="small"
        allowClose={false}
        withTitle={true}
        heading={_t('Saving')}
        className="rc-AuthorEvaluatorSaveModal"
      >
        <div className="horizontal-box align-items-spacearound body-2-text">
          {_t('Please do not refresh the page.')}
        </div>
      </Modal>
    );
  }
}

export default AuthorEvaluatorSaveModal;
