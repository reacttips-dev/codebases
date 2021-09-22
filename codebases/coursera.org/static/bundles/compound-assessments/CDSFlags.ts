import epic from 'bundles/epic/client';
import { isCDSAdoptionQ2ABTestEnabled } from 'bundles/course-v2/featureFlags';

export const isCdsSgaEnabled = () => {
  return epic.get('CDS-Learner', 'SGAPage') && isCDSAdoptionQ2ABTestEnabled();
};
