/**
 * Survey redirection modal.
 */
import React from 'react';

import Modal from 'bundles/phoenix/components/Modal';
import _t from 'i18n!nls/content-feedback';
import { Button, Box } from '@coursera/coursera-ui';
import 'css!./__styles__/CourseSurveyModal';

type Props = {
  shouldTakeSurvey?: boolean;
  onContinue: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onClose: () => void;
};

class CourseSurveyModal extends React.Component<Props> {
  continueButton: HTMLButtonElement | null = null;

  componentDidMount() {
    if (this.continueButton) {
      this.continueButton.focus();
    }
  }

  /* eslint-disable no-return-assign */
  continueButtonRef = (el: HTMLButtonElement) => (this.continueButton = el);

  render() {
    const { onClose, onContinue, shouldTakeSurvey = true } = this.props;

    let modalContents;
    if (!shouldTakeSurvey) {
      modalContents = (
        <Box flexDirection="column" alignItems="center" justifyContent="center" rootClassName="message">
          <p className="large-text">{_t('Thank you!')}</p>
        </Box>
      );
    } else {
      modalContents = [
        <Box flexDirection="column" alignItems="center" justifyContent="center" rootClassName="message">
          <p className="large-text">{_t('Thank you!')}</p>
          <p className="main-text">
            {_t('Please also give feedback to Coursera and the instructor in a 2-minute survey')}
          </p>
        </Box>,

        <Box justifyContent="between" rootClassName="footer-container">
          <Button
            type="noStyle"
            label={_t('No thanks')}
            onClick={onClose}
            htmlAttributes={{ title: _t('Close Survey Modal') }}
          />
          <Button
            type="primary"
            label={_t('Continue')}
            onClick={onContinue}
            _refAlt={this.continueButtonRef}
            htmlAttributes={{ title: _t('Take Survey') }}
          />
        </Box>,
      ];
    }

    return (
      <Modal className="rc-CourseSurveyModal" modalName={_t('Rate this course')} handleClose={onClose}>
        {modalContents}
      </Modal>
    );
  }
}

export default CourseSurveyModal;
