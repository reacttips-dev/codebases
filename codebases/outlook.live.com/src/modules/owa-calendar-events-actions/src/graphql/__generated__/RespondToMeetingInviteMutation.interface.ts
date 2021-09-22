//@ts-nocheck TS6133
/* eslint-disable @typescript-eslint/no-duplicate-imports */
import * as Types from 'owa-graph-schema';

import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type RespondToMeetingInviteMutationVariables = Types.Exact<{
  meetingId: Types.Scalars['ItemId'];
  responseBody?: Types.Maybe<Types.Scalars['String']>;
  responseType: Types.ResponseType;
  shouldSendResponse: Types.Scalars['Boolean'];
  MeetingRequestIdToBeDeleted?: Types.Maybe<Types.Scalars['String']>;
  mailboxInfo: Types.MailboxInfoInput;
}>;


export type RespondToMeetingInviteMutation = (
  { __typename?: 'Mutation' }
  & { respondToMeetingInvite: (
    { __typename?: 'RespondToMeetingInviteResponse' }
    & Pick<Types.RespondToMeetingInviteResponse, 'success'>
  ) }
);


export const RespondToMeetingInviteDocument: DocumentNode<RespondToMeetingInviteMutation, RespondToMeetingInviteMutationVariables> = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RespondToMeetingInvite"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ItemId"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"responseBody"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"responseType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ResponseType"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"shouldSendResponse"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"MeetingRequestIdToBeDeleted"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"MailboxInfoInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"respondToMeetingInvite"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"meetingId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"meetingId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"responseBody"},"value":{"kind":"Variable","name":{"kind":"Name","value":"responseBody"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"responseType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"responseType"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"shouldSendResponse"},"value":{"kind":"Variable","name":{"kind":"Name","value":"shouldSendResponse"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"MeetingRequestIdToBeDeleted"},"value":{"kind":"Variable","name":{"kind":"Name","value":"MeetingRequestIdToBeDeleted"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"mailboxInfo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"mailboxInfo"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}}]}}]}}]};