import React, { useMemo, useCallback } from 'react';
import useObservable from '../hooks/useObservable';
import useApplication from '../hooks/useApplication';
import FullScreenSparkles from './FullScreenSparkles';

export default function FullScreenSparklesWrapper() {
  const application = useApplication();
  const prettierParseError = useObservable(application.notifyPrettierParseError);
  const sparkleEffectVisible = useObservable(application.fullScreenSparkleEffectVisible);
  const userPrefersReducedMotion = useMemo(() => (window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false), []);

  const onAnimationComplete = useCallback(() => application.fullScreenSparkleEffectVisible(false), [application]);

  if (!sparkleEffectVisible || userPrefersReducedMotion || prettierParseError) {
    return null;
  }

  return <FullScreenSparkles onAnimationComplete={onAnimationComplete} />;
}
