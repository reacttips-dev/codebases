import { LazyAction, LazyBootModule } from 'owa-bundling-light';

const lazyModule = new LazyBootModule(
    () => import(/* webpackChunkName: "PlatformAppBoot"*/ './lazyIndex')
);

export const lazyGetAuthTokenFromMetaOsHub = new LazyAction(
    lazyModule,
    m => m.getAuthTokenFromMetaOsHub
);

export const lazyGetOwaAuthTokenFromMetaOsHub = new LazyAction(
    lazyModule,
    m => m.getOwaAuthTokenFromMetaOsHub
);

export const lazyOpenCalendarItem = new LazyAction(lazyModule, m => m.openCalendarItem);

export const lazyComposeMeeting = new LazyAction(lazyModule, m => m.composeMeeting);

export const lazyOpenMailItem = new LazyAction(lazyModule, m => m.openMailItem);

export const lazyComposeMail = new LazyAction(lazyModule, m => m.composeMail);

export const lazyExecuteDeepLink = new LazyAction(lazyModule, m => m.executeDeepLink);

export const lazyGetContext = new LazyAction(lazyModule, m => m.getContext);

export const lazyCheckCalendarCapability = new LazyAction(
    lazyModule,
    m => m.checkCalendarCapability
);

export const lazyCheckMailCapability = new LazyAction(lazyModule, m => m.checkMailCapability);

export const lazyIsDarkTheme = new LazyAction(lazyModule, m => m.isDarkTheme);

export const lazyRegisterHandlers = new LazyAction(lazyModule, m => m.registerHandlers);

export const lazyJoinTeamsMeeting = new LazyAction(lazyModule, m => m.joinTeamsMeeting);

export const lazyModalOpened = new LazyAction(lazyModule, m => m.modalOpened);

export const lazySubmitTask = new LazyAction(lazyModule, m => m.submitTask);

export const lazyNotifySuccess = new LazyAction(lazyModule, m => m.notifySuccess);

export const lazyNotifyAppLoaded = new LazyAction(lazyModule, m => m.notifyAppLoaded);

export const lazyNavigateToView = new LazyAction(lazyModule, m => m.navigateToView);

export const lazySendPLTDataPoint = new LazyAction(lazyModule, m => m.sendPLTDataPoint);

export const lazyRegisterIsDarkThemeOnChangeHandler = new LazyAction(
    lazyModule,
    m => m.registerIsDarkThemeOnChangeHandler
);
