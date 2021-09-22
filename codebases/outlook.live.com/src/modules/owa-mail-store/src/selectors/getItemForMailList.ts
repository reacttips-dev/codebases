import mailStore from '../store/Store';
import { getItemToShowFromNodeId } from '../utils/conversationsUtils';
import type Message from 'owa-service/lib/contract/Message';

/**
 * Returns item corresponding to the id passed for the expanded thread or itempart.
 * @param id node id of itempart for second level expansion, or thread id if first level expansion
 * @param isFirstLevelExpansion
 */
export default function getItemForMailList(id: string, isFirstLevelExpansion: boolean): Message {
    return isFirstLevelExpansion ? mailStore.items.get(id) : getItemToShowFromNodeId(id);
}
