import { useContext } from 'react';
import { invariant, warning } from '@adeira/js';
import { WebappApiContext } from 'Components/WebappApiContext';

// const __DEV__ = process.env.NODE_ENV === 'development';

const HardcodedFeatureFlags = {
	ENABLE_EDITABLE_COLUMNS: false, // feature development postponed
};

const APIFeatureFlags = {
	// Put feature flags keys here, example:
	// leadsFeatureFlag: 'leads_feature_flag'
	LEADS_EXPORT: 'leads_export',
	PROSPECTOR_OPTIMIZED_FLOWS: 'prospector_optimized_flows',
	LEADS_FILTERING_BY_TEAMS: 'leads_filtering_by_teams',
	TEAMS: 'teams',
};

type WebappResponse = boolean | undefined; // Can it return something else? 🤔

/**
 * Usage (after registering it here):
 *
 * ```
 * const [FEATURE_FLAG] = useFeatureFlags(['FEATURE_FLAG']);
 * ```
 */
export function useFeatureFlags(
	featureFlagNames: ReadonlyArray<keyof typeof HardcodedFeatureFlags | keyof typeof APIFeatureFlags>,
): ReadonlyArray<boolean> {
	invariant(featureFlagNames?.length > 0, 'You have to request at least one feature flag.');

	const { userSelf } = useContext(WebappApiContext);
	const response = [];

	for (const featureFlagName of featureFlagNames) {
		let value = false;
		if (featureFlagName in HardcodedFeatureFlags) {
			value = HardcodedFeatureFlags[featureFlagName as keyof typeof HardcodedFeatureFlags];
		} else if (featureFlagName in APIFeatureFlags) {
			const webappResponse = userSelf.companyFeatures.get(
				APIFeatureFlags[featureFlagName as keyof typeof APIFeatureFlags],
			) as WebappResponse;
			warning(
				webappResponse != null,
				"Webapp API returned unexpected value for feature flag '%s'. Is it defined? Defaulting to false.",
				featureFlagName,
			);
			value = webappResponse ?? false;
		} else {
			warning(false, "Requested feature flag '%s' was not defined, defaulting to false.", featureFlagName);
		}
		response.push(value);
	}

	warning(
		featureFlagNames.length === response.length,
		'Number of requested feature flags (%s) and returned feature flags (%s) has to match.',
		featureFlagNames.length,
		response.length,
	);

	return response;
}
