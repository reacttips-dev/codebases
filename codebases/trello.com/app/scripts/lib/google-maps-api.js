/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { importWithRetry } = require('@trello/use-lazy-component');

const _ = require('underscore');
const Promise = require('bluebird');
const { Util } = require('app/scripts/lib/util');
const { googleMapsApiKey } = require('@trello/config');
const LOCATION_CLUSTER_SVG = require('resources/images/location-cluster.svg');
const MARKER_ICON_URL = require('resources/images/location-marker.png');
let MARKER_STYLE = `icon:${encodeURIComponent(MARKER_ICON_URL)}`;

// The Google Static Maps API needs to hit the image URL.
// They can't hit out localhost so let's just make it blue.
if (process.env.NODE_ENV === 'development') {
  MARKER_STYLE = 'color:blue';
}

class GoogleMapsApi {
  load() {
    if (this._loadGoogleMapsApiPromise == null) {
      this._loadGoogleMapsApiPromise = Promise.try(() => {
        if (window.google != null && window.google.maps != null) {
          return;
        }
        return Util.loadScript(
          `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`,
        );
      }).return();
    }

    if (this._loadMarkerClustererPromise == null) {
      this._loadMarkerClustererPromise = importWithRetry(() =>
        import(
          /* webpackChunkName: "google-marker-cluster-plus" */ '@googlemaps/markerclustererplus'
        ),
      )
        .then((m) => m.default)
        .then((library) => {
          this.MarkerClusterer = library;

          // Overide the cluster marker style because MarkerClusterer
          // builds the `url` dynamically with a relative path you pass
          // in a constructor option. This won't work for us because of
          // how we serve our static resources.
          return (this.MarkerClusterer.prototype.setupStyles_ = function () {
            if (this.styles_.length > 0) {
              return;
            }

            return _.times(this.imageSizes_.length, () => {
              return this.styles_.push({
                url: LOCATION_CLUSTER_SVG,
                height: 40,
                width: 40,
              });
            });
          });
        });
    }

    return Promise.all([
      this._loadGoogleMapsApiPromise,
      this._loadMarkerClustererPromise,
    ]);
  }

  createGeocoder() {
    return new window.google.maps.Geocoder();
  }

  createMap(containerId, options) {
    if (options == null) {
      options = {};
    }
    return this.load().then(() => {
      return new window.google.maps.Map(
        document.getElementById(containerId),
        options,
      );
    });
  }

  createLatLng(lat, lng) {
    return new window.google.maps.LatLng(lat, lng);
  }

  createLatLngBounds() {
    return new window.google.maps.LatLngBounds();
  }

  createMarker(options) {
    if (options == null) {
      options = {};
    }
    return new window.google.maps.Marker(options);
  }

  createMarkerClusterer(map, markers, opts) {
    if (opts == null) {
      opts = {};
    }
    if (!this.MarkerClusterer) {
      throw new Error(
        'MarkerClusterer is not yet loaded. You need to await googleMapsApi.load() first',
      );
    }
    return new this.MarkerClusterer(map, markers, opts);
  }

  createInfoWindow(options) {
    if (options == null) {
      options = {};
    }
    return new window.google.maps.InfoWindow(options);
  }

  getPlacesService() {
    return (
      this.placesService ??
      (this.placesService = new window.google.maps.places.PlacesService(
        document.createElement('div'),
      ))
    );
  }

  getAutocompleteService() {
    return (
      this.autocompleteService ??
      (this.autocompleteService = new window.google.maps.places.AutocompleteService())
    );
  }

  createPlacesSessionToken() {
    return new window.google.maps.places.AutocompleteSessionToken();
  }

  autocomplete(param) {
    if (param == null) {
      param = {};
    }
    const { input, sessionToken } = param;
    return this.load().then(() => {
      return new Promise((resolve, reject) => {
        return this.getAutocompleteService().getPlacePredictions(
          {
            input,
            sessionToken,
          },
          (predictions, status) => {
            if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
              return reject(status);
            }

            return resolve(predictions);
          },
        );
      });
    });
  }

  getPlaceDetails({ placeId, sessionToken, fields }) {
    return this.load().then(() => {
      return new Promise((resolve, reject) => {
        return this.getPlacesService().getDetails(
          {
            placeId,
            sessionToken,
            fields,
          },
          (place, status) => {
            if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
              return reject(status);
            }
            return resolve(place);
          },
        );
      });
    });
  }

  getStaticMap(param) {
    if (param == null) {
      param = {};
    }
    const { zoom, width, height, scale, markers } = param;
    let url = `https://maps.googleapis.com/maps/api/staticmap?key=${googleMapsApiKey}`;

    if (zoom != null) {
      url += `&zoom=${zoom}`;
    }
    if (width != null && height != null) {
      url += `&size=${width}x${height}`;
    }
    if (scale != null) {
      url += `&scale=${scale}`;
    }

    if (markers != null) {
      url += `&markers=${MARKER_STYLE}%7C`;
      _.each(markers, function ({ latitude, longitude }, index) {
        url += `${encodeURIComponent(latitude)}%2C${encodeURIComponent(
          longitude,
        )}`;
        if (index !== markers.length - 1) {
          return (url += '%7C');
        }
      });
    }

    return url;
  }

  getUrl(lat, lng) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      lat,
    )}%2C${encodeURIComponent(lng)}`;
  }
}

module.exports.googleMapsApi = new GoogleMapsApi();
