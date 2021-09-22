import { lazyUpdateUserConfigurationService } from 'owa-session-store/lib/lazyFunctions';

export function updatePontTypeValue(pontValue: number) {
    lazyUpdateUserConfigurationService.importAndExecute([
        {
            key: 'NewEnabledPonts',
            valuetype: 'Integer32',
            value: [`${pontValue}`],
        },
    ]);
}
