import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/discussions';
import { pinThread, unpinThread } from 'bundles/discussions/actions/ThreadSettingsActions';
import connectToStores from 'vendor/cnpm/fluxible.v0-4/addons/connectToStores';

class PinThreadButton extends React.Component {
  static propTypes = {
    questionId: PropTypes.string,
    forumType: PropTypes.string,
    isPinned: PropTypes.bool,
    isError: PropTypes.bool,
  };

  static contextTypes = {
    executeAction: PropTypes.func.isRequired,
  };

  toggleClosed = () => {
    if (!this.props.isPinned) {
      this.context.executeAction(pinThread, {
        questionId: this.props.questionId,
        forumType: this.props.forumType,
      });
    } else {
      this.context.executeAction(unpinThread, {
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
      <button className="nostyle rc-PinThreadButton" onClick={this.toggleClosed}>
        {this.props.isPinned ? _t('Undo Pin') : _t('Pin')}
        {this.renderErrorState()}
      </button>
    );
  }
}

export default connectToStores(PinThreadButton, ['ThreadSettingsStore'], ({ ThreadSettingsStore }) => {
  return {
    questionId: ThreadSettingsStore.getQuestionId(),
    forumType: ThreadSettingsStore.getForumType(),
    isPinned: ThreadSettingsStore.isPinned(),
    isError: ThreadSettingsStore.isError(),
  };
});
