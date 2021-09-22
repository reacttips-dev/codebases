import { onLocaleChanged } from 'owa-localize';
import { orchestrator } from 'satcheljs';
import updateFabricTheme from './updateFabricTheme';
import mutateFont from '../mutators/mutateFont';

orchestrator(onLocaleChanged, actionMessage => {
    mutateFont(actionMessage.locale);
    updateFabricTheme();
});
