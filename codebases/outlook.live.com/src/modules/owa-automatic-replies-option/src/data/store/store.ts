import type AutomaticRepliesOptionViewState from './schema/AutomaticRepliesOptionViewState';
import getAutomaticRepliesOptionStateDefaultValue from '../../utils/getAutomaticRepliesOptionStateDefaultValue';
import { createStore } from 'satcheljs';

export default createStore<AutomaticRepliesOptionViewState>('automaticRepliesOptionLegacy', {
    initialState: getAutomaticRepliesOptionStateDefaultValue(),
    currentState: getAutomaticRepliesOptionStateDefaultValue(),
    selectedCalendarIds: [],
});
