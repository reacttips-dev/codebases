'use es6';

import withGateOverride from 'crm_data/gates/withGateOverride';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
export var useHasPinnedViewsBackendRedesignGate = function useHasPinnedViewsBackendRedesignGate() {
  var hasAllGates = useHasAllGates();
  return withGateOverride('CRM:Datasets:PinnedViewsBackendRedesign', hasAllGates('CRM:Datasets:PinnedViewsBackendRedesign'));
};