import { action } from 'satcheljs/lib/legacy';
import { getStore } from '../store/Store';

export let showFilterDropDownContextMenu = action('showFilterDropDownContextMenu')(
    function (): void {
        getStore().filterContextMenuDisplayState = true;
    }
);

export let hideFilterDropDownContextMenu = action('hideFilterDropDownContextMenu')(
    function (): void {
        getStore().filterContextMenuDisplayState = false;
    }
);
