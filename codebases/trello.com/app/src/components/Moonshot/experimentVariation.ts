import { ExperimentVariations } from './types';
import { featureFlagClient } from '@trello/feature-flag-client';

export const experimentVariation: (
  featureFlag: string,
) => ExperimentVariations = (featureFlag) =>
  featureFlagClient.getTrackedVariation(
    featureFlag,
    ExperimentVariations.NOT_ENROLLED,
  ) as ExperimentVariations;

export const isMoonshotRedesign = () =>
  experimentVariation('tofu.simplified-moonshot') ===
  ExperimentVariations.EXPERIMENT;

export const isCompletelyFreeTrial = () =>
  experimentVariation('tofu.no-cc-free-trial') ===
  ExperimentVariations.EXPERIMENT;
