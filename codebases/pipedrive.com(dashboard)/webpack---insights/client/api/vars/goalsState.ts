import { ApolloError, makeVar } from '@apollo/client';

export interface GoalsState {
	loading: boolean;
	error?: ApolloError | boolean;
}

export const goalsState = makeVar<GoalsState>({
	loading: true,
	error: false,
});

export const getGoalsState = () => {
	return goalsState();
};

export const setGoalsState = (newValue: GoalsState) => {
	return goalsState(newValue);
};
