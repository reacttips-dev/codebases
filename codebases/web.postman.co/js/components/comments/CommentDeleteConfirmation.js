import React, { Component } from 'react';
import pureRender from 'pure-render-decorator';
import DeleteConfirmationModal from '../../components/collections/DeleteConfirmationModal';

@pureRender
export default class CommentDeleteConfirmation extends Component {
  constructor (props) {
    super(props);

    this.state = {
      isOpen: false,
      isDisabled: false,
      isDeleting: false
    };

    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  UNSAFE_componentWillMount () {
    pm.mediator.on('showDeleteCommentModal', this.handleOpen);
  }

  componentWillUnmount () {
    pm.mediator.off('showDeleteCommentModal', this.handleOpen);
  }

  handleOpen (deleteFun) {
    this.setState({ isOpen: true });

    this.deleteFun = deleteFun;
  }

  handleDelete () {
    this.setState({
      isDisabled: true,
      isDeleting: true
    }, () => {
      this.deleteFun()
        .then(() => {
          this.handleClose();
        })
        .catch(() => {
          pm.logger.warn('Failed to delete the comment');
          this.setState({
            isDisabled: false,
            isDeleting: false
          });
      });
    });
  }

  handleClose () {
    this.setState({
      isOpen: false,
      isDisabled: false,
      isDeleting: false
    });
  }

  render () {
    return (
      <DeleteConfirmationModal
        customOverlayStyles={{ zIndex: 120 }}
        isDisabled={this.state.isDisabled}
        isOpen={this.state.isOpen}
        className='delete-collection-confirmation-modal'
        title='DELETE COMMENT'
        isDeleting={this.state.isDeleting}
        message={'Are you sure you want to delete this comment? This cannot be undone.'}
        keymapRef={(ref) => { this.keymapRef = ref; }}
        onConfirm={this.handleDelete}
        onRequestClose={this.handleClose}
      />);
  }
}
