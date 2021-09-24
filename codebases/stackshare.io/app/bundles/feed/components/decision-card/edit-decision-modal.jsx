import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import BaseModal from '../../../../shared/library/modals/base/modal.jsx';
import {withPortal} from '../../../../shared/library/modals/base/portal.jsx';
import {decisionItem} from '../../../../data/feed/fragments';
import ComposerProvider from '../../../../shared/library/composer/state/provider';
import {Composer} from '../../../../shared/library/composer';
import {buildPostFromDecision} from '../../../../shared/library/composer/utils';
import {PrivateModeContext} from '../../../../shared/enhancers/private-mode-enchancer';

const EditDecisionModal = ({onDismiss, decision, editMode}) => {
  const privateMode = useContext(PrivateModeContext);

  const updateFn = (store, data) => {
    store.writeFragment({
      id: data.id,
      fragment: decisionItem,
      data: data,
      fragmentName: 'decisionItem'
    });
  };

  return (
    <BaseModal title="Edit Post" width={800} onDismiss={onDismiss} layout="none">
      <ComposerProvider post={buildPostFromDecision(decision)} debug privateMode={privateMode}>
        <Composer
          onMutationUpdate={updateFn}
          onCancel={onDismiss}
          onSubmit={onDismiss}
          editMode={editMode}
        />
      </ComposerProvider>
    </BaseModal>
  );
};

EditDecisionModal.propTypes = {
  onDismiss: PropTypes.func,
  decision: PropTypes.object,
  editMode: PropTypes.bool
};

export default withPortal(EditDecisionModal);
