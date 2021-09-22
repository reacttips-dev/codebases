import * as React from "react";
import {FormattedNumber} from "react-intl";
import {Link as ReactLink} from "react-router";
import Link from "../../../../components/Link";
import {CategoryFilter} from "../../../../models";
import * as styles from "./style.css";

interface Props {
    active: boolean;
    category: CategoryFilter;
    onCategoryClick: (categoryId: string) => void;
}

export class Category extends React.Component<Props, {}> {
    public render() {
        const categoryClasses = `${styles.categoryName} ${this.props.active ? styles.categoryActive : ""}`;
        return this.props.category.count ? (
            <div className={categoryClasses}>
                <Link
                    to="category"
                    onClick={(e) => this.handleCategoryClick(e, this.props.category.categoryId)}
                    params={[this.props.category.seoText, this.props.category.categoryId]}
                    ariaLabel={this.props.category.name}>
                    {this.props.category.name}
                </Link>
                <span className={styles.productCount}>
                    (<FormattedNumber value={this.props.category.count} />)
                </span>
            </div>
        ) : null;
    }

    private handleCategoryClick = (e: React.MouseEvent<ReactLink.Link>, categoryId: string) => {
        e.preventDefault();
        this.props.onCategoryClick(categoryId);
    };
}

export default Category;
