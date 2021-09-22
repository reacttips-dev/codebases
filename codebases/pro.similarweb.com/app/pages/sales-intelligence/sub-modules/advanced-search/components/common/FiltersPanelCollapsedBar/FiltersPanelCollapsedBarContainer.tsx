import React from "react";
import { connect } from "react-redux";
import FiltersPanelContext from "../../../contexts/filtersPanelContext";
import FiltersPanelCollapsedBar from "./FiltersPanelCollapsedBar";
import { selectNumberOfFiltersInBothStates } from "../../../store/selectors";

const mapStateToProps = (state) => ({
    numberOfFilters: selectNumberOfFiltersInBothStates(state),
});

const FiltersPanelCollapsedBarContainer = (props: ReturnType<typeof mapStateToProps>) => {
    const { isExpanded, onExpandToggle } = React.useContext(FiltersPanelContext);

    const handleExpand = () => {
        requestAnimationFrame(onExpandToggle);
    };

    return (
        <FiltersPanelCollapsedBar
            isVisible={!isExpanded}
            onClick={handleExpand}
            numberOfReadyFilters={props.numberOfFilters}
        />
    );
};

export default connect(mapStateToProps)(
    FiltersPanelCollapsedBarContainer,
) as React.ComponentType<{}>;
