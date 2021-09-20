/* eslint-disable
    eqeqeq,
    @typescript-eslint/no-use-before-define,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const _ = require('underscore');
const pluginValidators = require('app/scripts/lib/plugins/plugin-validators');
const PluginView = require('app/scripts/views/plugin/plugin-view');
const PluginIOCache = require('app/scripts/views/internal/plugins/plugin-io-cache');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'plugin_section',
);
const {
  sendPluginUIEvent,
} = require('app/scripts/lib/plugins/plugin-behavioral-analytics');

const template = t.renderable(function ({
  icon,
  text,
  image,
  url,
  subtext,
  thumbnail,
  idPlugin,
  actions,
}) {
  const plugin = PluginIOCache.fromId(idPlugin);
  t.div('.comment-unfurl.js-comment-unfurl', function () {
    t.div('.comment-unfurl-thumb', {
      style: t.stylify({
        'background-image': (() => {
          if (thumbnail) {
            return t.urlify(thumbnail);
          } else if (image != null ? image.url : undefined) {
            return t.urlify(image.url);
          } else if (icon) {
            return t.urlify(icon);
          } else if (
            pluginValidators.isValidUrlForCSSImage(
              __guard__(plugin != null ? plugin.icon : undefined, (x) => x.url),
            )
          ) {
            return t.urlify(plugin.icon.url);
          }
        })(),
        'background-position-y':
          (image != null ? image.y : undefined) === 'top' ? '0px' : undefined,
        'background-position-x':
          (image != null ? image.x : undefined) === 'left' ? '0px' : undefined,
        'background-size': (() => {
          if (!thumbnail && !(image != null ? image.url : undefined)) {
            return 'auto 40px';
          } else {
            switch (image != null ? image.size : undefined) {
              case 'contain':
                return 'contain';
              case 'original':
                return 'inherit';
              default:
                return 'cover';
            }
          }
        })(),
      }),
    });
    return t.div('.comment-unfurl-meta', function () {
      t.span('.comment-unfurl-title', () => t.text(text));
      t.span('.comment-unfurl-subtext', { title: subtext }, () =>
        t.text(subtext),
      );
      return t.div('.comment-unfurl-media', function () {
        t.div('.comment-unfurl-plugin-icon', function () {
          if (
            pluginValidators.isValidUrlForImage(
              __guard__(
                plugin != null ? plugin.icon : undefined,
                (x1) => x1.url,
              ),
            )
          ) {
            t.img({ src: plugin.icon.url });
          }
          return t.span('.comment-unfurl-plugin-name', () =>
            t.text(PluginIOCache.fromId(idPlugin).name),
          );
        });
        return t.div('.comment-unfurl-button-block', () =>
          actions != null
            ? actions.map(function (action, i) {
                if (action.url) {
                  return t.a(
                    {
                      href: action.url,
                      title: text,
                      rel: 'noopener noreferrer',
                      target: '_blank',
                    },
                    () => action.text,
                  );
                } else {
                  return t.button(
                    '.js-comment-preview-button',
                    { 'data-index': i, title: action.text },
                    action.text,
                  );
                }
              })
            : undefined,
        );
      });
    });
  });
});

module.exports = (function () {
  class CommentUnfurlPreview extends PluginView {
    static initClass() {
      this.prototype.events = {
        'click .js-comment-unfurl': 'clickCommentUnfurl',
        'click .js-comment-preview-button': 'executeActionCallback',
      };
    }
    constructor(props) {
      super(props);
      this.render = this.render.bind(this);
    }

    initialize({ commentUnfurl }) {
      this.commentUnfurl = commentUnfurl;
      return this.retain(this.commentUnfurl);
    }

    render() {
      this.$el.html(template(this.commentUnfurl));
      return this;
    }

    clickCommentUnfurl(e) {
      if (_.isFunction(this.commentUnfurl.callback)) {
        e.preventDefault();
        return this.commentUnfurl.callback({
          el: e.currentTarget,
        });
      } else if (e.target.tagName !== 'A') {
        return window.open(this.commentUnfurl.url);
      }
    }

    executeActionCallback(e) {
      e.stopPropagation();
      const index = parseInt(this.$(e.currentTarget).attr('data-index'), 10);
      const action = this.commentUnfurl.actions[index];
      sendPluginUIEvent(this.commentUnfurl.idPlugin, {
        action: 'clicked',
        actionSubject: 'button',
        source: 'cardDetailScreen',
        actionSubjectId: 'unfurlActionButton',
        objectType: 'powerUp',
        objectId: this.commentUnfurl.idPlugin,
      });
      if (action.callback != null) {
        e.preventDefault();
        return action.callback({
          el: e.currentTarget,
        });
      }
    }
  }
  CommentUnfurlPreview.initClass();
  return CommentUnfurlPreview;
})();

function __guard__(value, transform) {
  return typeof value !== 'undefined' && value !== null
    ? transform(value)
    : undefined;
}
