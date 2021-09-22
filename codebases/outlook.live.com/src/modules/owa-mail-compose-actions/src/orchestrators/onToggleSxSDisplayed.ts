import setIsSxSDisplayed from 'owa-expressions-store/lib/actions/setIsSxSDisplayed';
import { closeSxS, showSxS } from 'owa-sxs-store';
import { orchestrator } from 'satcheljs';

orchestrator(showSxS, () => {
    setIsSxSDisplayed(true);
});

orchestrator(closeSxS, () => {
    setIsSxSDisplayed(false);
});
