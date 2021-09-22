import getStore from '../store';

export default function getNotesEditorViewState(id: string) {
    return getStore().meetingIdToNotesViewStateMap.get(id);
}
