import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/discussions';
import CloseThreadButton from 'bundles/discussions/components/threadSettings/CloseThreadButton';
import PinThreadButton from 'bundles/discussions/components/threadSettings/PinThreadButton';
import MoveThreadModal from 'bundles/discussions/components/threadSettings/MoveThreadModal';
import Dropdown from 'bundles/phoenix/components/Dropdown';
import 'css!./__styles__/ThreadSettings';

class ThreadSettings extends React.Component {
  static propTypes = {
    question: PropTypes.object.isRequired,
    shouldShowMoveThread: PropTypes.bool,
  };

  state = {
    showMoveThreadModal: false,
  };

  openMoveThreadModal = () => {
    this.setState({
      showMoveThreadModal: true,
    });
  };

  closeMoveThreadModal = () => {
    this.setState({
      showMoveThreadModal: false,
    });
  };

  renderMoveThreadModal() {
    return <MoveThreadModal handleClose={this.closeMoveThreadModal} question={this.props.question} />;
  }

  renderNonItemEntries() {
    if (this.props.shouldShowMoveThread) {
      return (
        <button className="nostyle" onClick={this.openMoveThreadModal}>
          {_t('Move Thread')}
        </button>
      );
    }

    return null;
  }

  render() {
    const listItems = [<CloseThreadButton />, <PinThreadButton />, this.renderNonItemEntries()];

    return (
      <div className="rc-ThreadSettings">
        <Dropdown
          dropdownId="test"
          listItems={listItems}
          iconName="settings"
          iconClassName="color-secondary-text"
          label={_t('View dropdown options')}
        />
        {this.state.showMoveThreadModal && this.renderMoveThreadModal()}
      </div>
    );
  }
}

export default ThreadSettings;
