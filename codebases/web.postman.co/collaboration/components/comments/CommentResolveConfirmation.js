import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import DeleteConfirmationModal from '../../../js/components/collections/DeleteConfirmationModal';
import Icon from '../../../js/components/base/Icons/designSystemIcons/Icon';

@pureRender
export default class CommentResolveConfirmation extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      isDisabled: false,
      isResolving: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleResolve = this.handleResolve.bind(this);
    this.getMessage = this.getMessage.bind(this);
}

  componentWillMount () {
    pm.mediator.on('showResolveCommentThreadModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showResolveCommentThreadModal', this.handleOpen);
  }

  handleOpen (resolveHandler) {
    this.setState({ isOpen: true });

    this.resolveHandler = resolveHandler;
  }

  handleResolve () {
    this.setState({
      isDisabled: true,
      isResolving: true
    }, () => {
      this.resolveHandler()
        .then(() => {
          this.handleClose();
        })
        .catch((err) => {
          pm.logger.error('CommentResolveConfirmation~handleResolve: Failed to resolve the thread', err);
          this.setState({
            isDisabled: false,
            isResolving: false
          });
      });
    });
  }

  handleClose () {
    this.setState({
      isOpen: false,
      isDisabled: false,
      isResolving: false
    });
  }

  getMessage () {
    return (
      <span>
        You cannot unresolve a comment, but you can view them by using the filter.
      </span>
    );
  }

  render () {
    return (
      <DeleteConfirmationModal
        customOverlayStyles={{ zIndex: 120 }}
        isDisabled={this.state.isDisabled}
        isOpen={this.state.isOpen}
        className='resolve-thread-confirmation-modal'
        title='RESOLVE COMMENTS'
        primaryAction={'Resolve'}
        isDeleting={this.state.isResolving}
        message={this.getMessage()}
        keymapRef={(ref) => { this.keymapRef = ref; }}
        onConfirm={this.handleResolve}
        onRequestClose={this.handleClose}
      />);
  }

}

