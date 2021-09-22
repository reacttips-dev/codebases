import {
    optionSubcategory_chatandcall,
    optionSubcategory_chat,
} from './SkypeNotificationOption.locstring.json';
import { optionSubcategory_notifications } from 'owa-locstrings/lib/strings/optionsubcategory_notifications.locstring.json';
import { LazyOption, createLazyOption } from 'owa-options-core';
import { LazyModule } from 'owa-bundling';
import isCallingEnabled from './utils/isCallingEnabled';
import isSkypeEnabled from './utils/isSkypeEnabled';
var lazyFullModule = new LazyModule(() => import('./lazyFullOption'));
let SkypeNotificationOption: LazyOption = createLazyOption(
    {
        key: 'skypeNotifications',
        titleStringKey: isCallingEnabled() ? optionSubcategory_chatandcall : optionSubcategory_chat,
        searchTermsStringKey: optionSubcategory_notifications,
        isHidden: () => !isSkypeEnabled(),
    },
    lazyFullModule,
    m => m.default
);
export default SkypeNotificationOption;
