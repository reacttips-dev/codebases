import { createLazyComponent, LazyModule } from 'owa-bundling';

export {
    isValidOnlineMeeting,
    isEventJoinableNow,
    isEventHappeningNowHelper,
} from './utils/onlineMeetingBootHelper';
export type { JoinButtonLabelFormat } from './utils/JoinButtonLabelFormat';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "JoinOnlineMeetingButton" */ './lazyBootIndex')
);

export const JoinOnlineMeetingButton = createLazyComponent(
    lazyModule,
    m => m.JoinOnlineMeetingButton
);
