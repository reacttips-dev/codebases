import { optionTitle_suggestedReplies } from './SuggestedRepliesOption.locstring.json';
import { LazyOption, createLazyOption } from 'owa-options-core';
import { LazyModule } from 'owa-bundling';
import { isFeatureEnabled } from 'owa-feature-flags';

var lazyFullModule = new LazyModule(() => import('./lazyFullOption'));
const SuggestedRepliesOption: LazyOption = createLazyOption(
    {
        key: 'SuggestedReplies',
        titleStringKey: optionTitle_suggestedReplies,
        searchTermsStringKey: optionTitle_suggestedReplies,
        isHidden: () => !isFeatureEnabled('mc-smartReply'),
    },
    lazyFullModule,
    m => m.default
);
export default SuggestedRepliesOption;
