import FacetFilterPlaceholder from "pages/SearchPage/components/Facets/FacetFilterPlaceholder";
import * as React from "react";
import ExpandableList from "components/ExpandableList";
import {Facet as FacetModel} from "models";
import {facetSystemNames} from "../../../../constants";
import FacetFilter from "./FacetFilter";
import PriceSearchBar from "./PriceSearchBar";
import * as styles from "./style.css";

interface Props {
    facet: FacetModel;
    loading: boolean;
}

const Facet = (props: Props) => {
    const isCategoryOrCurrentOffer =
        props.facet.systemName === facetSystemNames.categories ||
        props.facet.systemName === facetSystemNames.currentOffer;
    const filterLength = props.facet && props.facet.filters && props.facet.filters.length;
    const filters = props.loading ? (
        <FacetFilterPlaceholder />
    ) : (
        props.facet.filters.map((filter, index) => (
            <FacetFilter
                facet={props.facet}
                filter={filter}
                key={filter.name}
                isLastItem={filterLength && filterLength === index + 1}
            />
        ))
    );

    let showPriceSearchBar = false;
    if (props.facet && props.facet.systemName && props.facet.systemName.startsWith(facetSystemNames.priceFacet)) {
        showPriceSearchBar = true;
    }

    const facetContent = showPriceSearchBar
        ? React.createElement("div", null, <PriceSearchBar filters={filters} />, filters)
        : filters;

    return (
        <ExpandableList
            title={
                <span className={styles.facetName}>
                    {props.facet.name}{" "}
                    {props.facet.selectedFilterCount > 0 && <span>({props.facet.selectedFilterCount})</span>}
                </span>
            }
            ariaLabel={props.facet.name}
            content={facetContent}
            hasBottomBorder={true}
            open={isCategoryOrCurrentOffer}
            className={styles.expandableList}
        />
    );
};

export default Facet;
