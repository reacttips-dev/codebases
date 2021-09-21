import { FeatureFlag } from '../../../FeatureFlags';

type FetchAllEnabledFeatureFlagsResponse = {
  allEnabledFlags: [
    {
      name: FeatureFlag;
    }
  ];
};

export async function fetchAllEnabledFeatureFlags(
  userId: number | null
): Promise<FetchAllEnabledFeatureFlagsResponse> {
  try {
    const response = await fetch(
      `/api/proxy/v3/featureFlag/enabled?${userId}`,
      {
        method: 'GET',
        credentials: 'same-origin',
      }
    );
    if (response.ok) {
      return response.json();
    }
    throw new Error('Could not fetch feature flags');
  } catch (err) {
    throw new Error(err.message);
  }
}
