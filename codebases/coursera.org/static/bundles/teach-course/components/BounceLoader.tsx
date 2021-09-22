import React from 'react';

import 'css!./__styles__/BounceLoader';

const BounceLoader = () => {
  return (
    <div className="rc-BounceLoader">
      <div className="spinner">
        <div className="bounce1" />
        <div className="bounce2" />
        <div className="bounce3" />
      </div>
    </div>
  );
};

export default BounceLoader;
