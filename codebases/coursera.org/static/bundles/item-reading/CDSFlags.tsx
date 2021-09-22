import epic from 'bundles/epic/client';
import { isCDSAdoptionQ2ABTestEnabled } from 'bundles/course-v2/featureFlags';

export const isCDSReadingsEnabled = () => {
  return epic.get('CDS-Learner', 'ReadingsPage') && isCDSAdoptionQ2ABTestEnabled();
};
