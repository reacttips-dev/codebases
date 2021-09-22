import epic from 'bundles/epic/client';
import { isCDSAdoptionQ2ABTestEnabled } from 'bundles/course-v2/featureFlags';

export const isCDSQuizzesEnabled = () => {
  return epic.get('CDS-Learner', 'QuizzesPage') && isCDSAdoptionQ2ABTestEnabled();
};
