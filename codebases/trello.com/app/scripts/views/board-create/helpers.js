/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const BluebirdPromise = require('bluebird');
const _ = require('underscore');
const { Backgrounds } = require('app/scripts/data/backgrounds');
const { Auth } = require('app/scripts/db/auth');
const { ModelLoader } = require('app/scripts/db/model-loader');
const { Util } = require('app/scripts/lib/util');
const { unsplashClient } = require('@trello/unsplash');
const { featureFlagClient } = require('@trello/feature-flag-client');

const PRELOAD_PHOTO_EXPIRATION = Util.getMs({ hours: 1 });
const PRELOAD_PERMISSION_EXPIRATION = Util.getMs({ minutes: 1 });

const expirePermissionCache = () =>
  (module.exports.preloadPermissions.cache = {});
const bindOrganizationListListener = _.once(() =>
  Auth.me().organizationList.on('add remove', expirePermissionCache),
);

class Background {
  static initClass() {
    this.prototype.isColor = false;
    this.prototype.isPhoto = false;
  }

  constructor(value, metadata) {
    this.value = value;
    this.metadata = metadata;
  }
}
Background.initClass();

class Color extends Background {
  static initClass() {
    this.prototype.isColor = true;
  }
}
Color.initClass();

class Photo extends Background {
  static initClass() {
    this.prototype.isPhoto = true;
  }
}
Photo.initClass();

module.exports = {
  Color,
  Photo,

  createPhotoFromResponse(response) {
    return new Photo(
      unsplashClient.appendImageParameters(response.urls.raw),
      response,
    );
  },

  createBackgroundStyle(background, options) {
    if (background.isColor) {
      return { backgroundColor: background.metadata.color };
    } else if (background.isPhoto) {
      return { backgroundImage: `url('${background.metadata.urls.small}')` };
    }
  },

  createColors() {
    return Object.keys(Backgrounds)
      .filter((key) => Backgrounds[key].color != null)
      .map((key) => new Color(key, Backgrounds[key]));
  },

  preloadPermissions: _.memoize(function (idOrg) {
    // Expire memoization cache so we don't keep stale responses around too long
    let needle;
    bindOrganizationListListener();
    setTimeout(expirePermissionCache, PRELOAD_PERMISSION_EXPIRATION);

    const orgs = Auth.me().organizationList.models;

    if (
      featureFlagClient.get(
        'teamplates.web.preload-permissions-with-single-request',
        false,
      )
    ) {
      return ModelLoader.loadMyOrganizationsMinimal();
    }

    const promises = orgs.map(function (org) {
      if (
        org.get('memberships') != null &&
        org.get('products') != null &&
        org.isFeatureEnabled('restrictVis')
      ) {
        return BluebirdPromise.resolve(org);
      } else {
        return ModelLoader.loadOrganizationMinimal(org.id);
      }
    });

    if (
      idOrg != null &&
      ((needle = idOrg), !Array.from(_.pluck(orgs, 'id')).includes(needle))
    ) {
      promises.push(ModelLoader.loadOrganizationMinimal(idOrg));
    }

    return BluebirdPromise.all(promises);
  }),

  preloadPhotos: _.memoize(function () {
    // Expire memoization cache so we don't keep stale responses around too long
    setTimeout(
      () => (module.exports.preloadPhotos.cache = {}),
      PRELOAD_PHOTO_EXPIRATION,
    );

    return unsplashClient.getDefaultCollectionPhotos().then((response) =>
      // Preload photos visible on initial create board screen then resolve with the initial response
      BluebirdPromise.map(response.slice(0, 4), (photo) =>
        Util.waitForImageLoad(photo.urls.small),
      ).then(() => response),
    );
  }),

  preloadData() {
    this.preloadPermissions();
    return this.preloadPhotos();
  },
};
