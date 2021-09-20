import { NetworkError } from './network-error';
import { ApolloError, isApolloError } from '@apollo/client';

interface ApolloGraphQLNetworkError extends ApolloError {
  networkError: NetworkError;
}

const isApolloGraphQLNetworkError = (
  error: Error | ApolloError,
): error is ApolloGraphQLNetworkError =>
  isApolloError(error) &&
  (error?.networkError as NetworkError)?.code !== undefined &&
  (error?.networkError as NetworkError)?.message !== undefined &&
  (error?.networkError as NetworkError)?.status !== undefined;

export const getNetworkError = (error: ApolloError): NetworkError | null => {
  if (isApolloGraphQLNetworkError(error)) {
    const { code, message, status } = error.networkError;
    return new NetworkError(message, { code, status });
  }
  return null;
};
