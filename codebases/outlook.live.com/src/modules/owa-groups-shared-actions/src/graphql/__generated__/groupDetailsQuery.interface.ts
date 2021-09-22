//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type GroupDetailsQueryVariables = Types.Exact<{
  mailboxSmtpAddress: Types.Scalars['String'];
  loadFullDetails?: Types.Maybe<Types.Scalars['Boolean']>;
}>;


export type GroupDetailsQuery = (
  { __typename?: 'Query' }
  & { groupDetails?: Types.Maybe<(
    { __typename?: 'Group' }
    & Pick<Types.Group, 'AccessType' | 'GroupId' | 'Kind' | 'Name' | 'SmtpAddress' | 'TenantId'>
    & { Details?: Types.Maybe<(
      { __typename?: 'GroupDetails' }
      & Pick<Types.GroupDetails, 'AllowExternalSenders' | 'AutoSubscribeNewMembers' | 'Classification' | 'Culture' | 'Description' | 'HasGuests' | 'IsJoinRequestPendingApproval' | 'IsMembershipHidden' | 'IsMembershipDynamic' | 'IsMember' | 'IsOwner' | 'IsSubscribedByMail' | 'MemberCount' | 'OwnerCount' | 'ProxyAddresses' | 'SendAsPermission' | 'SubscriptionType' | 'SubscriptionTypeAllowedValues'>
      & { Resources?: Types.Maybe<Array<Types.Maybe<(
        { __typename?: 'GroupResource' }
        & Pick<Types.GroupResource, 'Name' | 'Url'>
      )>>>, RetentionPolicyTags?: Types.Maybe<Array<Types.Maybe<(
        { __typename?: 'RetentionPolicyTag' }
        & Pick<Types.RetentionPolicyTag, 'Description' | 'DisplayName' | 'IsArchive' | 'IsVisible' | 'OptedInto' | 'ParentLabelIdentity' | 'Priority' | 'RetentionAction' | 'RetentionId' | 'RetentionPeriod' | 'Type'>
      )>>> }
    )> }
  )> }
);


export const GroupDetailsDocument: DocumentNode<GroupDetailsQuery, GroupDetailsQueryVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GroupDetails"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mailboxSmtpAddress"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"loadFullDetails"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"groupDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"mailboxSmtpAddress"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mailboxSmtpAddress"}}},{"kind":"Argument","name":{"kind":"Name","value":"loadFullDetails"},"value":{"kind":"Variable","name":{"kind":"Name","value":"loadFullDetails"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AccessType"}},{"kind":"Field","name":{"kind":"Name","value":"GroupId"}},{"kind":"Field","name":{"kind":"Name","value":"Kind"}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"SmtpAddress"}},{"kind":"Field","name":{"kind":"Name","value":"TenantId"}},{"kind":"Field","name":{"kind":"Name","value":"Details"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"AllowExternalSenders"}},{"kind":"Field","name":{"kind":"Name","value":"AutoSubscribeNewMembers"}},{"kind":"Field","name":{"kind":"Name","value":"Classification"}},{"kind":"Field","name":{"kind":"Name","value":"Culture"}},{"kind":"Field","name":{"kind":"Name","value":"Description"}},{"kind":"Field","name":{"kind":"Name","value":"HasGuests"}},{"kind":"Field","name":{"kind":"Name","value":"IsJoinRequestPendingApproval"}},{"kind":"Field","name":{"kind":"Name","value":"IsMembershipHidden"}},{"kind":"Field","name":{"kind":"Name","value":"IsMembershipDynamic"}},{"kind":"Field","name":{"kind":"Name","value":"IsMember"}},{"kind":"Field","name":{"kind":"Name","value":"IsOwner"}},{"kind":"Field","name":{"kind":"Name","value":"IsSubscribedByMail"}},{"kind":"Field","name":{"kind":"Name","value":"MemberCount"}},{"kind":"Field","name":{"kind":"Name","value":"OwnerCount"}},{"kind":"Field","name":{"kind":"Name","value":"ProxyAddresses"}},{"kind":"Field","name":{"kind":"Name","value":"Resources"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"Url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"RetentionPolicyTags"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Description"}},{"kind":"Field","name":{"kind":"Name","value":"DisplayName"}},{"kind":"Field","name":{"kind":"Name","value":"IsArchive"}},{"kind":"Field","name":{"kind":"Name","value":"IsVisible"}},{"kind":"Field","name":{"kind":"Name","value":"OptedInto"}},{"kind":"Field","name":{"kind":"Name","value":"ParentLabelIdentity"}},{"kind":"Field","name":{"kind":"Name","value":"Priority"}},{"kind":"Field","name":{"kind":"Name","value":"RetentionAction"}},{"kind":"Field","name":{"kind":"Name","value":"RetentionId"}},{"kind":"Field","name":{"kind":"Name","value":"RetentionPeriod"}},{"kind":"Field","name":{"kind":"Name","value":"Type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"SendAsPermission"}},{"kind":"Field","name":{"kind":"Name","value":"SubscriptionType"}},{"kind":"Field","name":{"kind":"Name","value":"SubscriptionTypeAllowedValues"}}]}}]}}]}}]};