/* eslint-disable
    @typescript-eslint/no-this-alias,
    eqeqeq,
*/
// TODO: This file was created by bulk-decaffeinate.
// Fix any style issues and re-enable lint.
/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS206: Consider reworking classes to avoid initClass
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
const { Util } = require('app/scripts/lib/util');
const { PopOver } = require('app/scripts/views/lib/pop-over');
const View = require('app/scripts/views/internal/view');
const popoverShare = require('app/scripts/views/templates/popover_share');
const { dontUpsell } = require('@trello/browser');
const { Controller } = require('app/scripts/controller');
const { Auth } = require('app/scripts/db/auth');
const React = require('react');
const ReactDOM = require('@trello/react-dom-wrapper');
const {
  renderComponent,
  ComponentWrapper,
} = require('app/src/components/ComponentWrapper');
const { print } = require('@trello/browser-compatibility');
const { BusinessClassIcon } = require('@trello/nachos/icons/business-class');
const {
  UpgradePromptPill,
} = require('app/src/components/UpgradePrompts/UpgradePromptPill');
const {
  UpgradeSmartComponent,
} = require('app/src/components/UpgradePrompts/UpgradeSmartComponent');
const { PlanSelectionOverlay } = require('app/src/components/FreeTrial');
const {
  renderUpgradePrompt,
} = require('app/src/components/UpgradePrompts/renderUpgradePrompt');
const { l } = require('app/scripts/lib/localize');
const { Analytics } = require('@trello/atlassian-analytics');
const { featureFlagClient } = require('@trello/feature-flag-client');
const {
  ExportPopoverContent,
} = require('app/src/components/ExportPopoverContent');
const _ = require('underscore');
const { clientVersion } = require('@trello/config');

let featureFlag;

class SharePopoverView extends View {
  static initClass() {
    this.prototype.viewTitleKey = 'print and export';

    featureFlag = featureFlagClient.get(
      'fv.export-service-export-board',
      false,
    );

    this.prototype.events = {
      'click .js-print': 'printModel',
      'click .js-export-json': 'exportJSON',
      'click .js-export': 'renderExportPopover',
      'click .js-export-csv': 'exportCSV',
    };
  }

  constructor(props) {
    super(props);
    this.upgradePromptPill = this.upgradePromptPill.bind(this);
    this.debouncedTracedExport = _.debounce(this.tracedExportCSV, 2500, true);
  }

  remove() {
    if (typeof this.unmountPill === 'function') {
      this.unmountPill();
    }
    return super.remove(...arguments);
  }

  render() {
    const org = this.model.getOrganization();

    const data = this.model.toJSON();
    data.hasCsvExport = false;

    data.hasOrganization = this.model.hasOrganization();
    data.upgradeUrl = Controller.getUpgradeUrl(this.model);
    data.isAdDismissed = Auth.me().isAdDismissed('share-popover');

    if (
      org != null &&
      (org != null ? org.isFeatureEnabled('csvExport') : undefined)
    ) {
      data.hasCsvExport = true;
      data.csvURL = `/b/${this.model.get('shortLink')}.csv`;
    }

    if (
      (org != null ? org.isPremium() : undefined) &&
      !(org != null ? org.isFeatureEnabled('csvExport') : undefined)
    ) {
      data.needsUpgradeForCsv = true;
    }

    data.jsonURL = `/b/${this.model.get('shortLink')}.json`;

    data.upsellEnabled = !dontUpsell();

    data.featureFlag = featureFlag;

    this.$el.html(popoverShare(data));

    const isFreeTeam = org && !org.isPremium();
    const billingUrl = this.getBillingUrl(org);
    const orgId = org != null ? org.id : undefined;

    const shouldShowUpgradePrompt =
      !data.isAdDismissed &&
      isFreeTeam &&
      !data.hasCsvExport &&
      data.upsellEnabled;

    if (shouldShowUpgradePrompt) {
      const $printAndExportUpgradePromptWrapper = this.$(
        '.print-and-export-upgrade-prompt-wrapper',
      )[0];

      renderComponent(
        this.adContainer(orgId),
        $printAndExportUpgradePromptWrapper,
      );
    }

    Analytics.sendScreenEvent({
      name: 'printAndExportBoardInlineDialog',
      containers: {
        board: {
          id: this.model.id,
        },
      },
    });

    this.upgradePromptPill(billingUrl, orgId);
    return this;
  }

  getBillingUrl(org) {
    if (org) {
      return Controller.getOrganizationBillingUrl(org);
    }
    return '/business-class';
  }

  renderExportPopover() {
    return PopOver.pushView({
      getViewTitle() {
        return l(['view title', 'export board']);
      },
      reactElement: (
        <ComponentWrapper key="exportPopover">
          <ExportPopoverContent idBoard={this.model.id} />
        </ComponentWrapper>
      ),
    });
  }

