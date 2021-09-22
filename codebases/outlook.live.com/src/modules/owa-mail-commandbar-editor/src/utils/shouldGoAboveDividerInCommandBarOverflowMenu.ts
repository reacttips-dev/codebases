import { CommandBarAction } from 'owa-mail-commandbar-actions';

// There is a divider line in the overflow menu of the command bar
// Return true if action belongs above the divider line, otherwise false
export default function shouldGoAboveDividerInCommandBarOverflowMenu(
    action: CommandBarAction
): boolean {
    return (
        action !== CommandBarAction.Print &&
        action !== CommandBarAction.CreateRule &&
        action !== CommandBarAction.ShowImmersiveReader &&
        action !== CommandBarAction.Translate &&
        action !== CommandBarAction.AssignPolicy
    );
}
