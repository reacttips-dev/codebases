import { ApolloError, makeVar } from '@apollo/client';

export interface CappingState {
	loading: boolean;
	error?: ApolloError | boolean;
}

export const cappingState = makeVar<CappingState>({
	loading: true,
	error: false,
});

export const getCappingState = () => {
	return cappingState();
};

export const setCappingState = (newValue: CappingState) => {
	return cappingState(newValue);
};
