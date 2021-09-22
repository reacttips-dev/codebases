import React from "react";
import { connect } from "react-redux";
import { RootState } from "store/types";
import RightSidebarContext from "../../contexts/RightSidebarContext";
import useSimilarSitesTrackingService from "../../hooks/useSimilarSitesTrackingService";
import { selectBenchmarkMode } from "pages/workspace/sales/sub-modules/benchmarks/store/selectors";
import { useTranslation } from "components/WithTranslation/src/I18n";
import NoCompetitorsFound from "./NoCompetitorsFound";

const NoCompetitorsFoundContainer = (props: ReturnType<typeof mapStateToProps>) => {
    const translate = useTranslation();
    const { toggleSimilarSitesPanel, website } = React.useContext(RightSidebarContext);
    const similarSitesTrackingService = useSimilarSitesTrackingService(website?.domain);

    const handleButtonClick = () => {
        similarSitesTrackingService.trackPanelOpenedViaEmptyState(
            translate(`si.insights.mode.${props.benchmarkMode}.name`),
        );
        toggleSimilarSitesPanel(true);
    };

    return (
        <NoCompetitorsFound domain={website?.domain} onDefineCompetitorsClick={handleButtonClick} />
    );
};

const mapStateToProps = (state: RootState) => ({
    benchmarkMode: selectBenchmarkMode(state),
});

export default connect(mapStateToProps, null)(NoCompetitorsFoundContainer) as React.FC<{}>;
