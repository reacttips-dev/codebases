import { FluidOwaSource } from 'owa-fluid-validations';
import getStore from '../store/store';
import { isFeatureEnabled } from 'owa-feature-flags';

export function isFluidOwaSourceValidForPerfScenario(owaSource: FluidOwaSource | null) {
    return (
        isFeatureEnabled('cal-cmp-fluidCollaborativeSpace') &&
        getStore().fluidOwaSource === owaSource &&
        (owaSource === FluidOwaSource.MailCalendarCard ||
            owaSource === FluidOwaSource.CalendarCompose ||
            owaSource === FluidOwaSource.CalendarReadingPane)
    );
}
