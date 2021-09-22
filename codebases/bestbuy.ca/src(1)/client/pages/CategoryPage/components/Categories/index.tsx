import FacetFilterPlaceholder from "pages/SearchPage/components/Facets/FacetFilterPlaceholder";
import * as React from "react";
import {InjectedIntlProps, injectIntl} from "react-intl";

import ExpandableList from "components/ExpandableList";
import {CategoryFilter} from "models";

import Category from "./Category";
import * as styles from "./style.css";
import messages from "./translations/messages";

export interface Props {
    loading: boolean;
    selectedCategoryId?: string;
    subCategories: CategoryFilter[];
    onCategoryClick: (categoryId: string) => void;
}

export const Categories = (props: Props & InjectedIntlProps) => {
    const subCategories = props.loading ? (
        <FacetFilterPlaceholder />
    ) : (
        <div className={styles.container}>
            {props.subCategories.map((subCategory) => (
                <Category
                    category={subCategory}
                    key={subCategory.categoryId}
                    onCategoryClick={props.onCategoryClick}
                    active={subCategory.categoryId === props.selectedCategoryId}
                />
            ))}
        </div>
    );

    return (
        <ExpandableList
            title={<span className={styles.facetName}>{props.intl.formatMessage(messages.category)}</span>}
            ariaLabel={props.intl.formatMessage(messages.category)}
            hasBottomBorder
            content={subCategories}
            open={true}
            className={styles.expandableList}
        />
    );
};

export default injectIntl(Categories);
