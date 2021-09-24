'use es6';

import _classCallCheck from "@babel/runtime/helpers/esm/classCallCheck";
import _createClass from "@babel/runtime/helpers/esm/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/esm/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/esm/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/esm/inherits";
import { List, OrderedMap, Record, fromJS, Map as ImmutableMap } from 'immutable';
import { pick } from 'underscore';
import { ACCOUNT_TYPES, COMPOSER_EDITABLE_LINK_PREVIEW_NETWORKS } from '../../lib/constants';
import ImageInfo from './ImageInfo';
import { parseUrl } from 'hub-http/helpers/url';
var DEFAULTS = {
  images: OrderedMap(),
  title: null,
  description: null,
  url: null,
  hubspotCampaignId: null,
  hubspotContentId: null,
  hubspotPortalId: null,
  twitterHandles: List(),
  success: null,
  loading: false,
  isBlogPostCustomization: null,
  twitterCard: null,
  imageForNetworks: ImmutableMap(),
  metaTags: ImmutableMap()
}; // attempt to suppress tracking pixels, ads, etc

var IMAGE_BLACKLIST = ['pixel.gif', 'p.gif', 'doubleclick.net', 'pixel.quantserve.com', 'cdn.betrad.com', 'imrs.php', 'favicon.ico', 'transparent.gif', 'ajax-loader.gif', 'scorecardresearch.com', 'localhost'];

var PagePreview = /*#__PURE__*/function (_Record) {
  _inherits(PagePreview, _Record);

  function PagePreview() {
    _classCallCheck(this, PagePreview);

    return _possibleConstructorReturn(this, _getPrototypeOf(PagePreview).apply(this, arguments));
  }

  _createClass(PagePreview, [{
    key: "getValidImages",
    value: function getValidImages(network) {
      var isPhoto = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      // The only valid image for a twitterCard post is the one specified in
      // the twitter card.
      if (network === ACCOUNT_TYPES.twitter && !isPhoto) {
        if (this.twitterCard && this.twitterCard.get('image')) {
          return List.of(this.twitterCard.get('image').validate(network, isPhoto));
        }

        return List();
      }

      return this.images.map(function (i) {
        return i.validate(network, isPhoto);
      }).filter(function (i) {
        return !i.invalidReason;
      }).toList();
    } // this is the old getValidImages, renamed to getImagesWithInfo, which is still used in several parts of the code.

  }, {
    key: "getImagesWithInfo",
    value: function getImagesWithInfo(network) {
      var isPhoto = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

      // The only valid image for a twitterCard post is the one specified in
      // the twitter card.
      if (network === ACCOUNT_TYPES.twitter && !isPhoto) {
        if (this.twitterCard && this.twitterCard.get('image')) {
          return List.of(this.twitterCard.get('image').validate(network, isPhoto));
        }

        return List();
      } // do not filter images in this case, if first (featured) link preview image is invalid we have to show errors


      if (!isPhoto && !COMPOSER_EDITABLE_LINK_PREVIEW_NETWORKS.includes(network)) {
        return this.images.map(function (i) {
          return i.validate(network, isPhoto);
        }).toList();
      }

      return this.images.map(function (i) {
        return i.validate(network, isPhoto);
      }).filter(function (i) {
        return !i.invalidReason;
      }).toList();
    }
  }, {
    key: "isNetworkValidForPreview",
    value: function isNetworkValidForPreview(network) {
      // Tweets need a twitter card to have a valid preview
      if (this.isBlogPostCustomization || network !== ACCOUNT_TYPES.twitter) {
        return true;
      }

      if (!this.twitterCard) {
        return false;
      }

      return true;
    }
  }, {
    key: "getTitle",
    value: function getTitle(network) {
      if (network === ACCOUNT_TYPES.twitter) {
        return this.twitterCard ? this.twitterCard.get('title') : null;
      }

      return this.title;
    }
  }, {
    key: "getDescription",
    value: function getDescription(network) {
      if (network === ACCOUNT_TYPES.twitter) {
        return this.twitterCard ? this.twitterCard.get('description') : null;
      }

      return this.description;
    }
  }, {
    key: "hasImageForNetwork",
    value: function hasImageForNetwork(network) {
      return Boolean(this.imageForNetworks.get(network));
    }
  }], [{
    key: "createFrom",
    value: function createFrom(attrs) {
      var pagePreviewAttrs = pick(attrs, 'title', 'description', 'url', 'isBlogPostCustomization', 'success', 'hubspotCampaignId', 'hubspotContentId', 'hubspotPortalId', 'loading', 'metaTags');

      if (attrs.images) {
        var imageUrls = attrs.images.filter(function (imageUrl) {
          if (!PagePreview.isValidUrl(imageUrl)) {
            return false;
          }

          return true;
        }).map(function (url) {
          return url.split('#')[0];
        });
        pagePreviewAttrs.images = OrderedMap(imageUrls.map(function (url) {
          return [url, ImageInfo.createFrom({
            url: url
          })];
        }));
      }

      if (attrs.twitterHandles) {
        pagePreviewAttrs.twitterHandles = fromJS(attrs.twitterHandles);
      }

      if (attrs.twitterCard) {
        var twitterCard = fromJS(attrs.twitterCard);
        var twitterCardImageUrl = twitterCard.get('image');

        if (twitterCardImageUrl) {
          if (!PagePreview.isValidUrl(twitterCardImageUrl)) {
            twitterCard = twitterCard.delete('image');
          } else {
            twitterCard = twitterCard.set('image', ImageInfo.createFrom({
              url: twitterCardImageUrl
            }));
          }
        }

        pagePreviewAttrs.twitterCard = twitterCard;
      }

      if (attrs.metaTags) {
        pagePreviewAttrs.metaTags = ImmutableMap(attrs.metaTags.map(function (tag) {
          return [tag.name, tag.content];
        }));
      }

      return new PagePreview(pagePreviewAttrs);
    }
  }, {
    key: "isValidUrl",
    value: function isValidUrl(url) {
      if (IMAGE_BLACKLIST.some(function (fragment) {
        return url.includes(fragment);
      })) {
        return false;
      } // ensure url is absolute and well formed


      var parts = parseUrl(url);
      return Boolean(parts.protocol && parts.hostname);
    }
  }]);

  return PagePreview;
}(Record(DEFAULTS));

export { PagePreview as default };