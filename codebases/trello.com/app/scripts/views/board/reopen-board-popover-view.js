// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS103: Rewrite code to no longer use __guard__
 * DS206: Consider reworking classes to avoid initClass
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const ReactDOM = require('@trello/react-dom-wrapper');
const React = require('react');

const {
  BillableGuestsAlert,
} = require('app/src/components/BillableGuestsAlert');
const BillableGuestListPopoverView = require('app/scripts/views/board/billable-guest-list-popover-view');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const template = require('app/scripts/views/templates/popover_reopen_board');
const ProductFeatures = require('@trello/product-features').ProductFeatures;
const isDesktop = require('@trello/browser').isDesktop();
const { Analytics, tracingCallback } = require('@trello/atlassian-analytics');

class ReopenBoardPopoverView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'reopen board';

    this.prototype.events = { 'click .js-confirm-reopen': 'confirmReopen' };
  }

  initialize({
    board,
    org,
    newBillableGuests,
    availableLicenseCount,
    onReopen,
  }) {
    this.board = board;
    this.org = org;
    this.newBillableGuests = newBillableGuests;
    this.availableLicenseCount = availableLicenseCount;
    this.onReopen = onReopen;
    return super.initialize(...arguments);
  }

  remove() {
    if (this.reactRoot) {
      ReactDOM.unmountComponentAtNode(this.reactRoot);
    }
    return super.remove(...arguments);
  }

  renderReactSection() {
    const productCode = this.org.getProduct();
    const props = {
      adminNames: this.org.adminList.map(
        (member) => member.get('fullName') || member.get('username'),
      ),
      newBillableGuestsCount: this.newBillableGuests.length,
      availableLicenseCount: this.availableLicenseCount,
      orgName: this.org.get('displayName') || this.org.get('name'),
      pricePerGuest: ProductFeatures.getPrice(productCode),
      isMonthly: ProductFeatures.isMonthly(productCode),
      isOrgAdmin: this.org.owned(),
      isDesktop,
      orgUrl: this.org.url,
      isReopen: true,
      onCountClick: () =>
        PopOver.pushView({
          view: new BillableGuestListPopoverView({
            newBillableGuests: this.newBillableGuests,
          }),
        }),
    };

    const Element = <BillableGuestsAlert {...props} />;
    if ((this.reactRoot = this.$('.js-billable-guests-alert')[0])) {
      return ReactDOM.render(Element, this.reactRoot);
    }
  }

  render() {
    this.$el.html(template());
    this.renderReactSection();
    return this;
  }

  confirmReopen(e) {
    let keepBillableGuests = this.org.owned() && !isDesktop;
    if (
      this.org.owned() &&
      this.availableLicenseCount !== null &&
      this.availableLicenseCount < this.newBillableGuests.length
    ) {
      keepBillableGuests = false;
    }
    const traceId = Analytics.startTask({
      taskName: 'edit-board/closed',
      source: 'reopenBoardInlineDialog',
    });
    this.board.reopen(
      {
        newBillableGuests: this.newBillableGuests,
        keepBillableGuests,
        traceId,
      },
      tracingCallback(
        {
          taskName: 'edit-board/closed',
          source: 'reopenBoardInlineDialog',
          traceId,
        },
        (err) => {
          if (!err) {
            Analytics.sendTrackEvent({
              action: 'reopened',
              actionSubject: 'board',
              source: 'reopenBoardInlineDialog',
              containers: {
                board: {
                  id: this.model.id,
                },
                organization: {
                  id: this.model.getOrganization()?.id,
                },
              },
              attributes: {
                taskId: traceId,
              },
            });
          }
        },
      ),
    );
    if (typeof this.onReopen === 'function') {
      this.onReopen();
    }
    return PopOver.hide();
  }
}

ReopenBoardPopoverView.initClass();
module.exports = ReopenBoardPopoverView;
