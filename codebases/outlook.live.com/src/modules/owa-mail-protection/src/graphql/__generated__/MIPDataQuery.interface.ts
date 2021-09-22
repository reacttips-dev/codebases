//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type MipDataQueryQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type MipDataQueryQuery = (
  { __typename?: 'Query' }
  & { MIPData: (
    { __typename?: 'MIPData' }
    & Pick<Types.MipData, 'learnMoreUrl' | 'hasMandatoryLabel'>
    & { clpLabels: Array<(
      { __typename?: 'MIPLabel' }
      & Pick<Types.MipLabel, 'id' | 'parentId' | 'displayName' | 'infobarDisplayText' | 'tooltip' | 'settingOrder' | 'isDefault' | 'isEncryptingLabel' | 'isAutoLabelingOn' | 'isLabelEnabled' | 'shouldShowDowngradeDialog'>
    )> }
  ) }
);


export const MipDataQueryDocument: DocumentNode<MipDataQueryQuery, MipDataQueryQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"MIPDataQuery"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"MIPData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"clpLabels"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"parentId"}},{"kind":"Field","name":{"kind":"Name","value":"displayName"}},{"kind":"Field","name":{"kind":"Name","value":"infobarDisplayText"}},{"kind":"Field","name":{"kind":"Name","value":"tooltip"}},{"kind":"Field","name":{"kind":"Name","value":"settingOrder"}},{"kind":"Field","name":{"kind":"Name","value":"isDefault"}},{"kind":"Field","name":{"kind":"Name","value":"isEncryptingLabel"}},{"kind":"Field","name":{"kind":"Name","value":"isAutoLabelingOn"}},{"kind":"Field","name":{"kind":"Name","value":"isLabelEnabled"}},{"kind":"Field","name":{"kind":"Name","value":"shouldShowDowngradeDialog"}}]}},{"kind":"Field","name":{"kind":"Name","value":"learnMoreUrl"}},{"kind":"Field","name":{"kind":"Name","value":"hasMandatoryLabel"}}]}}]}}]};