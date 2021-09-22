//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type AllEnhancedLocationFieldsFragment = (
  { __typename?: 'EnhancedLocation' }
  & Pick<Types.EnhancedLocation, 'DisplayName' | 'Annotation' | 'Id' | 'IdType' | 'LocationType'>
  & { PostalAddress?: Types.Maybe<(
    { __typename?: 'PersonaPostalAddress' }
    & Pick<Types.PersonaPostalAddress, 'Street' | 'City' | 'State' | 'Country' | 'PostalCode' | 'PostOfficeBox' | 'Type' | 'Latitude' | 'Longitude' | 'Accuracy' | 'Altitude' | 'AltitudeAccuracy' | 'FormattedAddress' | 'LocationUri' | 'LocationSource'>
  )> }
);

export const AllEnhancedLocationFieldsFragmentDoc: DocumentNode<AllEnhancedLocationFieldsFragment, unknown> = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"AllEnhancedLocationFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"EnhancedLocation"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"DisplayName"}},{"kind":"Field","name":{"kind":"Name","value":"Annotation"}},{"kind":"Field","name":{"kind":"Name","value":"PostalAddress"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Street"}},{"kind":"Field","name":{"kind":"Name","value":"City"}},{"kind":"Field","name":{"kind":"Name","value":"State"}},{"kind":"Field","name":{"kind":"Name","value":"Country"}},{"kind":"Field","name":{"kind":"Name","value":"PostalCode"}},{"kind":"Field","name":{"kind":"Name","value":"PostOfficeBox"}},{"kind":"Field","name":{"kind":"Name","value":"Type"}},{"kind":"Field","name":{"kind":"Name","value":"Latitude"}},{"kind":"Field","name":{"kind":"Name","value":"Longitude"}},{"kind":"Field","name":{"kind":"Name","value":"Accuracy"}},{"kind":"Field","name":{"kind":"Name","value":"Altitude"}},{"kind":"Field","name":{"kind":"Name","value":"AltitudeAccuracy"}},{"kind":"Field","name":{"kind":"Name","value":"FormattedAddress"}},{"kind":"Field","name":{"kind":"Name","value":"LocationUri"}},{"kind":"Field","name":{"kind":"Name","value":"LocationSource"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"IdType"}},{"kind":"Field","name":{"kind":"Name","value":"LocationType"}}]}}]};