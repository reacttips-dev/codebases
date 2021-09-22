const exported = {
  Quiz: 'quiz',
  Reading: 'reading',
  Lecture: 'lecture',
  Programming: 'programming',
  DiscussionPrompt: 'discussionPrompt',
  GradedDiscussionPrompt: 'gradedDiscussionPrompt',
  TeammateReview: 'teammateReview',
  StaffGradedAssignment: 'staffGraded',
  Peer: 'peer',
  Notebook: 'notebook',
  Widget: 'widget',
  WiseFlow: 'wiseFlow',
} as const;

export default exported;

export const {
  Quiz,
  Reading,
  Lecture,
  Programming,
  DiscussionPrompt,
  GradedDiscussionPrompt,
  TeammateReview,
  StaffGradedAssignment,
  Peer,
  Notebook,
  Widget,
  WiseFlow,
} = exported;
