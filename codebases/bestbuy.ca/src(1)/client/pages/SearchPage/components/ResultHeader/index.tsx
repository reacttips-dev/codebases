import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import {find} from "lodash-es";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Toolbar from "@material-ui/core/Toolbar";
import ToolbarGroup from "@material-ui/core/Toolbar";
import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {facetFilterNames, facetSystemNames, facetSimpleNames} from "../../../../constants";
import {FacetFilter, SearchResult} from "../../../../models";
import * as styles from "./style.css";
import messages from "./translations/messages";
export interface Props {
    className?: string;
    searchResult: SearchResult;
    onToggle: (facetSystemName: string, filterName: string, payload: any) => void;
    onRpuFilterToggle: (
        isFilterEnabled: boolean,
        facetSystemName: string,
        filterName: string,
        payload: any,
        pageSize: number,
    ) => void;
    isSearching: boolean;
    sort?: JSX.Element | React.Component;
    rpuToggleFilter?: boolean;
}

export interface State {
    toggled: boolean;
    rpuToggled: boolean;
}

export class SearchResultHeader extends React.Component<Props & InjectedIntlProps, State> {
    public static displayName: string = "SearchResultHeader";
    private soldAndShippedByBestBuyFilter: FacetFilter;

    constructor(props) {
        super(props);
        this.state = {
            toggled: this.isBestBuyFilterSelected(this.props.searchResult, props.rpuToggleFilter),
            rpuToggled: props.rpuToggleFilter,
        };
    }

    public render() {
        if (!this.props.searchResult) {
            return null;
        }

        const bestBuyOnlyToggle = this.props.searchResult.total > 0 && this.soldAndShippedByBestBuyFilter && (
            <FormControlLabel
                className={styles.switchFormControl}
                classes={{
                    root: styles.switchLabelRoot,
                    label: styles.switchLabelText,
                }}
                control={
                    <Switch
                        className={styles.switchToggle}
                        classes={{
                            iconChecked: styles.switchThumb,
                            switchBase: styles.switchBase,
                            checked: styles.switchChecked,
                            bar: styles.switchBar,
                        }}
                        onChange={(event, isInputChecked) => this.handleToggle()}
                        checked={this.state.toggled || this.props.rpuToggleFilter}
                        disabled={this.props.isSearching || this.props.rpuToggleFilter}
                        disableRipple={true}
                    />
                }
                label={this.props.intl.formatMessage(messages.bestBuyOnly)}
                labelPlacement={"start"}
            />
        );

        const filterToggle = this.props.searchResult.total > 0 && (
            <FormControlLabel
                className={styles.switchRpuToggleFormControl}
                classes={{
                    root: styles.switchLabelRoot,
                    label: styles.switchLabelText,
                }}
                control={
                    <Switch
                        className={styles.switchRpuToggle}
                        classes={{
                            iconChecked: styles.switchThumb,
                            switchBase: styles.switchBase,
                            checked: styles.switchChecked,
                            bar: styles.switchBar,
                        }}
                        checked={this.state.rpuToggled}
                        disabled={this.props.isSearching}
                        onChange={(event, isInputChecked) => this.handleRpuFilterToggle(isInputChecked)}
                        disableRipple={true}
                    />
                }
                label={this.props.intl.formatMessage(messages.rpuFilter)}
                labelPlacement={"start"}
            />
        );

        const toggleAndSort = this.props.searchResult.total > 0 && (
            <ToolbarGroup className={`${styles.materialOverride} ${styles.toolbarGroup}`}>
                {filterToggle}
                {bestBuyOnlyToggle}
                {this.props.sort}
            </ToolbarGroup>
        );

        return (
            <div className={this.getClassNames()}>
                <Toolbar className={`${styles.materialOverride} ${styles.toolbar}`}>
                    <ToolbarGroup className={`${styles.materialOverride} ${styles.toolbarGroup}`}>
                        <span className={`${styles.materialOverride} ${styles.toolbarTitle}`}>
                            {this.props.intl.formatMessage(messages.results, {
                                total: this.props.intl.formatNumber(this.props.searchResult.total),
                            })}
                        </span>
                    </ToolbarGroup>
                    {<hr className={styles.hr} />}
                    {toggleAndSort}
                </Toolbar>
            </div>
        );
    }

    public async componentWillReceiveProps(nextProps: Props) {
        if (this.props.searchResult !== nextProps.searchResult) {
            this.setState({
                toggled: this.isBestBuyFilterSelected(nextProps.searchResult, !!this.props.rpuToggleFilter),
            });
        }

        if (this.props.rpuToggleFilter !== nextProps.rpuToggleFilter) {
            this.setState({
                toggled: this.isBestBuyFilterSelected(this.props.searchResult, !!nextProps.rpuToggleFilter),
            });
            this.setState({
                rpuToggled: nextProps.rpuToggleFilter,
            });
        }
    }

    private handleRpuFilterToggle = (isInputChecked: boolean) => {
        const payload = {
            label: "Nearby Stores",
            link: "",
        };
        const filterPayload = this.state.rpuToggled
            ? {}
            : {
                  label: facetSimpleNames.soldAndShippedBy,
                  link: facetFilterNames.bestBuy,
              };
        const pageSize = isInputChecked ? 96 : 24;
        if (isInputChecked) {
            adobeLaunch.pushEventToDataLayer({
                event: "SEARCH_SELECT_FILTER",
                payload,
            });
        }

        this.props.onRpuFilterToggle(
            isInputChecked,
            facetSystemNames.soldAndShippedBy,
            facetFilterNames.bestBuy,
            filterPayload,
            pageSize,
        );
    };

    private handleToggle = () => {
        const payload = this.state.toggled
            ? {}
            : {
                  label: facetSimpleNames.soldAndShippedBy,
                  link: facetFilterNames.bestBuy,
              };
        this.props.onToggle(facetSystemNames.soldAndShippedBy, facetFilterNames.bestBuy, payload);
    };

    private isBestBuyFilterSelected = (props: SearchResult, rpuToggled: boolean): boolean => {
        this.soldAndShippedByBestBuyFilter = null;
        if (!props || !props.facets) {
            return false;
        }

        const soldAndShippedByFacet = find(
            props.facets,
            (facet) => facet.systemName === facetSystemNames.soldAndShippedBy,
        );

        if (!soldAndShippedByFacet) {
            return false;
        }

        this.soldAndShippedByBestBuyFilter = find(
            soldAndShippedByFacet.filters,
            (filter) => filter.name === facetFilterNames.bestBuy,
        );

        if (this.soldAndShippedByBestBuyFilter && this.soldAndShippedByBestBuyFilter.isSelected) {
            return true;
        }

        if (rpuToggled) {
            return true;
        }

        return false;
    };

    private getClassNames = () => {
        const classNames = [styles.container];
        if (this.props.className) {
            classNames.push(this.props.className);
        }
        if (this.props.searchResult.total === 0) {
            classNames.push(styles.noResults);
        }
        return classNames.join(" ");
    };
}

export default injectIntl<Props>(SearchResultHeader);
