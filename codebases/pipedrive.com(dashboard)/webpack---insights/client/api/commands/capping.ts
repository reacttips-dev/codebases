import { CapMappingEndpointReturn } from '../../shared/featureCapping/cappingUtils';
import { CappingEndpointReturn } from '../../types/feature-capping';
import {
	CappingApiClient,
	GET_FEATURE_CAPPING,
	GET_CAP_MAPPING,
} from '../featureCapping.ts';

export const getCappings = (): CappingEndpointReturn => {
	try {
		const cache = CappingApiClient.readQuery({
			query: GET_FEATURE_CAPPING,
		});

		return cache.capping;
	} catch (error) {
		return { cap: 0, usage: 0 };
	}
};

export const getCapMapping = (): Partial<CapMappingEndpointReturn> => {
	try {
		const cache = CappingApiClient.readQuery({
			query: GET_CAP_MAPPING,
		});

		return cache.capMapping;
	} catch (error) {
		return {};
	}
};
