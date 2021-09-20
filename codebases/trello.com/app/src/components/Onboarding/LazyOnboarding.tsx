/* eslint-disable @trello/export-matches-filename */
import React, { Suspense } from 'react';
import { useLazyComponent } from '@trello/use-lazy-component';
import type {
  SpotlightTarget,
  Spotlight,
  SpotlightManager,
  SpotlightTransition,
} from '@trello/nachos/onboarding-experimental';

export const LazySpotlightManager = (props: SpotlightManager['props']) => {
  const SpotlightManager = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "spotlight-manager" */ '@trello/nachos/onboarding-experimental'
      ),
    { namedImport: 'SpotlightManager' },
  );

  return (
    <Suspense fallback={null}>
      <SpotlightManager {...props} />
    </Suspense>
  );
};

/*
  The Spotlight type accesed by Spotlight['props'] suggests that
  'pulse' and 'dialogWidth' are required props. This is because the 
  class provides default values for those props. Consumers do not need
  to pass values in.
*/
interface SpotlightProps
  extends Omit<Spotlight['props'], 'pulse' | 'dialogWidth'>,
    Partial<Pick<Spotlight['props'], 'pulse' | 'dialogWidth'>> {}

export const LazySpotlight = (props: SpotlightProps) => {
  const Spotlight = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "spotlight" */ '@trello/nachos/onboarding-experimental'
      ),
    { namedImport: 'Spotlight' },
  );

  return (
    <Suspense fallback={null}>
      <Spotlight {...props} />
    </Suspense>
  );
};

export const LazySpotlightTarget = (props: SpotlightTarget['props']) => {
  const SpotlightTarget = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "spotlight-target" */ '@trello/nachos/onboarding-experimental'
      ),
    { namedImport: 'SpotlightTarget' },
  );

  return (
    <Suspense fallback={null}>
      <SpotlightTarget {...props} />
    </Suspense>
  );
};

export const LazySpotlightTransition = (
  props: SpotlightTransition['props'],
) => {
  const SpotlightTransition = useLazyComponent(
    () =>
      import(
        /* webpackChunkName: "spotlight-transition" */ '@trello/nachos/onboarding-experimental'
      ),
    { namedImport: 'SpotlightTransition' },
  );

  return (
    <Suspense fallback={null}>
      <SpotlightTransition {...props} />
    </Suspense>
  );
};
