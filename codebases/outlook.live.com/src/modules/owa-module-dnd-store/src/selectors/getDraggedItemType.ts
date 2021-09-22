import getStore from '../store/store';
export default function getDraggedItemType(): string | null {
    return getStore().draggedItemType;
}
