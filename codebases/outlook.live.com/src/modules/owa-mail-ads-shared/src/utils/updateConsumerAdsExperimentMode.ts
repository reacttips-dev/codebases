import { lazyUpdateUserConfigurationService } from 'owa-session-store';

export function updateConsumerAdsExperimentMode(newConsumerAdsExperimentModeValue: number) {
    lazyUpdateUserConfigurationService.importAndExecute([
        {
            key: 'ConsumerAdsExperimentMode',
            valuetype: 'Integer32',
            value: [String(newConsumerAdsExperimentModeValue)],
        },
    ]);
}
