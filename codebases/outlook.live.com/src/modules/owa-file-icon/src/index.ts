import { createLazyComponent, LazyModule } from 'owa-bundling';

const lazyModule = new LazyModule(() => import(/* webpackChunkName: "FileIcon"*/ './lazyIndex'));

export const CloudIconWithOverlay = createLazyComponent(lazyModule, m => m.CloudIconWithOverlay);

// Type - not delay loaded
export {
    default as getIconForFile,
    getFileIconFromSprite,
    getConvertedExtension,
} from './utils/getIconForFile';
export type { FileIcon } from './utils/getIconForFile';
export { getIconCSSForAttachment } from './utils/getIconCSSForAttachment';
export { default as getFileSpriteIconClass } from './utils/getFileSpriteIconClass';
