// Add action type constant value here
export const actionConstants = {
  PUBLISH_API_ACTION: 'publishApi'
};

/**
 * Add another action as an object in the list here.
 * Action object structure should be like
 * {
 *  type: string,  ...type of action to perform
 *  value: bool, ...default boolean value to show if the option is enabled or disabled. If enabled, then only it will be executed
 *  label: string, ...label to be shown to the user
 *  description: string  ...description text to be shown to the user
 * }
 */
export const AFTER_IMPORT_ACTIONS = [{
    type: actionConstants.PUBLISH_API_ACTION,
    value: true,
    label: 'Publish imported APIs to Private API Network',
    description: 'Make these APIs easy for your teammates to find by sharing them to your team\'s Private API Network.'
  }
];
