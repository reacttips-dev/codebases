import { mutatorAction } from 'satcheljs';
import getStore from '../store/store';

export default mutatorAction('SET_UNSEEN_COUNT', function setUnseenCount(unseenCount: number) {
    getStore().unseenMessages = unseenCount;
});
