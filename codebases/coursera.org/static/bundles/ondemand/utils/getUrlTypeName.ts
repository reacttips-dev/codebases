const TYPE_NAME_TO_URL_TYPE = {
  assessOpenSinglePage: 'quiz',
  closedPeer: 'peer',
  gradedPeer: 'peer',
  phasedPeer: 'peer',
  splitPeerReviewItem: 'peer',
  gradedProgramming: 'programming',
  ungradedProgramming: 'programming',
  staffGraded: 'team',
  teammateReview: 'teammate-review',
  workspaceLauncher: 'workspace',
} as const;

export default function getUrlTypeName(typeName: string): string {
  return (TYPE_NAME_TO_URL_TYPE as Record<string, string>)[typeName] || typeName;
}
