import { action } from 'satcheljs';

export let openNotesFolder = action('OPEN_NOTES_FOLDER', (actionSource: string) => ({
    actionSource,
}));
