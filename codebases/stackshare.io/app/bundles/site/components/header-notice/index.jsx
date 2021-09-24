import React, {useState, useEffect} from 'react';
import {compose} from 'react-apollo';
import PropTypes from 'prop-types';
import {withLocalStorage} from '../../../../shared/enhancers/local-storage-enhancer';
import Notice from './notice';
import {withApolloContext} from '../../../../shared/enhancers/graphql-enhancer';
import {Loader} from '../../../../shared/library/loaders/loader';

export const HEADER_NOTICE_SEEN = 'headerNoticeSeen';

const Z_INDEX = 1000;

const HeaderNotice = ({mobile, storageProvider, setHeaderOffset}) => {
  const [showHeaderNotice, setShowHeaderNotice] = useState(false);

  const handleDismissNotice = () => {
    setShowHeaderNotice(false);
    if (typeof setHeaderOffset === 'function') {
      setHeaderOffset(0);
    }
    storageProvider.setItem(HEADER_NOTICE_SEEN, true);
  };

  useEffect(() => {
    if (!storageProvider.getBoolean(HEADER_NOTICE_SEEN)) {
      setShowHeaderNotice(true);
    }
  }, []);

  if (showHeaderNotice) {
    return <Notice onDismiss={handleDismissNotice} mobile={mobile} />;
  }
  return <Loader h={'auto'} animate={true} style={{zIndex: Z_INDEX}} />;
};

HeaderNotice.propTypes = {
  mobile: PropTypes.bool,
  storageProvider: PropTypes.object,
  setHeaderOffset: PropTypes.func
};

export default compose(
  withApolloContext,
  withLocalStorage('HeaderNotice', '3')
)(HeaderNotice);
