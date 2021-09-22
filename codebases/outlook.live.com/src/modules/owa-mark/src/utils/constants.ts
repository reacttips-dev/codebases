import { LazyModule } from 'owa-bundling';
import type * as Mark from 'mark.js';

const lazyMarkJS = new LazyModule(() => import(/* webpackChunkName: "MarkJS" */ 'external-markjs'));

let MarkJS: typeof Mark = null;
export async function getMarkJS(): Promise<typeof Mark> {
    if (!MarkJS) {
        const result = await lazyMarkJS.import();
        MarkJS = result.default;
    }
    return MarkJS;
}

export const SPAN_ELEMENT_NAME = 'span';
export const UNMARK_ELEMENT_LABEL = 'unmark';

export const MARK_ID_PREFIX = 'mark';
export const MARK_ID_NUMBER_LEN = 9;
