import { SupportedWorkLoads } from '../schema/SupportedWorkloadScenarios';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import type { OwaWorkload } from 'owa-workloads';

export function isSupportedWorkload(workload: OwaWorkload): boolean {
    // false if workload-specific scenario settings are not enabled in host app
    if (!isHostAppFeatureEnabled('workloadScenarioSettings')) {
        return false;
    }

    // true if SupportedWorkLoads has workload bit set
    return ((workload as number) & SupportedWorkLoads) != 0;
}
