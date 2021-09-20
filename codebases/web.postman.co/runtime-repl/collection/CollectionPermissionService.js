// @TODO Importing CollectionController directly causes issues only in shared process (circular dependency?)
import EnvironmentController from '@@runtime-repl/environment/datastores/controllers/EnvironmentController';
import { createEvent, getEventData } from '@postman-app-monolith/renderer/js/modules/model-event';
import { validate } from '@postman-app-monolith/renderer/js/utils/PermissionsUtils';
import UserController from '@postman-app-monolith/renderer/js/modules/controllers/UserController';
import CollectionController from '@@runtime-repl/collection/datastores/controllers/CollectionController';

const COLLECTION = 'collection',
  SHARED = 'shared',
  UNSHARED = 'unshared',
  WRITE = 'write',
  READ = 'read',
  DELETE = 'delete',
  REQUEST = 'request',
  RESPONSE = 'response',
  FOLDER = 'folder',
  ENVIRONMENT = 'environment',
  COLLECTION_MODELS = [COLLECTION, REQUEST, RESPONSE, FOLDER],
  ENTITIES = [ENVIRONMENT].concat(COLLECTION_MODELS),
  ACTIONS = [WRITE, READ, DELETE],

  CollectionPermissionService = {

    /**
   *
   * @param {Object} criteria
   * @param {Object} permissions
   * @returns {Promise}
   */
    share (criteria, permissions) {
      return UserController
        .get()
        .then((userData) => {
          // Logged in need to be check
          if (!(userData && userData.id !== '0')) {
            return Promise.reject(
              new Error('CollectionPermissionService~share:' +
                    'Need to be logged in to share collection.')
            );
          }

          // Check for initial sanity check
          // Availability of permissions object
          if (_.isEmpty(permissions)) {
            return Promise.reject(
              new Error('CollectionPermissionService~share:' +
                    'Permissions information should not be empty.')
            );
          }

          if (!_.isObject(permissions)) {
            return Promise.reject(
              new Error('CollectionPermissionService~share:' +
                    'Permissions information should not be a type of object.')
            );
          }

          const teamId = _.get(permissions, 'team.id'),
            teamAccess = _.get(permissions, 'team.access');

          // Check for team id info in the permissions object
          if (_.isEmpty(teamId)) {
            return Promise.reject(
              new Error('CollectionPermissionService~share:' +
                    'Team id information is not available in permissions data.')
            );
          }

          // Check for team access information and it should be either write or read others are invalid
          if (!_.includes(ACTIONS, teamAccess)) {
            return Promise.reject(
              new Error('CollectionPermissionService~share:' +
                    `Team access information should be one of any [${ACTIONS.join(', ')}] but got ${teamAccess}`)
            );
          }

          const usersPermission = _.get(permissions, 'users') || [];

          // Users access information should be an array, bail out if it is not.
          if (!_.isArray(usersPermission)) {
            return Promise.reject(
              new Error('CollectionPermissionService~share:' +
                    'Invalid users access information, permissions.users should be an array.')
            );
          }

          try {
            // Now check for the sanity of this data for all user permissions.
            _.forEach(usersPermission, (userPermission) => {
              const userId = _.get(userPermission, 'id'),
                userAccess = _.get(userPermission, 'access');

              // Check for user id info in the permissions object
              if (_.isEmpty(userId)) {
                throw new Error('CollectionPermissionService~share:' +
                        'user id information is not available in user permissions data.');
              }

              // Check for user access information and it should be either write or read others are invalid
              if (!_.includes(ACTIONS, userAccess)) {
                throw new Error('CollectionPermissionService~share:' +
                        `User[${userId}] access information should be one of any [${ACTIONS.join(', ')}] but got ${userAccess}`);
              }
            });
          } catch (e) {
            return Promise.reject(e);
          }

          // If all goes well then hit the db
          return CollectionController
            .getCollection(criteria)
            .then((collection) => {
              if (!collection) {
                return;
              }

              return CollectionController.updateCollection({ id: criteria.id, shared: true, permissions });
            })
            .then((updatedEvents) => {
              let updatedCollectionEvent = _.find(updatedEvents, { name: 'updated', namespace: 'collection' }),
                collectionSharedEvent;

              if (!updatedCollectionEvent) {
                return;
              }

              // send the additional shared event, to process the instruction
              collectionSharedEvent = createEvent(SHARED, COLLECTION, {
                model: 'collection',
                collection: { id: criteria.id },
                permissions: _.get(getEventData(updatedCollectionEvent), 'permissions')
              }, updatedEvents);

              return collectionSharedEvent;
            });
        })
        .catch((e) => {
          pm.logger.error('Error in getting user information', e);
        });
    },

    /**
   *
   * @param {Object} criteria
   */
    unshare (criteria) {
      return UserController
        .get()
        .then((userData) => {
        // Logged in need to be check
          if (!userData.id === '0') {
            return Promise.reject(
              new Error('CollectionPermissionService~unshare:' +
                            'Need to be logged in to unshare collection.')
            );
          }

          // If all goes well then hit the db
          return CollectionController
            .getCollection(criteria)
            .then((collection) => {
              if (!collection) {
                return Promise.reject(
                  new Error('CollectionPermissionService~unshare:' +
                                'Could not find collection to unshare from criteria provided.')
                );
              }
            })
            .then(() => CollectionController.updateCollection({ id: criteria.id, shared: false, permissions: {} }))
            .then((updatedEvents) => {
              let updatedCollectionEvent = _.find(updatedEvents, { name: 'updated', namespace: 'collection' }),
                collectionSharedEvent;

              if (!updatedCollectionEvent) {
                return;
              }

              // send the additional unshared event, to process the instruction
              collectionSharedEvent = createEvent(UNSHARED, COLLECTION, { model: 'collection', collection: { id: criteria.id } }, updatedEvents);

              return collectionSharedEvent;
            });
        });
    },

    /**
   * Returns the root collection for a given request, response or folder
   */
    getRootNode (entityType, entityId) {
      if (!_.includes(COLLECTION_MODELS, entityType)) {
        return Promise.reject(
          new Error(`PermissionService~getRootNode: entityType should be a one of [${COLLECTION_MODELS.join(', ')}] but got '${entityType}'`)
        );
      }

      if (!entityId) {
        return Promise.reject(
          new Error('PermissionService~getRootNode: entityId is empty')
        );
      }

      switch (entityType) {
        case 'collection':
          return CollectionController.getCollection({ id: entityId });

        case 'request':
          return CollectionController.getRequest({ id: entityId })
            .then((request) => {
              if (!request) {
                return Promise.reject(
                  new Error(`PermissionService~getRootNode: request not found for id: '${entityId}'`)
                );
              }

              if (!request.collection) {
                return Promise.reject(
                  new Error(`PermissionService~getRootNode: collection not found for '${entityType}' '${entityId}'`)
                );
              }

              return request;
            })
            .then((request) => CollectionController.getCollection({ id: request.collection }));

        case 'response':
          return CollectionController.getResponse({ id: entityId })
            .then((response) => {
              if (!response) {
                return Promise.reject(
                  new Error(`PermissionService~getRootNode: response not found for id: '${entityId}'`)
                );
              }

              if (!response.collection) {
                return Promise.reject(
                  new Error(`PermissionService~getRootNode: collection not found for '${entityType}' '${entityId}'`)
                );
              }

              return response;
            })
            .then((response) => CollectionController.getCollection({ id: response.collection }));

        case 'folder':
          return CollectionController.getFolder({ id: entityId })
            .then((folder) => {
              if (!folder) {
                return Promise.reject(
                  new Error(`PermissionService~getRootNode: folder not found for id: '${entityId}'`)
                );
              }

              if (!folder.collection) {
                return Promise.reject(
                  new Error(`PermissionService~getRootNode: collection not found for '${entityType}' '${entityId}'`)
                );
              }

              return folder;
            })
            .then((folder) => CollectionController.getCollection({ id: folder.collection }));

        default:
      }
    },

    /**
   * Checks the specific `action` permission on an entity of type `entityType`and id `entityId`
   * @param {*} entityType
   * @param {*} entityId
   * @param {*} action
   * @param {*} userId
   */
    checkPermission (entityType, entityId, action, userId) {
      if (!_.includes(ENTITIES, entityType)) {
        return Promise.reject(
          new Error('PermissionService~checkPermission: ' +
          `entityType should be a one of [${ENTITIES.join(', ')}] but received '${entityType}'`)
        );
      }

      if (!_.includes(ACTIONS, action)) {
        return Promise.reject(
          new Error('PermissionService~checkPermission: ' +
          `action should be a one of [${ACTIONS.join(', ')}] but received ${action}`)
        );
      }

      if (_.includes(COLLECTION_MODELS, entityType)) {
        return this.getRootNode(entityType, entityId)
          .then((collection) => {
            if (!collection) {
              return Promise.reject(
                new Error('PermissionService~checkPermission: Could not find collection to check permissions ' +
                        `using the criteria provided (entityType: ${entityType} and entityId: ${entityId})`)
              );
            }

            return collection;
          })
          .then((collection) => Promise.resolve(
            this.validate(userId, action, collection)
          ));
      }

      if (entityType === 'environment') {
        if (action !== 'delete') {
          return Promise.reject(
            new Error('PermissionService~checkPermission: ' +
            `action should be one of ['delete'] but received '${action}'`)
          );
        }

        return EnvironmentController.get({ id: entityId })
          .then((environment) => {
            if (!environment) {
              return Promise.reject(
                new Error('PermissionService~checkPermission: Could not find environment to check permissions ' +
                        `using the criteria provided (entityType: ${entityType} and entityId: ${entityId})`)
              );
            }

            return environment;
          })
          .then((environment) => Promise.resolve(environment.owner === userId));
      }
    },

    validate
  };

export default CollectionPermissionService;
