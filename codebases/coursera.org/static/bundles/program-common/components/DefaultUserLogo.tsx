import React from 'react';
import user from 'js/lib/user';

import 'css!bundles/program-common/components/__styles__/DefaultUserLogo';

type Props = {
  size?: number;
};

const DefaultUserLogo = ({ size = 32 }: Props) => {
  let lastInitial;
  const currentUser = user.get();
  const fullNameArray = currentUser.fullName.split(' ');

  const [[firstInitial]] = fullNameArray;

  if (fullNameArray.length > 1) {
    [lastInitial] = fullNameArray[fullNameArray.length - 1];
  }

  return (
    <div className="rc-DefaultUserLogo" style={{ width: `${size}px`, height: `${size}px` }}>
      {firstInitial && <span>{firstInitial}</span>}
      {lastInitial && <span>{lastInitial}</span>}
    </div>
  );
};

export default DefaultUserLogo;
