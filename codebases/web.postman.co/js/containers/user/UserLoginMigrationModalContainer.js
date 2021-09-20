import React, { Component } from 'react';
import { Modal, ModalHeader, ModalContent } from '../../components/base/Modals';
import { SHELL_RELOAD } from '../../shell/shellActions';
import ShellHelper from '../../utils/ShellHelper';

export default class UserLoginMigrationModalContainer extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      message: 'Setting up your workspaces…'
    };
  }

  UNSAFE_componentWillMount () {
    this.unsubscribe = pm.eventBus.channel('user-login').subscribe((event) => {
      if (!event) {
        return;
      }

      if (event.namespace !== 'userlogin') {
        return;
      }

      // post login migration is happening
      if (event.name === 'migrationstep') {
        this.setState({
          isOpen: true
        });
      }

      // post login migration is complete
      else if (event.name === 'migrationcomplete') {
        // NOTE: window.location.reload doesn't work for the webview in the electron app
        // Hence sending an event to the shell to reload itself
        ShellHelper.sendToShell(SHELL_RELOAD);
      }
    });
  }

  componentWillUnmount () {
    this.unsubscribe && this.unsubscribe();
  }

  render () {
    return (
      <Modal
        isOpen={this.state.isOpen}
        className='user-login-migration-modal'
      >
        <ModalHeader>WAIT A MOMENT</ModalHeader>
        <ModalContent>
          <div className='user-login-migration-modal-message'>
            {this.state.message}
          </div>
        </ModalContent>
      </Modal>
    );
  }
}
