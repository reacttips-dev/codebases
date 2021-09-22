import React from "react";
import { connect } from "react-redux";
import FiltersPanelHead from "./FiltersPanelHead";
import FiltersPanelContext from "../../../contexts/filtersPanelContext";
import { selectNumberOfFiltersInBothStates } from "../../../store/selectors";

const mapStateToProps = (state) => ({
    numberOfFilters: selectNumberOfFiltersInBothStates(state),
});

const FiltersPanelHeadContainer = (props: ReturnType<typeof mapStateToProps>) => {
    const { isExpanded, onExpandToggle } = React.useContext(FiltersPanelContext);

    const handleCollapse = () => {
        requestAnimationFrame(onExpandToggle);
    };

    return (
        <FiltersPanelHead
            isExpanded={isExpanded}
            onExpandToggle={handleCollapse}
            numberOfReadyStateFilters={props.numberOfFilters}
        />
    );
};

export default connect(mapStateToProps)(FiltersPanelHeadContainer) as React.ComponentType<{}>;
