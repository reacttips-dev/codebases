import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/discussions';
import { closeThread, uncloseThread } from 'bundles/discussions/actions/ThreadSettingsActions';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

class CloseThreadButton extends React.Component {
  static propTypes = {
    questionId: PropTypes.string,
    forumType: PropTypes.string,
    isClosed: PropTypes.bool,
    isError: PropTypes.bool,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  toggleClosed = () => {
    if (!this.props.isClosed) {
      this.context.executeAction(closeThread, {
        questionId: this.props.questionId,
        forumType: this.props.forumType,
      });
    } else {
      this.context.executeAction(uncloseThread, {
        questionId: this.props.questionId,
        forumType: this.props.forumType,
      });
    }
  };

  renderErrorState() {
    if (this.props.isError) {
      return <div className="errorMessage">{_t('Sorry, something went wrong. Try again.')}</div>;
    }

    return null;
  }

  render() {
    return (
      <button className="rc-CloseThreadButton nostyle" onClick={this.toggleClosed}>
        {this.props.isClosed ? _t('Undo Close') : _t('Close')}
        {this.renderErrorState()}
      </button>
    );
  }
}

export default connectToStores(CloseThreadButton, ['ThreadSettingsStore'], ({ ThreadSettingsStore }) => {
  return {
    questionId: ThreadSettingsStore.getQuestionId(),
    forumType: ThreadSettingsStore.getForumType(),
    isClosed: ThreadSettingsStore.isClosed(),
    isError: ThreadSettingsStore.isError(),
  };
});
