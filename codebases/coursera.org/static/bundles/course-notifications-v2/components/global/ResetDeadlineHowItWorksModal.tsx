import React from 'react';
import Modal from 'bundles/phoenix/components/Modal';
import { Box } from '@coursera/coursera-ui';

import _t from 'i18n!nls/interactive-transcript';

import 'css!./__styles__/ResetDeadlineHowItWorksModal';

type Props = {
  closeModalHandler: () => void;
};

class ResetDeadlineHowItWorksModal extends React.Component<Props> {
  render() {
    const { closeModalHandler } = this.props;
    return (
      <Modal
        className="rc-ResetDeadlineHowItWorksModal"
        modalName={_t('How It Works')}
        trackingName="reset_deadline_how_it_works_modal"
        handleClose={closeModalHandler}
      >
        <Box className="content">
          <h2 className="title">{_t('How it works')}</h2>
          <Box flexDirection="column">
            <div className="item">
              <p className="item-question">{_t('Why am I seeing this?')}</p>
              <p>
                {_t(
                  'When you missed 2 deadlines in a row or miss a deadline by 2 weeks, you will be given the option to reset your deadlines.'
                )}
              </p>
            </div>
            <div className="item">
              <p className="item-question">{_t('What does it do?')}</p>
              <p>
                {_t('Resetting your deadlines unlocks all locked assignments and gives them new submission deadlines.')}
              </p>
            </div>
            <div className="item">
              <p className="item-question">{_t('Will my progress be saved?')}</p>
              <p>{_t('Yes. All assignment progress and video notes will be saved when you reset deadlines.')}</p>
            </div>
            <div className="item">
              <p className="item-question">{_t('How many times can I reset my deadlines?')}</p>
              <p className="last-line">{_t('As many times as you need.')}</p>
            </div>
          </Box>
        </Box>
      </Modal>
    );
  }
}

export default ResetDeadlineHowItWorksModal;
