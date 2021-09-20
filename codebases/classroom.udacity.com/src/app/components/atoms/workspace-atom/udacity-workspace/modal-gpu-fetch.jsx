import { Button, Modal } from '@udacity/veritas-components';

import React from 'react';
import { __ } from 'services/localization-service';
import styles from './modal-gpu-fetch.scss';

@cssModule(styles)
export default class FetchGPUModal extends React.Component {
  render() {
    const { isOpen, close, fetchCPU, fetchGPU } = this.props;
    const title = __('Enable GPU Mode');
    const iconType = 'enable-gpu-icon';

    return (
      <Modal
        open={isOpen}
        label={__('GPU Enabled Workspace')}
        closeLabel={__('Close Modal')}
      >
        <div styleName="toggle-container">
          <div styleName="toggle--banner">
            <span styleName="banner--icon-container">
              <span styleName={iconType} />
            </span>
          </div>
          <section styleName="toggle--title">{title}</section>
          <section styleName="toggle--text">
            {__('Would you like to work with a GPU enabled workspace?')}
          </section>
          <div styleName="toggle--options">
            <Button
              styleName="option"
              variant="primary"
              onClick={() => {
                fetchGPU();
                close();
              }}
              label={__('Yes')}
            />
            <Button
              styleName="option"
              variant="secondary"
              onClick={() => {
                fetchCPU();
                close();
              }}
              label={__('No')}
            />
          </div>
        </div>
      </Modal>
    );
  }
}
