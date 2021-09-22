/**
 * Reexport of gql tag for usage with DiscoveryCollections GraphQL endpoint.
 *
 * The only reason for the existence of this file is to allow graphql-tag to be imported multiple types in one component.
 * Otherwise ESLint starts complaining about duplicate imports.
 */
import gql from 'graphql-tag';

export default gql;