  adContainer(orgId) {
    return (
      <React.Fragment>
        <hr />
        <UpgradeSmartComponent
          orgId={orgId}
          promptId="moreMenuShareInlineDialogPromptFull"
        />
      </React.Fragment>
    );
  }

  upgradePromptPill(billingUrl, orgId) {
    const bcPillReactRoot = this.$('#js-export-csv-pill-update-prompt')[0];

    const onClick = () => {
      Analytics.sendClickedButtonEvent({
        buttonName: 'upgradeButton',
        source: 'printAndExportBoardInlineDialog',
        containers: {
          board: {
            id: this.model?.id,
          },
          workspace: {
            id: orgId,
          },
        },
      });

      const tempNode = document.createElement('span');
      bcPillReactRoot.appendChild(tempNode);
      return renderComponent(
        <PlanSelectionOverlay
          orgId={orgId}
          // eslint-disable-next-line react/jsx-no-bind
          onContinue={() => window.location.assign('/business-class')}
          // eslint-disable-next-line react/jsx-no-bind
          onClose={() => {
            ReactDOM.unmountComponentAtNode(tempNode);
            return tempNode.remove();
          }}
        />,
        tempNode,
        {
          boardModel: this.model,
        },
      );
    };

    return (this.unmountPill = renderUpgradePrompt(
      <UpgradePromptPill
        cta={l(['upgrade prompt', 'upgrade'])}
        // eslint-disable-next-line react/jsx-no-bind
        ctaOnClick={onClick}
        icon={<BusinessClassIcon />}
        isDismissable={false}
      />,
      bcPillReactRoot,
      {
        boardModel: this.model,
      },
    ));
  }

  printModel(e) {
    Util.stop(e);

    Analytics.sendClickedButtonEvent({
      buttonName: 'printButton',
      source: 'printAndExportBoardInlineDialog',
      containers: {
        board: {
          id: this.model?.id,
        },
        workspace: {
          id: this.model?.getOrganization()?.id,
        },
      },
    });
    PopOver.hide();

    this.defer(() => print());
  }

  exportJSON(e) {
    return Analytics.sendClickedButtonEvent({
      buttonName: 'exportJSONButton',
      source: 'printAndExportBoardInlineDialog',
      containers: {
        board: {
          id: this.model?.id,
        },
        workspace: {
          id: this.model?.getOrganization()?.id,
        },
      },
    });
  }

  export(e) {
    return Analytics.sendClickedButtonEvent({
      buttonName: 'exportButton',
      source: 'printAndExportBoardInlineDialog',
      containers: {
        board: {
          id: this.model?.id,
        },
        workspace: {
          id: this.model?.getOrganization()?.id,
        },
      },
    });
  }

  fetchCSVData(url, traceId) {
    return fetch(url, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-Trello-Client-Version': clientVersion,
        'X-Trello-TraceId': traceId,
        'X-Trello-Task': 'create-export/board',
      },
    });
  }

  async tracedExportCSV(e) {
    const traceId = Analytics.startTask({
      taskName: 'create-export/board',
      source: 'printAndExportBoardInlineDialog',
    });

    try {
      const url = e?.target?.href;
      const response = await this.fetchCSVData(url, traceId);

      const trelloServerVersion = response.headers.get('X-Trello-Version');
      Analytics.setTrelloServerVersion(traceId, trelloServerVersion);

      if (!response.ok) {
        Analytics.taskFailed({
          taskName: 'create-export/board',
          traceId,
          source: 'printAndExportBoardInlineDialog',
          error: new Error(`${response.status}: Failed to fetch CSV export'`),
        });
        return;
      }

      const blob = await response.blob();
      const shortLink = this.model.get('shortLink');
      const slug = Util.makeSlug(this.model.get('name'));
      const filename = `${shortLink} - ${slug}.csv`;

      const link = document.createElement('a');
      link.download = filename;
      link.href = window.URL.createObjectURL(blob);

      // Simulate click to download CSV file
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      Analytics.taskSucceeded({
        taskName: 'create-export/board',
        traceId,
        source: 'printAndExportBoardInlineDialog',
      });
    } catch (error) {
      throw Analytics.taskFailed({
        taskName: 'create-export/board',
        traceId,
        source: 'printAndExportBoardInlineDialog',
        error,
      });
    }
  }

  exportCSV(e) {
    // since we need to instrument the download success/failure, we're going to
    // prevent the default anchor/browser behaviour and make the XMLHttpRequest
    // ourselves with associated instrumentation
    Util.stop(e);

    this.debouncedTracedExport(e);

    return Analytics.sendClickedButtonEvent({
      buttonName: 'exportCSVButton',
      source: 'printAndExportBoardInlineDialog',
      containers: {
        board: {
          id: this.model?.id,
        },
        workspace: {
          id: this.model?.getOrganization()?.id,
        },
      },
    });
  }
}

SharePopoverView.initClass();
module.exports = SharePopoverView;
