import getStore from '../store/store';
import type { MailFolder } from 'owa-graph-schema';
import type { ObservableMap } from 'mobx';

export default function getFolderTable(): ObservableMap<string, MailFolder> {
    return getStore().folderTable;
}
