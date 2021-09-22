import { get } from './nonObservableStoreUtils';

export default function getGroupSets() {
    return get().groups;
}
