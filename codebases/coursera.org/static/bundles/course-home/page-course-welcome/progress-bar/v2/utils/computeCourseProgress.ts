import {
  Item,
  GuidedCourseSessionProgressesV1,
} from 'bundles/naptimejs/resources/__generated__/GuidedCourseSessionProgressesV1';

export type CourseProgress = {
  percentComplete: number;
  completedAssignments: number;
  totalAssignments: number;
  timeRemaining: number;
};

export const isAssignment = (item: Item) => {
  const gradableTypes = [
    'exam',
    'closedPeer',
    'gradedPeer',
    'phasedPeer',
    'gradedProgramming',
    'programming',
    'gradedLti',
    'gradedDiscussionPrompt',
    'teammateReview',
    'staffGraded',
  ];

  const isGradable = gradableTypes.includes(item.contentSummary.typeName);

  const isHonors = item.trackId === 'honors';

  const isOptional = item.isOptional;

  return isGradable && !isHonors && !isOptional;
};

const isCompleted = (item: Item) => item.computedProgressState.toLowerCase() === 'completed';

const flatMap = <T>(arr: T[], cb: <U>(T) => U[]) => arr.reduce((acc, x) => acc.concat(cb(x)), []);

export const computeCourseProgress = (progress: GuidedCourseSessionProgressesV1): CourseProgress => {
  const items: Item[] = flatMap(progress.weeks, (week) => flatMap(week.modules, (module) => module.items));

  const completedItems = items.filter(isCompleted);
  const assignments = items.filter(isAssignment);
  const totalTime = items.reduce((acc, cur) => acc + cur.timeCommitment, 0);
  const completedTime = completedItems.reduce((acc, cur) => acc + cur.timeCommitment, 0);
  const timeRemaining = totalTime - completedTime;

  const totalAssignments = assignments.length;
  const completedAssignments = assignments.filter(isCompleted).length;

  const percentComplete = parseFloat((completedItems.length / items.length).toFixed(2));

  return { percentComplete, totalAssignments, completedAssignments, timeRemaining };
};
