import epic from 'bundles/epic/client';

export const isWeekLandingEnabled = (courseId: string) =>
  epic.get('learnerRedPandas', 'weeksLandingPage', { course_id: courseId });

export const isProjectLandingEnabled = (courseId: string) =>
  epic.get('learnerRedPandas', 'projectLandingPage', { course_id: courseId });
