import { orchestrator } from 'satcheljs';
import { languageChanged } from 'owa-regional-options-service';
import loadTimeZoneOptions from '../orchestration/loadTimeZoneOptions';

orchestrator(languageChanged, () => {
    loadTimeZoneOptions();
});
