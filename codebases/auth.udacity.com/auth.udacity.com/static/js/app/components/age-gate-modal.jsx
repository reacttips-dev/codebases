import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '@udacity/veritas-components';
import { __ } from '../../services/localization-service';
import styles from './age-gate-modal.module.scss';

export default class AgeGateModal extends Component {
  static propTypes = {
    onRequestClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired
  };

  render() {
    const { onRequestClose, isOpen } = this.props;

    return (
      <Modal
        label={__('Age Gate Modal')}
        onClose={onRequestClose}
        open={isOpen}
      >
        <div className={styles.description}>
          {__('Hello,')}
          <br />
          <br />
          {__(
            'Udacity is required to limit access to its content, programs and platform to those meeting the legal minimum age requirements for your region.'
          )}
          <br />
          <br />
          {__(
            'We will be unable to register you as a user on our site right now, but please check back once you reach the age requirements for your region.'
          )}
          <br />
          <br />
          {__(
            "For more details, please visit our <a href='<%= privacy_policy_link %>'><%= privacy_policy %></a>. ",
            {
              privacy_policy_link: __('https://www.udacity.com/legal/privacy'),
              privacy_policy: __('Privacy Policy')
            },
            { renderHTML: true }
          )}
          {__(
            "Please feel free to contact us at <a href='<%= support_link %>'><%= support_email %></a> if you feel you received this notice in error.",
            {
              support_link: __('mailto:support@udacity.com'),
              support_email: __('support@udacity.com')
            },
            { renderHTML: true }
          )}
        </div>
      </Modal>
    );
  }
}
