import type InlineImageStore from './schema/InlineImageStore';
import { createStore } from 'satcheljs';

const initialInlineImageStore: InlineImageStore = {
    inlineImages: {},
};
const store = createStore<InlineImageStore>('inlineimages', initialInlineImageStore)();

export default store;
