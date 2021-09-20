/* eslint-disable
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS204: Change includes calls to have a more natural evaluation order
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');
const { KnownServices } = require('app/scripts/db/known-services');
const PluginRunner = require('app/scripts/views/internal/plugins/plugin-runner');
const Promise = require('bluebird');
const _ = require('underscore');
const t = require('app/scripts/views/internal/teacup-with-helpers')();
const { ModelCache } = require('app/scripts/db/model-cache');
const parseUrl = require('url-parse');
const {
  sendPluginTrackEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const {
  SmartLinksBridge,
} = require('app/scripts/views/internal/smart-links-bridge');
const React = require('react');

const formatCache = new window.Map();
const formatRequestCache = new window.Map();

const generateFriendlyLinkAnalyticsPayload = (application, meta) => ({
  application,
  resourceType: meta?.resolvedUrl?.meta?.resourceType,
  visibility: meta?.resolvedUrl?.meta?.visibility,
});

const handleFriendlyLinkClick = ({ application, meta }) => {
  Analytics.sendClickedLinkEvent({
    linkName: 'friendlyLink',
    source: getScreenFromUrl(),
    attributes: generateFriendlyLinkAnalyticsPayload(application, meta),
  });
};

const handleFriendlyLinkRender = ({ application, meta }) => {
  Analytics.sendOperationalEvent({
    action: 'rendered',
    actionSubject: 'friendlyLink',
    source: getScreenFromUrl(),
    attributes: generateFriendlyLinkAnalyticsPayload(application, meta),
  });
};

const template = t.renderable(function ({ icon, text, idPlugin, monochrome }) {
  t.img({
    class: t.classify({
      'known-service-icon': true,
      'plugin-icon': idPlugin != null,
      'mod-reset': monochrome === false,
    }),
    src: icon,
  });
  return t.text(text);
});

module.exports = function (el, board, options = {}) {
  let els =
    (el.tagName != null) === 'A' ? [el] : _.toArray(el.querySelectorAll('a'));

  els = el?.tagName === 'A' ? [el] : _.toArray(el.querySelectorAll('a'));

  return Promise.map(els, function (el) {
    // The URL serializer in HTMLHyperlinkElementUtils.href
    // (https://url.spec.whatwg.org/#concept-url-serializer) appends a slash
    // to the base url e.g. <a href="http://www.trello.com">Trello</a>
    // will return http://www.trello.com/. Unfortunately, this breaks any
    // comparison we make with the link's actual text node if the URL supplied
    // is a base URL with no trailing slash.
    const parsedUrl = parseUrl(el.href);
    const url =
      el.textContent === parsedUrl.origin ? parsedUrl.origin : parsedUrl.href;

    // If the link already has custom text, leave it alone.
    if (url !== el.textContent) {
      // In some cases, the href is escaped and the textContent
      // isn't, so also check against the decoded url.
      try {
        const decoded = decodeURIComponent(url);
        if (decoded !== el.textContent) {
          // Neither the original URL nor the decoded URL match the
          // text, assume they have custom text and don't change it
          return;
        }
      } catch (ignored) {
        // Don't worry if the URL can't be decoded and assume they've
        // got custom text
        return;
      }
    }

    const cacheKey = `${board != null ? board.id : undefined}:${url}`;

    return Promise.try(function () {
      if (!board) {
        throw new PluginRunner.Error.NotHandled('no board specified');
      }

      if (formatCache.get(cacheKey)) {
        return formatCache.get(cacheKey);
      }

      if (formatRequestCache.get(cacheKey)) {
        return formatRequestCache.get(cacheKey);
      }

      const formatRequest = PluginRunner.one({
        command: 'format-url',
        board,
        options: {
          url,
        },
      });

      formatRequestCache.set(cacheKey, formatRequest);
      return formatRequest;
    })
      .catch(PluginRunner.Error.NotHandled, () => null)
      .then(function (pluginResult) {
        formatRequestCache.delete(cacheKey);
        if ((pluginResult != null ? pluginResult.text : undefined) != null) {
          // there might not be an idPlugin because we are attaching a trello card
          // not a link that is being formatted by a power-up
          if (pluginResult.idPlugin) {
            sendPluginTrackEvent({
              idPlugin: pluginResult.idPlugin,
              idBoard: board.id,
              event: {
                action: 'formatted',
                actionSubject: 'url',
                source: 'powerUpFormatUrl',
              },
            });
          }

          return pluginResult;
        } else {
          return KnownServices.interpret(el.href, ModelCache, {
            sourceComponent: 'atlaskit-smart-card',
          });
        }
      })
      .then(function (known) {
        if (known != null) {
          formatCache.set(cacheKey, known);
          // resolved data comes from KnownServices.interpret
          if (known.url) {
            el.classList.add('atlaskit-smart-link');
            return renderComponent(
              React.createElement(SmartLinksBridge, {
                url: known.url,
                analyticsContext: options.analyticsContext,
              }),
              el,
            );
          }
          // else from pluginResult
          el.classList.add('known-service-link');
          handleFriendlyLinkRender(known);
          el.addEventListener('click', handleFriendlyLinkClick(known));
          return (el.innerHTML = template(known));
        }
      });
  });
};
