import { action } from 'satcheljs';
import type FeatureOverride from '../store/schema/FeatureOverride';

const updateActiveFlights = action(
    'UPDATE_ACTIVE_FLIGHTS',
    (featureOverrides: FeatureOverride[]) => ({
        featureOverrides,
    })
);

export default updateActiveFlights;
