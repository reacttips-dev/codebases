import { createLazyComponent, LazyModule } from 'owa-bundling';

export {
    getCategoryMenuPropertiesForCommandBar,
    getCategoryMenuPropertiesForContextMenu,
} from './utils/getCategoryMenuProperties';

const lazyModule = new LazyModule(
    () => import(/* webpackChunkName: "MailListCategoryHeader" */ './lazyIndex')
);

export const MailListCategoryHeaderSecondRowContent = createLazyComponent(
    lazyModule,
    m => m.MailListCategoryHeaderSecondRowContent
);
