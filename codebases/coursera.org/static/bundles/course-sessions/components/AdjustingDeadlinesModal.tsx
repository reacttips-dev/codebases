import React from 'react';
import Modal from 'bundles/phoenix/components/Modal';
import { SvgLoaderSignal } from '@coursera/coursera-ui/svg';

import _t from 'i18n!nls/course-sessions';

import 'css!./__styles__/AdjustingDeadlinesModal';

type Props = {
  handleClose: () => void;
  isAdjustingSchedule: boolean;
  adjustScheduleError: boolean;
};

const AdjustingDeadlinesModal = (props: Props) => {
  const { isAdjustingSchedule, adjustScheduleError, handleClose } = props;

  return (
    <Modal
      className="rc-AdjustingDeadlinesModal"
      allowClose={!isAdjustingSchedule}
      handleClose={handleClose}
      modalName={_t('Adjusting Deadlines Modal')}
    >
      <div className="vertical-box align-items-absolute-center" style={{ height: '200px' }}>
        {adjustScheduleError && <span className="message">{_t('Something went wrong. Please try again.')}</span>}
        {isAdjustingSchedule && (
          <div className="vertical-box align-items-absolute-center">
            <SvgLoaderSignal />
            <span className="message">{_t('Resetting your deadlines')}</span>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default AdjustingDeadlinesModal;
