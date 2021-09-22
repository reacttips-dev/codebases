import { colorsPalettes } from "@similarweb/styles";
import * as PropTypes from "prop-types";
import * as React from "react";
import { StatelessComponent } from "react";

import { ITrendsBarValue, TrendsBar } from "../../../TrendsBar/src/TrendsBar";

const CoreTrendsBarCell: StatelessComponent<ICoreTrendCellProps> = ({ value }) => {
    return (
        <div style={{ width: "100%", height: 27 }}>
            <TrendsBar values={value} />
        </div>
    );
};
CoreTrendsBarCell.displayName = "CoreTrendsBarCell";

CoreTrendsBarCell.propTypes = {
    value: PropTypes.array.isRequired,
};

interface ICoreTrendCellProps {
    value: ITrendsBarValue[];
}

export default CoreTrendsBarCell;
