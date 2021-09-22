import { createLazyComponent, LazyModule } from 'owa-bundling';
import LoadingSpinner from 'owa-calendar-forms-common/lib/components/LoadingSpinner';

export const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "CalendarFullCompose"*/ './lazyIndex')
);

// Lazy-load Full compose form
export var FullComposeForm = createLazyComponent(
    lazyModule,
    m => m.FullComposeForm,
    LoadingSpinner
);

export const ProjectionCalendarCompose = createLazyComponent(
    lazyModule,
    m => m.ProjectionCalendarCompose,
    LoadingSpinner
);

export const ModalCalendarCompose = createLazyComponent(
    lazyModule,
    m => m.ModalCalendarCompose,
    LoadingSpinner
);
