import getStore from '../store/store';
import { actionCreator, mutator } from 'satcheljs';

const showAdBlock = actionCreator('showAdBlock');

mutator(showAdBlock, () => {
    getStore().showAdBlockMessage = true;
});

export default showAdBlock;
