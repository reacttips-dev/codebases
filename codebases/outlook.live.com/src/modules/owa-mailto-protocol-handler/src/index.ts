import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailtoProtocolHandler" */ './lazyIndex')
);

export {
    shouldShowMailtoProtocolUpsellBanner,
    doesSupportProtocolHandlerRegistration,
} from './utils/shouldShowMailtoProtocolUpsellBanner';
export const MailtoProtocolUpsellBanner = createLazyComponent(
    lazyModule,
    m => m.MailtoProtocolUpsellBanner
);
