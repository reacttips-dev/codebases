const WRITE = 'write',
  READ = 'read',
  DELETE = 'delete',
  ACTIONS = [WRITE, READ, DELETE];


/**
 *
 * @param {String} userId
 * @param {String} action
 * @param {Object} entity
 * @param {Object} entity.owner
 * @param {String} entity.owner.id
 * @param {Object} entity.permissions
 * @param {Array<Object>} entity.permissions.users Each user object has an `id` & `access`
 * @param {Object} entity.permissions.team
 * @param {String} entity.permissions.team.id
 * @param {String} entity.permissions.team.access Can be 'read' or 'write'
 */
export function validate (userId, action, entity) {
  let permissions = entity && entity.permissions,
    ownerId = _.get(entity, 'owner.id') || entity.owner,
    customUserPermission;

  if (!(_.includes(ACTIONS, action) && entity)) {
    return false;
  }

  if (userId === ownerId) {
    return true;
  }

  if (action === DELETE) { // only owner has delete permision on collection
    return false;
  }

  if (_.isEmpty(permissions) || _.isEmpty(permissions.team)) {
    return false;
  }

  customUserPermission = _.filter(permissions.users, (user) => {
    return user.id === userId;
  });
  if (!_.isEmpty(customUserPermission)) {
    return customUserPermission[0].access === action;
  }
  return permissions.team.access === action;
}
