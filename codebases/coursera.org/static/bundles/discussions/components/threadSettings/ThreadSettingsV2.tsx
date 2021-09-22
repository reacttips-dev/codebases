import PropTypes from 'prop-types';
import React from 'react';
import _t from 'i18n!nls/discussions';
import CloseThreadButton from 'bundles/discussions/components/threadSettings/CloseThreadButton';
import PinThreadButton from 'bundles/discussions/components/threadSettings/PinThreadButton';
import MoveThreadModal from 'bundles/discussions/components/threadSettings/MoveThreadModal';
import Dropdown from 'bundles/phoenix/components/Dropdown';
import 'css!./__styles__/ThreadSettings';

type ThreadSettingsProps = {
  enableModeratorControls: Promise<boolean>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  question: any;
  shouldShowMoveThread: boolean;
};

class ThreadSettings extends React.Component<ThreadSettingsProps> {
  static propTypes = {
    question: PropTypes.object.isRequired,
    shouldShowMoveThread: PropTypes.bool,
  };

  state = {
    showMoveThreadModal: false,
    enableModeratorControls: false,
  };

  componentDidMount() {
    this.props.enableModeratorControls.then((isModerator) => {
      this.setState({ enableModeratorControls: isModerator });
    });
  }

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
        <button type="button" className="nostyle" onClick={this.openMoveThreadModal}>
          {_t('Move Thread')}
        </button>
      );
    }

    return null;
  }

  render() {
    const listItems = [<CloseThreadButton />, <PinThreadButton />, this.renderNonItemEntries()];

    if (!this.state.enableModeratorControls) {
      return null;
    }

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
