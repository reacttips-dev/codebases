// These are the possible sources of selection.
enum MailListItemSelectionSource {
    Auto, // Auto-selection of mail list item
    CommandBarArrows, // Up / down arrows in command bar when in immersive RP
    KeyboardUpDown, // Keyboard up / down arrows
    KeyboardEnter, // Keyboard hotkey for opening an email in reading pane
    KeyboardShiftEnter, // Keyboard hotkey for opening an email in popout
    KeyboardCtrlSpace, // Keyboard hotkey for toggling selection on mail item
    MailListItemBody, // Clicking on the mail list item (but not checkbox or twisty)
    MailListItemBodyDoubleClick, // Double clicking on the mail list item (but not checkbox or twisty)
    MailListItemCheckbox, // Checkbox
    MailListItemContextMenu, // Right click on mail list item context menu
    MailListItemExpansion, // Click on mail list item expansion item
    MailListItemRichPreview, // Click on mail item attachment preview (used to check if ctrl/shift key pressed)
    MailListItemTwisty, // Twisty button to trigger expansion of item parts
    NewConversation, // Selection of newly arrived conversations
    Reset, // Reset of selection
    RowRemoval, // Row removal
    ImmersiveReadingPaneDelete, // Row removal while the reading pane is open in single line view
    RouteHandler, // Route handler
    ToggleCheckAll, // Select all
    MessageAd, // Select Message Ad
    SearchSuggestionClick, // Click on a search suggestion
    SingleLineClearSelection, // Clear selection in mail list header
    KeyboardHome, // Keyboard hotkey for selecting first row
    KeyboardEnd, // Keyboard hotkey for selecting last loaded row
    /* Add new sources here to not mess up logging */
}
export default MailListItemSelectionSource;
