/* eslint-disable
    eqeqeq,
    no-undef,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const { renderComponent } = require('app/src/components/ComponentWrapper');
const { sendErrorEvent } = require('@trello/error-reporting');
const { Feature } = require('app/scripts/debug/constants');
const {
  LazyTeamOnboardingPupPopover,
  LazyTeamOnboardingPupTooltip,
} = require('app/src/components/BusinessClassTeamOnboardingPupPopover');

module.exports.unmountTeamOnboardingPupPopover = function () {
  if (this.teamOnboardingPupPopoverDiv != null) {
    return ReactDOM.unmountComponentAtNode(this.teamOnboardingPupPopoverDiv);
  }
};

module.exports.unmountTeamOnboardingPupTooltip = function () {
  if (this.teamOnboardingPupTooltipDiv != null) {
    return ReactDOM.unmountComponentAtNode(this.teamOnboardingPupTooltipDiv);
  }
};

module.exports.renderTeamOnboardingPupTooltip = function () {
  if (this.model.viewState.get('showSidebar')) {
    return;
  }

  return setTimeout(() => {
    const tooltip = (
      <LazyTeamOnboardingPupTooltip
        // eslint-disable-next-line react/jsx-no-bind
        onDismiss={() => this.unmountTeamOnboardingPupTooltip()}
      />
    );

    this.teamOnboardingPupTooltipDiv = document.createElement('div');
    $(this.teamOnboardingPupTooltipDiv).insertAfter('.js-show-sidebar');
    return ReactDOM.render(tooltip, this.teamOnboardingPupTooltipDiv);
  }, 1000);
};

module.exports.renderTeamOnboardingPupPopover = function () {
  try {
    const org = this.model.getOrganization();

    if (org == null) {
      return;
    }

    if (this.teamOnboardingPupPopoverDiv == null) {
      const targetDiv = this.$('#team-onboarding-pup-popover-target')[0];

      if (targetDiv != null) {
        this.teamOnboardingPupPopoverDiv = targetDiv;
      } else {
        this.$('.board-main-content').append(
          "<div id='team-onboarding-pup-popover-target'></div>",
        );
        this.teamOnboardingPupPopoverDiv = this.$(
          '#team-onboarding-pup-popover-target',
        )[0];
      }
    }

    const boardId = this.model.get('id');

    return renderComponent(
      <LazyTeamOnboardingPupPopover
        orgId={org.id}
        boardId={boardId}
        // eslint-disable-next-line react/jsx-no-bind
        onShowPowerUps={() => this.toggleDirectory()}
        // eslint-disable-next-line react/jsx-no-bind
        onDismissed={() => this.renderTeamOnboardingPupTooltip()}
      />,
      this.teamOnboardingPupPopoverDiv,
    );
  } catch (err) {
    sendErrorEvent(err, {
      tags: {
        ownershipArea: 'trello-bizteam',
        feature: Feature.TeamOnboarding,
      },
      extraData: {
        component: 'board-view-team-onboarding-pups',
      },
    });
  }
};
