import {
    bulkAction_emptyFolderHover,
    bulkAction_sweepHover,
    bulkAction_runRuleHover,
    bulkAction_restoreAllHover,
} from './getBulkActionTooltipText.locstring.json';
import loc, { format } from 'owa-localize';
import type { BulkActionScenarioType } from '../index';

export default function getBulkActionTooltipText(
    scenario: BulkActionScenarioType,
    folderName: string
) {
    switch (scenario) {
        case 'EmptyFolder':
            return format(loc(bulkAction_emptyFolderHover), folderName);
        case 'Sweep':
            return format(loc(bulkAction_sweepHover), folderName);
        case 'RunRuleNow':
            return format(loc(bulkAction_runRuleHover), folderName);
        case 'RestoreAllItems':
            return format(loc(bulkAction_restoreAllHover), folderName);
        default:
            throw new Error('Invalid bulk action scenario type');
    }
}
