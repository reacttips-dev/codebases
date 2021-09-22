import { gql } from '@apollo/client';

export const CAPPING_PROPS_FRAGMENT = gql`
	fragment CappingProps on Capping {
		cap
		usage
	}
`;

export const GET_FEATURE_CAPPING = gql`
	query Capping($path: String!) {
		capping @rest(type: "Capping", path: $path) {
			...CappingProps
		}
	}
	${CAPPING_PROPS_FRAGMENT}
`;

export const CAP_MAPPING_PROPS_FRAGMENT = gql`
	fragment CapMappingProps on CapMapping {
		currentTier
		nextTier
		mapping
	}
`;

export const GET_CAP_MAPPING = gql`
	query CapMapping($path: String!) {
		capMapping @rest(type: "CapMapping", path: $path) {
			...CapMappingProps
		}
	}
	${CAP_MAPPING_PROPS_FRAGMENT}
`;
