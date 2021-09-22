/**
 * Item types for which feedback is supported.
 * TODO: Read it from somewhere else.
 */
const ItemTypes = {
  Quiz: 'quiz',
  Reading: 'reading',
  Lecture: 'lecture',
  Programming: 'programming',
  StaffGraded: 'staffGraded',
  DiscussionPrompt: 'discussionPrompt',
  GradedDiscussionPrompt: 'gradedDiscussionPrompt',
  TeammateReview: 'teammateReview',
  Peer: 'peer',
  Notebook: 'notebook',
  Widget: 'widget',
  UngradedWidget: 'ungradedWidget',
  Workspace: 'workspaceLauncher',
  UngradedLab: 'ungradedLab',
  GradedLti: 'gradedLti',
  UngradedLti: 'ungradedLti',
} as const;

export type ItemTypesKeys = keyof typeof ItemTypes;

export type ItemType = typeof ItemTypes[ItemTypesKeys];

export default ItemTypes;

export const {
  Quiz,
  Reading,
  Lecture,
  Programming,
  StaffGraded,
  DiscussionPrompt,
  GradedDiscussionPrompt,
  TeammateReview,
  Peer,
  Notebook,
  Widget,
  UngradedWidget,
  Workspace,
  UngradedLab,
} = ItemTypes;
