import React, {useState, useEffect} from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import {withLocalStorage} from '../../../shared/enhancers/local-storage-enhancer';
import Notice, {BAR, InfoIcon} from '../../../shared/library/notices/notice';
const NOTICE_SEEN = 'noticeSeen';

const Container = glamorous.div();
const NoticeTitle = glamorous.div({
  width: '80%'
});

const JobsNotice = ({storageProvider}) => {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    if (!storageProvider.getBoolean(NOTICE_SEEN)) {
      setShowNotice(true);
    }
  }, []);

  const handleDismissNotice = () => {
    setShowNotice(false);
    storageProvider.setItem(NOTICE_SEEN, true);
  };

  return (
    <Container>
      {showNotice && (
        <Notice
          theme={BAR}
          fullWidth={true}
          icon={<InfoIcon />}
          onDismiss={() => handleDismissNotice()}
          title={
            <NoticeTitle>
              👆 Add tools to find more relevant jobs. We&#39;re currently showing you jobs sorted
              by the ones closest to your IP address.
            </NoticeTitle>
          }
        />
      )}
    </Container>
  );
};

JobsNotice.propTypes = {
  storageProvider: PropTypes.object
};

export default withLocalStorage('JobsNotice', '1')(JobsNotice);
