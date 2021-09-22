///////////////////// PLEASE READ /////////////////////
/////// Draggable item types need to be strings ///////
///////// They also need to be all lowercase //////////
// This ensures compatability with custom MIME types //
////////// This exclused the "LocalFile" type /////////
///////////// It is a reserved MIME type //////////////
///////////////////////////////////////////////////////
export const DraggableItemTypes = {
    FavoriteNode: 'favoritenode',
    InboxRule: 'inboxrule',
    MessageRule: 'messagerule',
    LocalFile: 'Files',
    MailFolderNode: 'mailfoldernode',
    MailListItemPart: 'maillistitempart',
    MailListRow: 'maillistrow', // Use when one row is dragged from a listview
    MultiMailListConversationRows: 'multimaillistconversationrows', // Use when multiple rows are dragged at once from conversation listview
    MultiMailListMessageRows: 'multimaillistmessagerows', // Use when multiple rows are dragged at once from message listview
    ReadWriteRecipient: 'recipient',
    RibbonCustomizerButton: 'ribboncustomizerbutton',
    NoteFeedItem: 'notefeeditem',
    Todo: 'todo',
    Attachment: 'attachment',
    CommandBarEditorButton: 'commandbareditorbutton',
    CalendarNode: 'calendarnode',
    CalendarGroupNode: 'calendargroupnode',
    CalendarItem: 'calendaritem',
};
