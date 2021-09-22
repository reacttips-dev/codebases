import React from "react";
import { compose } from "redux";
import { connect } from "react-redux";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { swSettings } from "common/services/swSettings";
import { selectActiveOpportunityList } from "pages/workspace/common/selectors";
import { selectActiveWebsite } from "pages/workspace/sales/sub-modules/opportunities-lists/store/selectors";
import { selectLegacyWorkspaceId } from "pages/sales-intelligence/sub-modules/common/store/selectors";
import { selectOpportunityLists } from "pages/sales-intelligence/sub-modules/opportunities/store/selectors";
import { opportunityListHasId } from "pages/sales-intelligence/sub-modules/opportunities/helpers";
import withSWNavigator, {
    WithSWNavigatorProps,
} from "pages/sales-intelligence/hoc/withSWNavigator";
import { selectCountryRightBar } from "../../common/store/selectors";
import { useTranslation } from "components/WithTranslation/src/I18n";
import useRightSidebarTrackingService from "pages/sales-intelligence/hooks/useRightSidebarTrackingService";
import CountryService from "services/CountryService";
import { selectActiveTopic } from "pages/workspace/sales/sub-modules/benchmarks/store/selectors";
import { TOPICS_TRANSLATION_KEY } from "pages/workspace/sales/sub-modules/benchmarks/constants";

export type SiteTrendsExcelProps = {
    getExcelTableRowHref: any;
};

const SiteTrendsExcel: React.FC<SiteTrendsExcelProps & SiteTrendsExcelContainerProps> = (props) => {
    const {
        getExcelTableRowHref,
        lastSnapshotDate,
        activeListId,
        activeWorkspaceId,
        selectedDomain,
        opportunityLists,
        opportunityCountry,
        navigator,
        selectedCountryRightBar,
        selectedTopic,
    } = props;
    const translate = useTranslation();
    const sidebarTrackingService = useRightSidebarTrackingService();
    const isExcelAllowed = swSettings.components.Home.resources.IsExcelAllowed;
    const domain = selectedDomain?.domain;
    const { id, key } = navigator.getParams();
    const activeList = opportunityLists.find(opportunityListHasId(id));
    const country = selectedCountryRightBar?.id || activeList?.country || opportunityCountry; //TODO delete opportunityCountry after release 2.0;

    const onClickDownloadExcel = () => {
        sidebarTrackingService.trackSiteTrendsExportClicked(
            CountryService.getCountryById(country)?.text,
            translate(`${TOPICS_TRANSLATION_KEY}.${selectedTopic}`),
        );
    };

    const getExcelParams = () => {
        const to = lastSnapshotDate.format("YYYY|MM|DD");
        const from = lastSnapshotDate.clone().subtract(24, "months").format("YYYY|MM|DD");
        return {
            opportunityListId: activeList?.opportunityListId || activeListId,
            workspaceId: activeWorkspaceId,
            country,
            domain: domain || key,
            from,
            to,
        };
    };

    return (
        <div>
            {isExcelAllowed && (
                <a
                    href={getExcelTableRowHref(getExcelParams())}
                    onClick={onClickDownloadExcel}
                    data-automation="excel-tile"
                >
                    <IconButton type="flat" iconName="excel" />
                </a>
            )}
        </div>
    );
};

const mapStateToProps = (state) => {
    const activeOpportunitiesList = selectActiveOpportunityList(state.legacySalesWorkspace);

    return {
        selectedTopic: selectActiveTopic(state),
        lastSnapshotDate: state.legacySalesWorkspace.lastSnapshotDate,
        activeListId: state.legacySalesWorkspace.activeListId,
        activeWorkspaceId:
            selectLegacyWorkspaceId(state) || state.legacySalesWorkspace.activeWorkspaceId,
        selectedDomain: selectActiveWebsite(state) || state.legacySalesWorkspace?.selectedDomain,
        opportunityLists: selectOpportunityLists(state),
        opportunityCountry: activeOpportunitiesList?.country || 0,
        selectedCountryRightBar: selectCountryRightBar(state),
    };
};

type SiteTrendsExcelContainerProps = ReturnType<typeof mapStateToProps> & WithSWNavigatorProps;

export default compose(connect(mapStateToProps), withSWNavigator)(SiteTrendsExcel) as React.FC;
