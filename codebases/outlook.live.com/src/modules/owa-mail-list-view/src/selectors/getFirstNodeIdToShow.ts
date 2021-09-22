import getItemForMailList from 'owa-mail-store/lib/selectors/getItemForMailList';

export default function getFirstNodeIdToShow(
    nodeIds: string[],
    isFirstLevelExpansion: boolean
): string {
    for (const nodeId of nodeIds) {
        if (getItemForMailList(nodeId, isFirstLevelExpansion)) {
            return nodeId;
        }
    }
    return null;
}
