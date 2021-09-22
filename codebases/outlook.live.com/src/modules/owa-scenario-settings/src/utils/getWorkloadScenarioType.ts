import type { ScenarioType } from '../schema/ScenarioType';
import { OwaWorkload } from 'owa-workloads';

export function getWorkloadScenarioType(workload: OwaWorkload): ScenarioType {
    switch (workload) {
        case OwaWorkload.Mail:
            return 'Mail';
        case OwaWorkload.Calendar:
            return 'Calendar';
        case OwaWorkload.FilesHub:
            return 'FilesHub';
        case OwaWorkload.People:
            return 'People';
        default:
            throw new Error('getWorkloadScenarioType: The workload type is not supported');
    }
}
