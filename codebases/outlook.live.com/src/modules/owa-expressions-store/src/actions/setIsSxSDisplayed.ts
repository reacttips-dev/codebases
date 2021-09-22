import expressionStore from '../store/expressionStore';
import { mutatorAction } from 'satcheljs';

export default mutatorAction('setIsSxSDisplayed', (isSxSDisplayed: boolean) => {
    expressionStore.isSxSDisplayed = isSxSDisplayed;
});
