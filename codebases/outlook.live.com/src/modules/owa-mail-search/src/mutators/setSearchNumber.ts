import mailSearchStore from '../store/store';
import { mutatorAction } from 'satcheljs';

export default mutatorAction('setSearchNumber', (searchNumber: number): void => {
    mailSearchStore.searchNumber = searchNumber;
});
