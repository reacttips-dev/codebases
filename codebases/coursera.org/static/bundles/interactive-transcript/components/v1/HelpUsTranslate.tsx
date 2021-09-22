import React from 'react';

import TrackedButton from 'bundles/page/components/TrackedButton';
import TranslationModal from 'bundles/interactive-transcript/components/v1/TranslationModal';

import _t from 'i18n!nls/interactive-transcript';

type Props = {
  courseId?: string;
};

type State = {
  showTranslationModal: boolean;
};

class HelpUsTranslate extends React.Component<Props, State> {
  state: State = {
    showTranslationModal: false,
  };

  openTranslationModal = () => {
    this.setState({ showTranslationModal: true });
  };

  closeTranslationModal = () => {
    this.setState({ showTranslationModal: false });
  };

  render() {
    const { courseId } = this.props;
    const { showTranslationModal } = this.state;

    return (
      <div className="rc-HelpUsTranslate">
        <TrackedButton
          onClick={this.openTranslationModal}
          trackingName="language_chooser_translation_link"
          className="button-link align-self-end translate-btn"
        >
          {_t('Help us translate!')}
        </TrackedButton>

        {showTranslationModal && (
          <TranslationModal
            courseId={courseId}
            onClose={this.closeTranslationModal}
            trackingName="language_chooser_translation_modal"
          />
        )}
      </div>
    );
  }
}

export default HelpUsTranslate;
