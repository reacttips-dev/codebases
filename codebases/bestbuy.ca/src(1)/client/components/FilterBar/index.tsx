import * as React from "react";
import { ProductSort } from "../../models";
import * as styles from "./style.css";
import { Button, Filter } from "@bbyca/bbyca-components";
import messages from "../FilterBar/translations/messages";
import { FormattedMessage } from "react-intl";
import SortDropdown from "./SortDropdown";
import Drawer from "@material-ui/core/Drawer";
import { utils as adobeLaunch } from "@bbyca/adobe-launch";
import { IBrowser as ScreenSize  } from "redux-responsive";

interface Props {
    sort: ProductSort;
    handleSortChange: (sort: ProductSort, payload: any) => any;
    content: React.Component;
    selectedFilterCount?: number;
    className?: string;
    screenSize: ScreenSize;
}

const FilterBtn = ({ selectedFilterCount, onClick }) => (
    <Button
        shouldFitContainer
        appearance="tertiary"
        onClick={onClick}
        extraAttrs={{ "data-automation": "filter-button" }}
    >
        <div className={styles.filterBtnContent}>
            <Filter className={styles.icon}/>
            <span className={styles.filterBtnLabel}>
                <FormattedMessage
                    {...messages.filterButtonLabel}
                    values={{
                        filterCount: selectedFilterCount ? ` (${selectedFilterCount})` : "",
                    }}
                />
            </span>
        </div>
    </Button>
);

const SortBtn = ({sort, handleSortChange, handleSortClick}) => (
    <SortDropdown
        sort={sort}
        handleSortClick={handleSortClick}
        handleChange={handleSortChange}
    />
);

export const filterBar = "filterBar";

export class FilterBar extends React.Component<Props, { openFilterDrawer: boolean }> {

    constructor(props) {
        super(props);
        this.state = {
            openFilterDrawer: false,
        };
    }

    public handleToggle = () => {
        if ( !this.state.openFilterDrawer ) { adobeLaunch.customLink("Filter Click"); }
        this.setState({ openFilterDrawer: !this.state.openFilterDrawer });
    }

    public render() {
        return this.props.screenSize.lessThan.medium && (
            <>
                <section id={filterBar} className={`${styles.container} ${this.props.className ? this.props.className : ""}`}>
                    <div className={styles.element}>
                        <SortBtn
                            sort={this.props.sort}
                            handleSortClick={this.handleSortClick}
                            handleSortChange={this.props.handleSortChange}
                        />
                    </div>
                    <div className={styles.element}>
                        <FilterBtn
                            selectedFilterCount={this.props.selectedFilterCount}
                            onClick={this.handleToggle}
                        />
                    </div>
                </section>
                <Drawer
                    anchor="right"
                    open={this.state.openFilterDrawer}
                    onClose={this.handleToggle}>
                    {this.props.content}
                </Drawer>
            </>
        );
    }

    private handleSortClick = () => {
        adobeLaunch.customLink("Sort By Click");
    }
}

export default FilterBar;
