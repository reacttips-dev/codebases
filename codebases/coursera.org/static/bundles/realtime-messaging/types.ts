import { GoalCreateMessageBody, GoalProgressMessageBody } from 'bundles/goal-setting/types/RealtimeMessages';
import { LearningAssistanceMessage as ImportedLearningAssistanceMessage } from 'bundles/learning-assistant/types/RealtimeMessages';

export type ChannelId = string;
export type MessageId = string;

export enum ChannelName {
  LearningGoals = 'LearningGoals',
  LearningAssistance = 'LearningAssistance',
}

export enum MessageType {
  GoalCreateMessage = 'GoalCreateMessage',
  GoalProgressMessage = 'GoalProgressMessage',
  LearningAssistanceMessage = 'LearningAssistanceMessage',
}

export type MessageBody = GoalCreateMessageBody | GoalProgressMessageBody;

export type GoalCreateMessage = {
  __typename: ChannelName;
  id: MessageId;
  channelName: ChannelName;
  messageType: MessageType.GoalCreateMessage;
  messageBody: GoalCreateMessageBody;
};

export type GoalProgressMessage = {
  __typename: ChannelName;
  id: MessageId;
  channelName: ChannelName;
  messageType: MessageType.GoalProgressMessage;
  messageBody: GoalProgressMessageBody;
};

// Note: needed to rename LearningAssistanceMessage to ImportedLearningAssistanceMessage
// in order to prevent variable shadowing in the MessageType enum
// https://github.com/typescript-eslint/typescript-eslint/issues/325
export type FormattedRealtimeMessage = ImportedLearningAssistanceMessage | GoalCreateMessage | GoalProgressMessage;

export type UnformattedRealtimeMessage = {
  id: MessageId;
  channelName: ChannelName;
  messageType: MessageType;
  messageBody: MessageBody;
};
