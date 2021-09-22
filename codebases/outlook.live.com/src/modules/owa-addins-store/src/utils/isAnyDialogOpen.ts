import getDisplayDialog from '../selectors/getDisplayDialog';

export default function isAnyDialogOpen(hostItemIndex: string): boolean {
    const dialog = getDisplayDialog(hostItemIndex);
    return !!dialog;
}
