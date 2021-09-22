import { orchestrator } from 'satcheljs';

import setApplicationSettingOverrideAction from '../actions/setApplicationSettingOverrideAction';
import { setLocalOverride } from '../utils/localOverrides';

const setApplicationSettingOverrideOrchestrator = orchestrator(
    setApplicationSettingOverrideAction,
    ({ setting, value }) => {
        setLocalOverride(setting, value);
    }
);

export default setApplicationSettingOverrideOrchestrator;
