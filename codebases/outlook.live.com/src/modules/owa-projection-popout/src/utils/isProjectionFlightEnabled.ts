import { isFeatureEnabled } from 'owa-feature-flags';
import { Module } from 'owa-workloads';

export default function isProjectionFlightEnabled(module: Module) {
    switch (module) {
        case Module.Mail:
            return isFeatureEnabled('mail-popout-projection');
        case Module.Calendar:
            return (
                isFeatureEnabled('cal-cmp-popout-projection') &&
                isFeatureEnabled('mail-popout-projection')
            );
        default:
            return false;
    }
}
