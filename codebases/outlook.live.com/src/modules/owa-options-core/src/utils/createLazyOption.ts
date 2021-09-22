import type { CoreOption, LazyOption } from '../store/schema/Option';
import type OptionComponentSettings from '../store/schema/OptionComponentSettings';
import type {
    default as OptionQuickComponentSettings,
    OptionQuickComponentSettingsWithKey,
} from '../store/schema/OptionQuickComponentSettings';
import { LazyModule, LazyImport } from 'owa-bundling';

function createLazyOption<TFullModule, TQuickModule>(
    coreOption: CoreOption,
    fullOptionLazyModule: LazyModule<TFullModule>,
    fullSettingsGetter: (m: TFullModule) => OptionComponentSettings,
    quickOptionLazyModule?: LazyModule<TQuickModule>,
    quickOptionsGetter?: (
        m: TQuickModule
    ) => OptionQuickComponentSettings | OptionQuickComponentSettingsWithKey[]
): LazyOption {
    const fullLazyImport = new LazyImport(fullOptionLazyModule, fullSettingsGetter);
    const quickLazyImport =
        quickOptionLazyModule && quickOptionsGetter
            ? new LazyImport(quickOptionLazyModule, quickOptionsGetter)
            : null;
    return {
        ...coreOption,
        tryImportFullOptionFormSettingsSync: () => fullLazyImport.tryImportForRender(),
        tryImportQuickOptionSettingsSync: quickLazyImport
            ? () => quickLazyImport.tryImportForRender()
            : undefined,
    };
}

export { createLazyOption };
