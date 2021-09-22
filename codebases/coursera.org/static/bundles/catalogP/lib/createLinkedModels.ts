/* eslint-disable no-shadow */

import _ from 'underscore';

import resources from 'bundles/catalogP/lib/resources';

/*
 * Takes a CatalogP response with deeply-linked models, and wires up all of the relationships
 * without duplicating any models in memory.
 */
const createLinkedModels = function (resourceName: $TSFixMe, json: $TSFixMe) {
  // The tempModelIdStore is used to hold the ids of related models for created models
  // Resources come in with a property (such as instructors) that is a list of ids.
  // We overwrite this with an instructor collection, but don't want to lose track of those ids
  const tempModelIdStore = {};

  const createRelatedCollections = function (resourceType: $TSFixMe, model: $TSFixMe) {
    // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
    tempModelIdStore[model.cid] = {};
    _(model.includes).each(function (includeData, name) {
      const resourceType = includeData.resource;
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      const CollectionType = resources[resourceType];
      // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
      tempModelIdStore[model.cid][name] = model.get(includeData.attribute);
      model.set(name, new CollectionType());
    });
  };

  // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
  const MainCollectionClass = resources[resourceName];
  const MainModelClass = MainCollectionClass && MainCollectionClass.prototype.model;

  const tempModels = _(resources)
    .chain()
    .map(function (CollectionType, resourceType) {
      return [resourceType, new CollectionType()];
    })
    .object()
    .value();

  tempModels[MainModelClass.prototype.resourceName] = new MainCollectionClass(json.elements);

  tempModels[MainModelClass.prototype.resourceName].each(function (element: $TSFixMe) {
    createRelatedCollections(MainModelClass.prototype.resourceName, element);
  });

  // Create a model for each linked element, and add it to the appropriate collection
  _(json.linked).each(function (linkedElements, resourceType) {
    const collection = tempModels[resourceType];

    if (collection !== undefined) {
      collection.add(linkedElements);

      collection.each(function (element: $TSFixMe) {
        createRelatedCollections(resourceType, element);
      });
    }
  });

  // Wire up the relationships for each linked model's links
  _(tempModels).each(function (collection, resourceName) {
    collection.each(function (model: $TSFixMe) {
      _(model.includes).each(function (includeData, include) {
        // @ts-ignore ts-migrate(7053) FIXME: Element implicitly has an 'any' type because expre... Remove this comment to see the full error message
        const ids = tempModelIdStore[model.cid][include];
        if (ids) {
          if (_(ids).isArray()) {
            const models = _(ids)
              .chain()
              .map(function (id) {
                return tempModels[includeData.resource].get(id);
              })
              .compact()
              .value();
            model.get(include).add(models);
          } else {
            model.set(include, tempModels[includeData.resource].get(ids));
          }
        } else {
          model.unset(include);
        }
      });
    });
  });

  return tempModels[resourceName];
};

export default createLinkedModels;
