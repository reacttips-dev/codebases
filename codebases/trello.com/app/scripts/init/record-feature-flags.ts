import { TrelloStorage } from '@trello/storage';
import { featureFlagClient, FlagSet } from '@trello/feature-flag-client';

const FEATURE_FLAGS_KEY = 'featureFlagSnapshot';

// Exclude entries with false values from the recorded
// flags
function filterFlags(flags: FlagSet): Partial<FlagSet> {
  return Object.entries(flags)
    .filter(([key, value]) => value)
    .reduce((combined: FlagSet, [key, value]) => {
      combined[key] = value;

      return combined;
    }, {});
}

function writeFlagsToLocalStorage() {
  const { remote, overrides } = featureFlagClient.all();

  TrelloStorage.set(FEATURE_FLAGS_KEY, {
    remote: filterFlags(remote),
    overrides: filterFlags(overrides),
  });
}

export async function recordFeatureFlags() {
  // Wait for the initial load of feature flags and write to local storage
  await featureFlagClient.ready();
  writeFlagsToLocalStorage();

  featureFlagClient.atlassianClient.onAnyFlagUpdated(() => {
    writeFlagsToLocalStorage();
  });
}
