import { isBootFeatureEnabled } from 'owa-metatags';
import { isHostAppFeatureEnabled } from 'owa-hostapp-feature-flags';
import { lazyOneOutlookSuiteHeader } from 'one-outlook-suite-header';
import { LazyCalendarRibbonImport } from 'owa-calendar-ribbon/lib/lazyCalendarRibbonImport';
import { LazyMailRibbonImport } from 'owa-mail-ribbon/lib/lazyMailRibbonImport';
import { lazyAppBar, lazyLegacyAppBar } from 'owa-appbar';
import type { BootStrategies } from 'owa-shared-start';

const suiteWrapper = isHostAppFeatureEnabled('outlookSuiteHeaderStrategy')
    ? lazyOneOutlookSuiteHeader
    : undefined;
const appBarStrategy = isBootFeatureEnabled('novaappbar') ? lazyAppBar : lazyLegacyAppBar;

export const strategies: BootStrategies = {
    suiteWrapper,
    appBarStrategy,
};

const calendarRibbonProvider = isHostAppFeatureEnabled('calendarRibbon')
    ? LazyCalendarRibbonImport
    : undefined;
export const calendarStrategies: Partial<BootStrategies> = {
    calendarRibbonProvider,
};

const mailRibbonProvider = isHostAppFeatureEnabled('mailRibbon') ? LazyMailRibbonImport : undefined;
export const mailStrategies: Partial<BootStrategies> = {
    mailRibbonProvider,
};
