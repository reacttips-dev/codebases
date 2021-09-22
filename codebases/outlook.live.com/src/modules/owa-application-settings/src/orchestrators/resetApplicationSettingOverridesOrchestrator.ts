import { orchestrator } from 'satcheljs';

import resetApplicationSettingOverridesAction from '../actions/resetApplicationSettingOverridesAction';
import { resetLocalOverrides } from '../utils/localOverrides';

const resetApplicationSettingOverridesOrchestrator = orchestrator(
    resetApplicationSettingOverridesAction,
    resetLocalOverrides
);

export default resetApplicationSettingOverridesOrchestrator;
