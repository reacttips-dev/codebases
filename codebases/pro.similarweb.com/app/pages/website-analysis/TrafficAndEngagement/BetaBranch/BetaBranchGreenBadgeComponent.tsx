import { Pill } from "components/Pill/Pill";
import * as React from "react";
import { colorsPalettes } from "@similarweb/styles";
import { connect } from "react-redux";
import { i18nFilter } from "filters/ngFilters";

const BetaBranchGreenBadgeComponent = ({ showBetaBranchData, text }) => {
    return (
        <>
            {showBetaBranchData && !showBetaBranchData.isUpdating && showBetaBranchData.value && (
                <Pill text={i18nFilter()(text)} backgroundColor={colorsPalettes.mint[400]} />
            )}
        </>
    );
};

const mapStateToProps = ({ common }) => {
    const { showBetaBranchData } = common;
    return {
        showBetaBranchData,
    };
};

export default connect(mapStateToProps, undefined)(BetaBranchGreenBadgeComponent);
