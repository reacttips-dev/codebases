// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Analytics, getScreenFromUrl } = require('@trello/atlassian-analytics');
const { PlanSelectionOverlay } = require('app/src/components/FreeTrial');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const t = require('app/scripts/views/internal/teacup-with-helpers')(
  'business_class_upsell',
);
const { Util } = require('app/scripts/lib/util');
const View = require('app/scripts/views/internal/view');
const {
  UpgradeSmartComponentConnected,
} = require('app/src/components/UpgradePrompts/UpgradeSmartComponent');

class BusinessClassUpsellView extends View {
  static initClass() {
    this.prototype.events = {
      'click .js-business-class-upsell-upgrade': 'upgradePrompt',
      'click .js-business-class-upsell-close': 'onClose',
    };
  }

  // Previous BC upgrade prompt is in the commit before this one
  upgradePrompt(e) {
    Util.stop(e);
    const tempNode = document.createElement('span');
    const org = this.model.getOrganization();
    Analytics.sendUIEvent({
      action: 'clicked',
      actionSubject: 'prompt',
      actionSubjectId: 'bcUpgradePrompt',
      source: 'pupLimitBCUpsellInlineDialog',
      containers: {
        organization: {
          id: org.id,
        },
      },
    });
    return renderComponent(
      <PlanSelectionOverlay
        orgId={org.id}
        // eslint-disable-next-line react/jsx-no-bind
        onContinue={() => window.location.assign('/business-class')}
        // eslint-disable-next-line react/jsx-no-bind
        onClose={() => {
          ReactDOM.unmountComponentAtNode(tempNode);
          return tempNode.remove();
        }}
      />,
      tempNode,
    );
  }

  onClose(e) {
    Util.stop(e);
    return PopOver.hide();
  }

  render() {
    this.$el.html(
      t.render(() => {
        return t.div('.js-content');
      }),
    );

    const tempNode = this.$('.js-content')[0];

    renderComponent(
      <UpgradeSmartComponentConnected
        orgId={this.model.getOrganization().id}
        promptId="pupLimitPopUpPromptFull"
        additionalProps={{
          onClose: (e) => {
            Util.stop(e);
            ReactDOM.unmountComponentAtNode(tempNode);
            PopOver.hide();
            return tempNode.remove();
          },
        }}
      />,
      tempNode,
    );

    Analytics.sendScreenEvent({
      name: 'pupLimitBCUpsellInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
        organization: {
          id: this.model.get('idOrganization'),
        },
      },
      attributes: {
        location: getScreenFromUrl(),
      },
    });

    return this;
  }
}

BusinessClassUpsellView.initClass();
module.exports = BusinessClassUpsellView;
