import * as React from "react";
import {Specs} from "models";

import * as styles from "./style.css";
import ProductSpecItem from "./ProductSpecItem";

interface Props {
    specs: Specs;
    withTitle?: boolean;
}

export const getProductSpecElements = (specs: Specs): HTMLElement[] => {
    const specItems = [];
    const getSpecGroupContainer = (groupName: string, index: number) => (
        <div className={styles.container} key={`group-container-${index}`}>
            <h3 className={styles.groupName}>{groupName}</h3>
        </div>
    );

    Object.keys(specs).forEach((groupName, specsIndex) => {
        if (groupName) {
            specItems.push(getSpecGroupContainer(groupName, specsIndex));
        }
        specs[groupName].forEach((item, index) => {
            specItems.push(<ProductSpecItem item={item} key={`spec-item-${groupName}-${index}`} />);
        });

        specItems.push(<div key={`spec-category-div-${groupName}`} className={styles.specCategory} />);
    });

    return specItems;
};

export const ProductSpecs: React.FC<Props> = ({specs}) => {
    if (Object.keys(specs).length === 0) {
        return null;
    }

    return <>{getProductSpecElements(specs)}</>;
};

export default ProductSpecs;
