import { orchestrator } from 'satcheljs';
import { onLocaleChanged } from 'owa-localize';

orchestrator(onLocaleChanged, ({ locale }) => {
    document.documentElement.lang = locale;
});
