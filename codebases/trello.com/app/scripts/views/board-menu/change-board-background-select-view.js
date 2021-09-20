// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const ColorsView = require('./change-board-background-colors-component-view');
const PhotosView = require('./change-board-background-photos-component-view');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const View = require('app/scripts/views/internal/view');
const xtend = require('xtend');
const { unsplashClient } = require('@trello/unsplash');

const Component = {
  colors: ColorsView,
  photos: PhotosView,
};

// Get background prefs
const getBackgroundPrefs = function (prefs) {
  const out = {};
  for (const key in prefs) {
    const value = prefs[key];
    if (key.indexOf('background') > -1) {
      out[key] = value;
    }
  }
  return out;
};

class BoardBackgroundSelectView extends View {
  static initClass() {
    this.prototype.viewTitleArguments = {
      unsplashUrl: unsplashClient.attributionUrl,
    };

    this.prototype.className = 'board-menu-content-frame';
  }
  viewTitleKey() {
    if (this.options.component === 'colors') {
      return 'change background colors';
    } else {
      return 'change background photos';
    }
  }

  initialize() {
    this.listenTo(
      this.model,
      'change:prefs.background change:prefs.backgroundTile change:prefs.backgroundBrightness',
      this.frameDebounce(this.render),
    );
  }

  render() {
    const props = {
      boardId: this.model.id,
      backgroundPrefs: getBackgroundPrefs(this.model.attributes.prefs),
    };

    if (this.options.component === 'colors') {
      props.setBackgroundColor = (name, color, tracingCallbackArgs) => {
        this.model
          .set({
            prefs: xtend(this.model.get('prefs'), {
              background: name,
              backgroundColor: color,
              backgroundImage: null,
              backgroundImageScaled: null,
            }),
          })
          .setPrefWithTracing('background', name, tracingCallbackArgs);
      };
      props.setBackgroundGradient = (name, gradient, color) => {
        this.model
          .set({
            prefs: xtend(this.model.get('prefs'), {
              background: name,
              backgroundColor: color,
              backgroundImage: gradient,
              backgroundImageScaled: null,
            }),
          })
          .setPref('background', name);
      };
    }

    const Element = React.createElement(
      Component[this.options.component],
      props,
    );

    ReactDOM.render(Element, this.el);

    return this;
  }
}

BoardBackgroundSelectView.initClass();
module.exports = BoardBackgroundSelectView;
