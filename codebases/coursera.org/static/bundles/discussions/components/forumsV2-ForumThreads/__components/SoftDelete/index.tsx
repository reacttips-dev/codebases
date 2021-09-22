/* @jsx jsx */
import { jsx, css } from '@emotion/react';
import { Button } from '@coursera/cds-core';
import _t from 'i18n!nls/discussions';
import PropTypes from 'prop-types';
import React from 'react';
import { undoDelete } from 'bundles/discussions/actions/DropdownActions';
import { ForumPostWithCreator } from '../../__providers__/ForumPostDataProvider/__types__';
import 'css!./__styles__/SoftDelete';

type Props = {
  showUndoDelete: boolean;
  entry: ForumPostWithCreator;
  isForQuestion: boolean;
};
class SoftDelete extends React.Component<Props> {
  static defaultProps = {
    isForQuestion: false,
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

    const { entry, isForQuestion, showUndoDelete } = this.props;
    const deletedByCreator = entry.state?.deleted && entry.state.deleted.userId === entry.creator?.userId;
    const deletedByText = deletedByCreator
      ? _t('This post has been deleted by its creator')
      : _t('This post has been deleted by a moderator');

    const undoDeleteComponentClasses = isForQuestion ? ' for-question' : '';
    const undoDeleteComponent = (
      <div className={'c-soft-delete-header' + undoDeleteComponentClasses}>
        <span ref="message">
          {deletedByText}
          &nbsp;·&nbsp;
        </span>
        <Button variant="ghost" type="button" onClick={this.handleUndoDelete}>
          {_t('Undo Delete')}
        </Button>
      </div>
    );

    let className = 'c-soft-delete';
    if (!showUndoDelete) {
      className += ' c-soft-delete-clickable';
    }

    return (
      <div className="rc-SoftDelete">
        <div className={className}>
          {showUndoDelete && !this.state.showError && undoDeleteComponent}
          {this.state.showError && error}
        </div>
      </div>
    );
  }
}

export default SoftDelete;
