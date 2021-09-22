import type OptionSubCategory from '../store/schema/OptionSubCategory';
import type { default as Option, CoreOption } from '../store/schema/Option';

export type FullOption = Pick<Option, keyof CoreOption | 'fullOptionFormSettings'>;

export function tryLoadAllFullOptionsSync(subcategory: OptionSubCategory): FullOption[] {
    const loadedOptions = subcategory.options.map(option =>
        isOption(option)
            ? option
            : { ...option, fullOptionFormSettings: option.tryImportFullOptionFormSettingsSync() }
    );

    // If some options haven't yet loaded, return `null`
    return loadedOptions.some(({ fullOptionFormSettings }) => !fullOptionFormSettings)
        ? null
        : loadedOptions;
}

function isOption(option: any): option is Option {
    return 'fullOptionFormSettings' in option;
}
