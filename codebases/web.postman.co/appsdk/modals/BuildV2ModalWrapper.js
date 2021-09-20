import { observer } from 'mobx-react';
import React, { Component } from 'react';
import ScratchpadService from '../../js/services/ScratchpadService';
import { isEmbeddedScratchpad } from '../../js/utils/ScratchpadUtils';
import { ModalService } from './ModalService';

/**
 * Closes the modal via Modal service.
 *
 * @param {*} navigationObj
 * @param {*} forceSkipNavigation Optional, This key should only be used if you're handling navigation after closing the modal,
 * on your own. Unnecessary use of this key can obstruct the usual navigation flow.
 */
function handleClose (navigationObj, { forceSkipNavigation = false } = {}) {

  if (isEmbeddedScratchpad()) {
    ScratchpadService.triggerOverlayInOuterView(false);
  }

  ModalService.closeModal(navigationObj, { forceSkipNavigation });
}

@observer
export class BuildV2ModalWrapper extends Component {
  render () {

    if (!ModalService.activeModal) {
      return null;
    }

    if (isEmbeddedScratchpad()) {
      ScratchpadService.triggerOverlayInOuterView(true);
    }

    return (
      <ModalService.activeModal.view
        isOpen
        controller={ModalService.activeController}
        close={handleClose}
      />
    );
  }
}
