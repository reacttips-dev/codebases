import { ApolloError, makeVar } from '@apollo/client';

export interface CapMappingState {
	loading: boolean;
	error?: ApolloError | boolean;
}

export const capMappingState = makeVar<CapMappingState>({
	loading: true,
	error: false,
});
