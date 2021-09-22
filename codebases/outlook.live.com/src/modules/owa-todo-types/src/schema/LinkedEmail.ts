/**
 * This is a user type that contains the minimum information needed to create an email type linked entity on a task.
 * (Other linked entity properties can be extrapolated in order to create and save a full email-type LinkedEntity)
 *
 * We store `LinkedEmail`s on `Todo` objects, and convert these to email-type `LinkedEntity` properties when the `Todo` object is
 * converted to a `Task` object to be persisted server side.
 *
 * Similarly, when fetching `Task` objects, we convert any email-type `LinkedEntity` properties to `LinkedEmail` properties when creating `Todo` objects type
 * for consistancy.
 */
export interface LinkedEmail {
    Id: string /** EWS itemId associated with an email */;
    EntitySubtype: string;
    DisplayName: string;
}

export const DRAGGED_EMAIL_ENTITY_SUBTYPE = 'dragged_email';
export const HIGHLIGH_TASK_ENTITY_SUBTYPE = 'highlight_from_email';
export const CONTEXT_MENU_EMAIL_ENTITY_SUBTYPE = 'context_menu_email';
