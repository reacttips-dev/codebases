import { isForumsBlacklisted } from 'bundles/ondemand/utils/socialExperimentUtils';

export default function shouldShowWeekDiscussionHeader(courseId: string, isPreviewMode: boolean): boolean {
  return !isForumsBlacklisted(courseId) && !isPreviewMode;
}
