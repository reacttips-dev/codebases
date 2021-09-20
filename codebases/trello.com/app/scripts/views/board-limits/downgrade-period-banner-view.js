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
const $ = require('jquery');
const React = require('react');
const View = require('app/scripts/views/internal/view');
const DowngradePeriodBanner = require('app/scripts/views/board-limits/downgrade-period-banner');
const { renderComponent } = require('app/src/components/ComponentWrapper');

module.exports = class DowngradePeriodBannerView extends View {
  constructor(options) {
    super(options);
    this.setShown = this.setShown.bind(this);
    this.isShown = this.isShown.bind(this);
  }

  initialize(model, modelCache) {
    if (this.$reactRoot == null) {
      this.$reactRoot = $('<div></div>');
    }
    return (this.bannerState = false);
  }

  setShown(bannerShown) {
    return (this.bannerState = bannerShown);
  }

  isShown() {
    return this.bannerState;
  }

  remove() {
    this.unmountBanner();
  }

  render() {
    this.$el.append(this.$reactRoot);

    this.unmountBanner = renderComponent(
      <DowngradePeriodBanner
        model={this.model}
        modelCache={this.modelCache}
        setShown={this.setShown}
      />,
      this.$reactRoot[0],
    );
    return this;
  }
};
