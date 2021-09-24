import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Notice, {LEFT, InfoIcon} from '../../../../shared/library/notices/notice';
import {DRAFT} from '../../../../shared/library/notices/notice';
import GhostButton from '../../../../shared/library/buttons/base/ghost';

const NoticeContainer = glamorous.div({
  marginTop: 10
});

const NoticeTitleWrapper = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%'
});

const StyledGhostButton = glamorous(GhostButton)({
  minWidth: 125
});

const NoticeTitle = glamorous.div({
  marginRight: 10
});

const DraftNotice = ({onToggleEditMode}) => {
  return (
    <NoticeContainer>
      <Notice
        align={LEFT}
        theme={DRAFT}
        fullWidth={true}
        title={
          <NoticeTitleWrapper>
            <NoticeTitle>Currently only visible to you. Please add more detail!</NoticeTitle>
            <StyledGhostButton onClick={onToggleEditMode}>Edit Post</StyledGhostButton>
          </NoticeTitleWrapper>
        }
        icon={<InfoIcon />}
      />
    </NoticeContainer>
  );
};

DraftNotice.propTypes = {
  onToggleEditMode: PropTypes.func
};

export default DraftNotice;
