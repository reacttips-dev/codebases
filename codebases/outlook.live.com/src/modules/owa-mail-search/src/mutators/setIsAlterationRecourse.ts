import mailSearchStore from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction('setIsAlterationRecourse', (isAlterationRecourse: boolean): void => {
    mailSearchStore.isAlterationRecourse = isAlterationRecourse;
});
