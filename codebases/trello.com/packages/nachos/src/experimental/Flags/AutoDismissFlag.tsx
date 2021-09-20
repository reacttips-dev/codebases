// Lifted directly from @atlaskit/flag.

import React, { useCallback, useEffect, useRef } from 'react';

import { AutoDismissFlagProps } from './types';

import { Flag } from './Flag';
import { useFlagGroup } from './FlagGroup';

const DEFAULT_MS_TIMEOUT = 8000; // 8 seconds

function noop() {}

export const AutoDismissFlag = (props: AutoDismissFlagProps) => {
  const { id, msTimeout } = props;
  const autoDismissTimer = useRef<number | null>(null);

  const { onDismissed = noop, dismissAllowed } = useFlagGroup();
  const isDismissAllowed = dismissAllowed(id);

  const isAutoDismissAllowed = isDismissAllowed && onDismissed;

  const dismissFlag = useCallback(() => {
    if (isAutoDismissAllowed) {
      onDismissed({ id, dismissedVia: 'auto' });
    }
  }, [id, isAutoDismissAllowed, onDismissed]);

  const stopAutoDismissTimer = useCallback(() => {
    if (autoDismissTimer.current) {
      clearTimeout(autoDismissTimer.current);
      autoDismissTimer.current = null;
    }
  }, []);

  const startAutoDismissTimer = useCallback(() => {
    if (!isAutoDismissAllowed) {
      return;
    }

    stopAutoDismissTimer();

    autoDismissTimer.current = window.setTimeout(
      dismissFlag,
      msTimeout ?? DEFAULT_MS_TIMEOUT,
    );
  }, [msTimeout, dismissFlag, isAutoDismissAllowed, stopAutoDismissTimer]);

  useEffect(() => {
    startAutoDismissTimer();
    return stopAutoDismissTimer;
  }, [startAutoDismissTimer, stopAutoDismissTimer]);

  return (
    <Flag
      {...props}
      onMouseOver={stopAutoDismissTimer}
      onFocus={stopAutoDismissTimer}
      onMouseOut={startAutoDismissTimer}
      onBlur={startAutoDismissTimer}
    />
  );
};
