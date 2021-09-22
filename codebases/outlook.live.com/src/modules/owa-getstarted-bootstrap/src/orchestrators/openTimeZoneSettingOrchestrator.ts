import { lazyMountAndShowFullOptions } from 'owa-options-view';
import { orchestrator } from 'satcheljs';
import { openTimeZoneSetting } from 'owa-getstarted/lib/actions/openTimeZoneSetting';

orchestrator(openTimeZoneSetting, () => {
    lazyMountAndShowFullOptions.importAndExecute('general', 'timeAndLanguage');
});
