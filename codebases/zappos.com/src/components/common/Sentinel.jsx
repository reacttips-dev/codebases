import React, { useEffect } from 'react';
import propTypes from 'prop-types';

import IntersectionObserver from 'components/common/IntersectionObserver';

const Sentinel = ({ callback, children, ...rest }) => {
  const SentinelCallback = ({ callback }) => {
    useEffect(callback);
    return null;
  };
  return (
    <IntersectionObserver placeholder={children} {...rest}>
      {children}
      <SentinelCallback callback={callback} />
    </IntersectionObserver>
  );
};

Sentinel.propTypes = {
  callback: propTypes.func.isRequired
};

export default Sentinel;
