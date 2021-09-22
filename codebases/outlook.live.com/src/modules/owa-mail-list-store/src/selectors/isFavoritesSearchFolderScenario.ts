import type { MailFolderScenarioType } from '../index';

export function isFavoritesSearchFolderScenario(scenarioType: MailFolderScenarioType): boolean {
    return (
        scenarioType === 'persona' ||
        scenarioType === 'privatedistributionlist' ||
        scenarioType === 'category'
    );
}
