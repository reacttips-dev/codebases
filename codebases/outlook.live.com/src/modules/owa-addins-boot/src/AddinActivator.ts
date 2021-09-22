import type Extension from 'owa-service/lib/contract/Extension';
import type { AddinFactory, IAddin } from 'owa-addins-store';
import { ExtensibilityModeEnum } from 'owa-addins-types';

export default class AddinActivator {
    constructor(private addinFactory: AddinFactory) {}

    activate(activeExtensions: Extension[]): Promise<Map<ExtensibilityModeEnum, IAddin[]>> {
        return new Promise<Map<ExtensibilityModeEnum, IAddin[]>>((resolve, reject) => {
            const enabledAddins: Map<ExtensibilityModeEnum, IAddin[]> = new Map<
                ExtensibilityModeEnum,
                IAddin[]
            >();
            const modeEnums = Object.values(ExtensibilityModeEnum).filter(key =>
                isNaN(Number(ExtensibilityModeEnum[key]))
            );

            modeEnums.forEach((mode: ExtensibilityModeEnum) => {
                enabledAddins.set(mode, []);
                activeExtensions.forEach((extension: Extension) => {
                    const addin: IAddin = this.addinFactory.CreateAddinIfEntryPointSupported(
                        extension,
                        mode
                    );

                    if (addin) {
                        enabledAddins.get(mode).push(addin);
                    }
                });
            });

            resolve(enabledAddins);
        });
    }
}
