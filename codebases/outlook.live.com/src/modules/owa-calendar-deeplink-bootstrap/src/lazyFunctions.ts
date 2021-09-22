import { LazyAction, LazyBootModule } from 'owa-bundling-light';

const lazyModule = new LazyBootModule(() => {
    /**
     * This conditional, using values injected using the webpack DefinePlugin at build time, will be evaluated at build time to
     * either include this import in the build or not. In production builds, this entire conditional should be minified out.
     * Because it depends on static evaluation during build, this conditional should not be refactored to a function.
     */
    if (
        process.env.NODE_ENV !== 'dev' ||
        OWA_BUILD_CONSTANTS.BUILD_ALL ||
        OWA_BUILD_CONSTANTS.ENTRIES.calendar
    ) {
        return import(/* webpackChunkName: "CalendarDeepBoot" */ './deeplinkEntryPoint');
    } else {
        return Promise.reject(new Error('Entrypoint is not being built'));
    }
});

export const lazyGetCalendarDeepLinkBootstrapOptions = new LazyAction(
    lazyModule,
    m => m.getCalendarDeepLinkBootstrapOptions
);
