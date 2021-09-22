import { Injector } from "common/ioc/Injector";
import { CoreWebsiteCell } from "components/core cells/src/CoreWebsiteCell/CoreWebsiteCell";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import ComponentsProvider from "components/WithComponent/src/ComponentsProvider";
import * as React from "react";
import { allTrackers } from "services/track/track";
import { connect } from "react-redux";
import { colorsPalettes } from "@similarweb/styles";

export const LeadingSiteInner = (props) => {
    const { value, row, params } = props;
    const swNavigator = Injector.get<any>("swNavigator");
    const coreWebsiteCellProps = {
        domain: value,
        icon: row.favicon,
        target: "_blank",
        internalLink: swNavigator.href("websites-worldwideOverview", {
            ...params,
            key: value,
        }),
        trackInternalLink: (e) => {
            e.stopPropagation();
            allTrackers.trackEvent("Internal Link", "click", `Table/${value}`);
        },
        externalLink: `http://${value}`,
        trackExternalLink: (e) => {
            e.stopPropagation();
            allTrackers.trackEvent("External Link", "click", `Table/${value}`);
        },
        hideTrackButton: true,
    };
    const leadingSiteComponents = (
        <ComponentsProvider components={{ WebsiteTooltip }}>
            <CoreWebsiteCell {...coreWebsiteCellProps} />
        </ComponentsProvider>
    );
    return value && value !== "grid.upgrade" ? (
        leadingSiteComponents
    ) : (
        <div style={{ color: colorsPalettes.carbon[500] }}>N/A</div>
    );
};

const mapStateToProps = (props) => {
    const { routing } = props;
    const { params } = routing;
    return {
        params: {
            ...params,
        },
    };
};

export const LeadingSite = connect(mapStateToProps)(LeadingSiteInner);
