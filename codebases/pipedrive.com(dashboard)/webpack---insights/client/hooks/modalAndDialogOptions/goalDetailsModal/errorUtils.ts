import { ApolloError, ServerError } from '@apollo/client';

export const isDuplicateGoalError = (error: ApolloError) =>
	(error?.networkError as ServerError)?.result?.statusCode === 49;

export const getDuplicateGoal = (error: ApolloError) =>
	(error?.networkError as ServerError)?.result?.data;
