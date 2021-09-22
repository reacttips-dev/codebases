import onSpotlightFilterLoaded from '../actions/onSpotlightFilterLoaded';
import { logUsage } from 'owa-analytics';
import { orchestrator } from 'satcheljs';

orchestrator(onSpotlightFilterLoaded, actionMessage => {
    logUsage('Spotlight_FilterLoaded', [actionMessage.actionSource]);
});
