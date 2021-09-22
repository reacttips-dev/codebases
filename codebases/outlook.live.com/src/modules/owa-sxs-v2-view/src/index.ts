import { insertSxSV2IntoDomHelper } from 'owa-attachment-preview-sxs-actions';
import { LazyAction, LazyModule, createLazyComponent } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "SxS" */ './lazyIndex'));

const lazyInsertSxSV2IntoDomIfNeeded = new LazyAction(
    lazyModule,
    m => m.insertSxSV2IntoDomIfNeeded
);

insertSxSV2IntoDomHelper.register(lazyInsertSxSV2IntoDomIfNeeded.importAndExecute);

export const ProjectionSxSV2 = createLazyComponent(lazyModule, m => m.ProjectionSxSV2);
