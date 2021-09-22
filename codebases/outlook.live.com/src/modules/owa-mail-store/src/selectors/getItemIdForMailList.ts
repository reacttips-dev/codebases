import { getItemToShowFromNodeId } from '../utils/conversationsUtils';

/**
 * Returns item id corresponding to the id passed for the expanded thread or itempart.
 * @param id node id of itempart for second level expansion, or thread id if first level expansion
 * @param isFirstLevelExpansion
 */
export default function getItemIdForMailList(id: string, isFirstLevelExpansion: boolean): string {
    return isFirstLevelExpansion ? id : getItemToShowFromNodeId(id)?.ItemId.Id;
}
