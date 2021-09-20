import { useEffect, useMemo, useState } from 'react';

import { SharedState } from './SharedState';

type SetValue<Value> = SharedState<Value>['setValue'];

export function useSharedState<Value>(
  state: SharedState<Value>,
): [Value, SetValue<Value>] {
  const [value, setValue] = useState(state.value);
  const previousValue = useMemo(() => state.value, [state]);

  useEffect(() => {
    const unsubscribe = state.subscribe(setValue);

    if (previousValue !== state.value) {
      setValue(state.value);
    }

    return unsubscribe;
  }, [previousValue, state, setValue]);

  const boundSetValue = useMemo<SetValue<Value>>(
    () => state.setValue.bind(state),
    [state],
  );

  return [value, boundSetValue];
}
