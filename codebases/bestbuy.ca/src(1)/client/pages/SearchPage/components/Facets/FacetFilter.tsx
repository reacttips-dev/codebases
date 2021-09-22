import {Checkbox} from "@bbyca/bbyca-components";
import ListItem from "@material-ui/core/ListItem";
import * as React from "react";
import {FormattedNumber} from "react-intl";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {searchActionCreators, SearchActionCreators} from "../../../../actions";
import {Facet as FacetModel, FacetFilter as FilterModel} from "../../../../models";
import * as styles from "./style.css";
import {FacetFilterRemovePayload} from "models/Analytics";

interface Props {
    facet: FacetModel;
    filter: FilterModel;
    isLastItem?: boolean;
}

interface StateProps {
    searching: boolean;
}

interface DispatchProps {
    actions: SearchActionCreators;
}

export class FacetFilter extends React.Component<Props & DispatchProps & StateProps, undefined> {
    public render() {
        const activeClass = this.props.filter.isSelected ? styles.filterActive : "";

        return (
            <ListItem
                className={styles.materialOverride}
                classes={{
                    root: styles.listItem,
                }}
                onClick={this.onCheckHandler}
                style={{paddingBottom: this.props.facet.isMultiSelect && this.props.isLastItem ? "8px" : "16px"}}>
                {this.props.facet.isMultiSelect && (
                    <Checkbox
                        name={`facetFilter-${this.props.filter.name}`}
                        value={this.props.filter.isSelected ? "checked" : ""}
                        className={styles.facetButton}
                        disabled={this.props.searching}
                    />
                )}
                <div className={activeClass} data-automation="facet">
                    <span className={styles.productName}>{this.props.filter.name}</span>
                    {(this.props.filter.count ?? 0) > 0 && (
                        <span className={styles.productCount}>
                            (<FormattedNumber value={this.props.filter.count} />)
                        </span>
                    )}
                </div>
            </ListItem>
        );
    }

    private onCheckHandler = () => {
        const isSelected = this.props.filter.isSelected;
        const payload: FacetFilterRemovePayload = {
            action: isSelected ? "remove" : "add",
            facetName: this.props.facet.name,
            facetType: "facet",
            link: this.props.filter.name,
        };
        this.props.actions.selectFilter(this.props.facet.systemName, this.props.filter.name, payload);
    };
}

const mapStateToProps = (state) => {
    return {searching: state.search.searching};
};

const mapDispatchToProps = (dispatch) => {
    return {
        actions: bindActionCreators(searchActionCreators, dispatch),
    };
};

export default connect<StateProps, DispatchProps, Props>(mapStateToProps, mapDispatchToProps)(FacetFilter);
