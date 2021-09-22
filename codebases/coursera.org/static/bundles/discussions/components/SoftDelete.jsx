import _t from 'i18n!nls/discussions';
import PropTypes from 'prop-types';
import React from 'react';
import { undoDelete } from 'bundles/discussions/actions/DropdownActions';
import 'css!./__styles__/SoftDelete';

class SoftDelete extends React.Component {
  static propTypes = {
    hideUndoDelete: PropTypes.bool,
    entry: PropTypes.object.isRequired,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  state = {
    showError: false,
  };

  handleUndoDelete = (e) => {
    e.preventDefault();
    this.context.executeAction(undoDelete, {
      post: this.props.entry,
      handleFailure: this.handleError,
      onSuccess: () => {},
    });
  };

  handleError = (error) => {
    this.setState({
      showError: true,
    });
  };

  render() {
    const error = (
      <div ref="error" className="c-soft-delete-error c-error-text">
        {_t('Error undoing delete, please reload the page and try again')}
      </div>
    );

    const { entry } = this.props;
    const deletedByCreator = entry.state.deleted && entry.state.deleted.userId === entry.creator.userId;
    const deletedByText = deletedByCreator
      ? _t('This post has been deleted by its creator')
      : _t('This post has been deleted by a moderator');

    const undoDeleteComponent = (
      <div className="c-soft-delete-header">
        <span ref="message">
          {deletedByText}
          &nbsp;·&nbsp;
        </span>
        <button ref="undoDelete" className="button-link" onClick={this.handleUndoDelete}>
          {_t('Undo Delete')}
        </button>
      </div>
    );

    let className = 'c-soft-delete';
    if (this.props.hideUndoDelete) {
      className += ' c-soft-delete-clickable';
    }

    return (
      <div className="rc-SoftDelete">
        <div className={className}>
          {!this.props.hideUndoDelete && !this.state.showError && undoDeleteComponent}
          {this.state.showError && error}
        </div>
      </div>
    );
  }
}

export default SoftDelete;
