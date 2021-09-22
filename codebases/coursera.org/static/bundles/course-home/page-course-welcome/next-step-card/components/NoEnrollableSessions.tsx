/* @jsx jsx */
import React, { useState } from 'react';
import { jsx, css } from '@emotion/react';
import _t from 'i18n!nls/course-home';

import Modal from 'bundles/phoenix/components/Modal';

import withSessionLabel, { SessionLabel } from 'bundles/course-sessions/utils/withSessionLabel';

type Props = {
  sessionLabel: SessionLabel;
};

export const NoEnrollableSessions: React.FC<Props> = ({ sessionLabel }) => {
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const toggleModal = () => setModalIsOpen(!modalIsOpen);

  if (!modalIsOpen) {
    return null;
  }

  const contentStyle = css({
    padding: '16px 0px',
  });

  const buttonStyle = css({
    position: 'absolute',
    bottom: '28px',
    right: '28px',
  });

  return (
    <Modal modalName="NoEnrollableSessionsModal" handleClose={toggleModal} className="rc-NoEnrollableSessions">
      <h3 className="title">
        {sessionLabel === 'session' ? _t('No sessions available') : _t('No schedules available')}
      </h3>
      <div css={contentStyle}>
        <p className="body-1-text">
          {sessionLabel === 'session'
            ? _t('Currently there are no upcoming sessions available at this time. Please check back again later.')
            : _t('Currently there are no upcoming schedules available at this time. Please check back again later.')}
        </p>
      </div>
      <div css={buttonStyle}>
        <button className="primary" type="button" onClick={toggleModal}>
          {_t('Close')}
        </button>
      </div>
    </Modal>
  );
};

export default withSessionLabel(NoEnrollableSessions);
