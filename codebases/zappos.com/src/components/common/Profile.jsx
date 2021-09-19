import React, { Profiler } from 'react';

import { devLogger } from 'middleware/logger';

const Profile = props => {
  const { children, ...rest } = props;

  // Only allow profiling for non prod builds
  if (process.env.NODE_ENV === 'production') {
    return children;
  }

  const profileHandler = (id, phase, actualDuration) => {
    if (actualDuration > 100) {
      devLogger(`[Profiler] It took ${id} ${actualDuration} to ${phase}`);
    }
  };

  return <Profiler {...rest} onRender={profileHandler}>{children}</Profiler>;
};

export default Profile;
