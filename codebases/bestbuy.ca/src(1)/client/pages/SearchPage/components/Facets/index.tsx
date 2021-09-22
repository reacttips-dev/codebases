import * as React from "react";
import {Facet as FacetModel} from "../../../../models";
import Facet from "./Facet";
import {facetSystemNames} from "../../../../constants";
import * as styles from "./style.css";

interface Props {
    facets: FacetModel[];
    facetsToExclude?: string[];
    loading: boolean;
}

const Facets = (props: Props) => {
    let facetModels = props.facets;

    // This condition should be removed if the "Best Buy Only" toggle on search page is removed
    if (props.facetsToExclude && props.facetsToExclude.length) {
        facetModels = props.facets.filter(
            (facet) => !props.facetsToExclude.some((facetToExclude) => facetToExclude === facet.systemName),
        );
    }

    let hasPriceFacet = false;
    for (const facet of facetModels) {
        if (facet.systemName === facetSystemNames.priceFacet) {
            hasPriceFacet = true;
            break;
        }
    }

    const facets = facetModels.map((facet) => <Facet facet={facet} key={facet.systemName} loading={props.loading} hasPriceFacet={hasPriceFacet} />);

    return <div className={styles.facetsContainer}>{facets}</div>;
};

export default Facets;
