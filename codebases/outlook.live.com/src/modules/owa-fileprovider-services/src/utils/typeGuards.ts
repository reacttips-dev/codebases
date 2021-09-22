import type BoxItem from '../types/BoxItem';
import type {
    default as DropboxItem,
    DropboxFileItem,
    DropboxFolderItem,
    DropboxDeletedItem,
} from '../types/DropboxItem';

export function isDropboxFileItem(item: DropboxItem): item is DropboxFileItem {
    return item['.tag'] === 'file';
}

export function isDropboxFolderItem(item: DropboxItem): item is DropboxFolderItem {
    return item['.tag'] === 'folder';
}

export function isDropboxDeletedItem(item: DropboxItem): item is DropboxDeletedItem {
    return item['.tag'] === 'deleted';
}

export function isBoxFileItem(item: BoxItem): boolean {
    return item.type === 'file';
}

export function isBoxFolderItem(item: BoxItem): boolean {
    return item.type === 'folder';
}
