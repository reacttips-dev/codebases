import React from 'react';
import localStorage from 'js/lib/coursera.store';
import Modal from 'bundles/phoenix/components/Modal';
// @ts-ignore ts-migrate(7016) FIXME: Could not find a declaration file for module 'bund... Remove this comment to see the full error message
import TopLevelModal from 'bundles/phoenix/components/TopLevelModal';
import _t from 'i18n!nls/ondemand';
import 'css!./__styles__/HonorCodeModal';

type Props = {
  overrideLocalStorage?: boolean;
  handleClose?: () => void;
};

type State = {
  clickedContinue: boolean;
};

class HonorCodeModal extends React.Component<Props, State> {
  state = {
    clickedContinue: false,
  };

  handleClose = () => {
    const { handleClose } = this.props;

    this.setState({
      clickedContinue: true,
    });
    localStorage.set('hasSeenHonorCodeModal', true);

    if (handleClose) {
      handleClose();
    }
  };

  render() {
    const { overrideLocalStorage } = this.props;
    const { clickedContinue } = this.state;

    if (!overrideLocalStorage && (localStorage.get('hasSeenHonorCodeModal') || clickedContinue)) {
      return null;
    }

    const modalName = _t('Coursera Honor Code');
    const honorCodeLink = 'https://learner.coursera.help/hc/articles/209818863';

    return (
      <TopLevelModal>
        <Modal
          className="rc-HonorCodeModal"
          handleClose={this.handleClose}
          modalName={modalName}
          shouldFocusOnXButton={true}
        >
          <h2 className="head-2-text">{modalName}</h2>
          <p>{_t('We’re dedicated to protecting the integrity of your work on Coursera.')}</p>
          <p>
            {_t('As part of this effort, we’ve created an honor code that we ask everyone to follow.')}
            &nbsp;
            <a
              href={honorCodeLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={_t('Learn more about the Coursera Honor Code')}
            >
              {_t('Learn more')}
            </a>
          </p>
          <p>{_t('All learners should:')}</p>
          <ul>
            <li>{_t('Submit their own original work')}</li>
            <li>{_t('Avoid sharing answers with others')}</li>
            <li>{_t('Report suspected violations')}</li>
          </ul>
          <div className="align-right">
            <button type="button" className="continue-button primary" onClick={this.handleClose}>
              {_t('Continue')}
            </button>
          </div>
        </Modal>
      </TopLevelModal>
    );
  }
}

export default HonorCodeModal;
