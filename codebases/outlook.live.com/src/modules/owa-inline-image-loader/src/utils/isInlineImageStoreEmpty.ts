import inlineImageStore from '../store/store';

export default function isInlineImageStoreEmpty(): boolean {
    return Object.keys(inlineImageStore.inlineImages).length == 0;
}
