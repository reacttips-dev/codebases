import epic from 'bundles/epic/client';
import { isCDSAdoptionQ2ABTestEnabled } from 'bundles/course-v2/featureFlags';

export const isCDSTMRPageEnabled = () => {
  return epic.get('CDS-Learner', 'TMRPage') && isCDSAdoptionQ2ABTestEnabled();
};
