//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type SharedCalendarAdditionalInfoQueryVariables = Types.Exact<{
  calculatedFolderId: Types.Scalars['String'];
  mailboxInfo: Types.MailboxInfoInput;
  isGroupCalendar: Types.Scalars['Boolean'];
}>;


export type SharedCalendarAdditionalInfoQuery = (
  { __typename?: 'Query' }
  & { sharedCalendarAdditionalInfo: (
    { __typename?: 'SharedCalendarAdditionalInfoResult' }
    & { calendarFolder?: Types.Maybe<(
      { __typename?: 'sharedCalendarFolderInfo' }
      & Pick<Types.SharedCalendarFolderInfo, 'distinguishedFolderId' | 'charmId' | 'defaultOnlineMeetingProvider' | 'allowedOnlineMeetingProviders' | 'replicaList'>
      & { folderId?: Types.Maybe<(
        { __typename?: 'FolderId' }
        & Pick<Types.FolderId, 'Id' | 'ChangeKey'>
      )>, effectiveRights?: Types.Maybe<(
        { __typename?: 'EffectiveRightsType' }
        & Pick<Types.EffectiveRightsType, 'CreateAssociated' | 'CreateContents' | 'CreateHierarchy' | 'Delete' | 'Modify' | 'Read' | 'ViewPrivateItems'>
      )>, remoteCategories?: Types.Maybe<(
        { __typename?: 'MasterCategoryList' }
        & { MasterList?: Types.Maybe<Array<Types.Maybe<(
          { __typename?: 'Category' }
          & Pick<Types.Category, 'Name' | 'Color' | 'Id' | 'LastTimeUsed'>
        )>>> }
      )> }
    )> }
  ) }
);


export const SharedCalendarAdditionalInfoDocument: DocumentNode<SharedCalendarAdditionalInfoQuery, SharedCalendarAdditionalInfoQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SharedCalendarAdditionalInfo"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"calculatedFolderId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailboxInfoInput"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"isGroupCalendar"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"sharedCalendarAdditionalInfo"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"calculatedFolderId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"calculatedFolderId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"mailboxInfo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"isGroupCalendar"},"value":{"kind":"Variable","name":{"kind":"Name","value":"isGroupCalendar"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"calendarFolder"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"folderId"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"ChangeKey"}}]}},{"kind":"Field","name":{"kind":"Name","value":"distinguishedFolderId"}},{"kind":"Field","name":{"kind":"Name","value":"effectiveRights"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"CreateAssociated"}},{"kind":"Field","name":{"kind":"Name","value":"CreateContents"}},{"kind":"Field","name":{"kind":"Name","value":"CreateHierarchy"}},{"kind":"Field","name":{"kind":"Name","value":"Delete"}},{"kind":"Field","name":{"kind":"Name","value":"Modify"}},{"kind":"Field","name":{"kind":"Name","value":"Read"}},{"kind":"Field","name":{"kind":"Name","value":"ViewPrivateItems"}}]}},{"kind":"Field","name":{"kind":"Name","value":"charmId"}},{"kind":"Field","name":{"kind":"Name","value":"remoteCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"MasterList"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"Color"}},{"kind":"Field","name":{"kind":"Name","value":"Id"}},{"kind":"Field","name":{"kind":"Name","value":"LastTimeUsed"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"defaultOnlineMeetingProvider"}},{"kind":"Field","name":{"kind":"Name","value":"allowedOnlineMeetingProviders"}},{"kind":"Field","name":{"kind":"Name","value":"replicaList"}}]}}]}}]}}]};