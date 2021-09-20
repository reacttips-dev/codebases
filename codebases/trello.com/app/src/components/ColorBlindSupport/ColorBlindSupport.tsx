import { useEffect, useState, useCallback } from 'react';
import { memberId } from '@trello/session-cookie';
import { ModelCache } from 'app/scripts/db/model-cache';
import type { Member } from 'app/scripts/models/member';

const useColorBlind = () => {
  const [colorBlindState, setColorBlindState] = useState<boolean>(false);
  const prefsChangeEvent = 'change:prefs';

  const updateColorBlindState = useCallback(
    (model) => {
      const prefs = model.get('prefs');
      const colorBlind = !!(prefs && prefs.colorBlind);

      setColorBlindState(colorBlind);
    },
    [setColorBlindState],
  );

  useEffect(() => {
    let cancelled = false;
    let model: Member;

    // Wait for the member to be loaded, update based on current color-blind
    // pref and subscribe to changes
    ModelCache.waitFor('Member', memberId, (_, m) => {
      if (m && !cancelled) {
        model = m;
        updateColorBlindState(model);
        model.on(prefsChangeEvent, updateColorBlindState);
      }
    });

    return () => {
      cancelled = true;

      if (model) {
        model.off(prefsChangeEvent, updateColorBlindState);
      }
    };
  }, [updateColorBlindState]);

  return colorBlindState;
};

const useColorBlindDOMMutations = (isColorBlind: boolean) => {
  const colorBlindEnabledClass = 'body-color-blind-mode-enabled';
  const newColorBlindPatternsClass = 'body-new-color-blind-mode-patterns';

  useEffect((): void => {
    const trelloRoot = document.getElementById('trello-root')!;

    if (!trelloRoot) {
      return;
    }

    if (isColorBlind) {
      trelloRoot.classList.add(colorBlindEnabledClass);
      trelloRoot.classList.add(newColorBlindPatternsClass);
    } else {
      trelloRoot.classList.remove(colorBlindEnabledClass);
      trelloRoot.classList.remove(newColorBlindPatternsClass);
    }
  }, [isColorBlind]);

  return null;
};

export const ColorBlindSupport = () => {
  const isColorBlind = useColorBlind();
  useColorBlindDOMMutations(isColorBlind);

  return null;
};
