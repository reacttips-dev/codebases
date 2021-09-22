import { optionTitle_regional, optionSearch_regional } from './RegionalOption.locstring.json';
import { LazyOption, createLazyOption } from 'owa-options-core';
import { LazyModule } from 'owa-bundling';
var lazyFullModule = new LazyModule(() => import('./lazyFullOption'));
var lazyQuickModule = new LazyModule(() => import('./lazyQuickOption'));
let RegionalOption: LazyOption = createLazyOption(
    {
        key: 'regional',
        titleStringKey: optionTitle_regional,
        hideTitleInFullOptions: true,
        searchTermsStringKey: optionSearch_regional,
        allowedOptionKeys: ['Regional'],
    },
    lazyFullModule,
    m => m.default,
    lazyQuickModule,
    m => m.default
);
export default RegionalOption;
