import { Button, Modal } from '@udacity/veritas-components';

import React from 'react';
import { __ } from 'services/localization-service';
import styles from './modal-gpu-welcome.scss';

const TOPICS = [
  {
    icon: 'welcome-computer-icon',
    heading: __('Utilize a GPU'),
    text: __(
      'Your files will be moved to another virtual machine with a GPU installed'
    ),
  },
  {
    icon: 'welcome-clock-icon',
    heading: __('Limited Time'),
    text: __(
      'Time is limited and shared across all Workspaces in all your Nanodegree Programs'
    ),
  },
  {
    icon: 'welcome-replenish-icon',
    heading: __('Need More Time?'),
    text: __(
      'Please manage your time carefully, but if needed you may contact support to ask for more time'
    ),
  },
];

@cssModule(styles)
export default class WelcomeGPUModal extends React.Component {
  _renderExplanation() {
    return (
      <section styleName="explanation">
        {TOPICS.map((topic) => {
          return (
            <div key={topic.heading} styleName="explanation--topic">
              <div styleName="topic--symbol">
                <span styleName="topic--icon-container">
                  <span styleName={topic.icon} />
                </span>
              </div>
              <div styleName="topic--heading">{topic.heading}</div>
              <div styleName="topic--text">{topic.text}</div>
            </div>
          );
        })}
      </section>
    );
  }

  render() {
    const { isOpen, close } = this.props;
    const title = __('Welcome to GPU Mode');

    return (
      <Modal
        open={isOpen}
        label={__('GPU Enabled Workspace')}
        closeLabel={__('Close Modal')}
      >
        <div styleName="modal-container">
          <section styleName="modal--title">{title}</section>
          {this._renderExplanation()}
          <div styleName="modal--options">
            <Button
              styleName="option"
              variant="primary"
              onClick={() => {
                close();
              }}
              label={__('CONTINUE')}
            />
          </div>
        </div>
      </Modal>
    );
  }
}
