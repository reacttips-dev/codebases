import { getStore } from '../store/tabStore';
import { action } from 'satcheljs/lib/legacy';

export default action('setTabBarWidth')(function (tabBarWidth: number) {
    getStore().tabBarWidth = tabBarWidth;
});
