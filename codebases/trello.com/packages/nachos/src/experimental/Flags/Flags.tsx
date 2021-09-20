import React from 'react';
import { useSharedState } from '@trello/shared-state';
import { flagsState } from './flagsState';
import { dismissFlag } from './showFlag';

import { AutoDismissFlag } from './AutoDismissFlag';
import { Flag } from './Flag';
import { FlagGroup } from './FlagGroup';

export const Flags: React.FunctionComponent = () => {
  const [flags] = useSharedState(flagsState);
  return (
    <FlagGroup onDismissed={dismissFlag}>
      {flags.map((flag) => {
        const { isAutoDismiss, ...restProps } = flag;
        const FlagType = isAutoDismiss ? AutoDismissFlag : Flag;
        return <FlagType key={flag.id} {...restProps} />;
      })}
    </FlagGroup>
  );
};
