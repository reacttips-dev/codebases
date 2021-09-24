'use es6';

import withGateOverride from 'crm_data/gates/withGateOverride';
import { useHasAllGates } from '../../auth/hooks/useHasAllGates';
export var useHasCreateViewBERedesignGate = function useHasCreateViewBERedesignGate() {
  var hasAllGates = useHasAllGates();
  return withGateOverride('CRM:Datasets:CreateViewBackendRedesign', hasAllGates('CRM:Datasets:CreateViewBackendRedesign'));
};