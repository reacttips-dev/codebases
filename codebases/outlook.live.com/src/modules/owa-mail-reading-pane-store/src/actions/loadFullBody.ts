import type ItemViewState from '../store/schema/ItemViewState';
import { action } from 'satcheljs';

export const loadFullBody = action('loadFullBody', (viewState: ItemViewState) => {
    return { viewState };
});
