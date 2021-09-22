import { getStore } from '../store/tabStore';
import { action } from 'satcheljs/lib/legacy';

export default action('setIsOverflowMenuShown')(function (isShown: boolean) {
    getStore().isOverflowMenuShown = isShown;
});
