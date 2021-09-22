import Link from "components/Link";
import ProductImage from "components/ProductImage";
import {buildLinkProps} from "@bbyca/apex-components";
import {getImageProps} from "utils/imageUtils";
import {ResponsiveImageType, LinkEventType} from "models";
import {CategoryIconListBuildProps} from "../../";
import * as React from "react";
import * as styles from "./style.css";

export interface CategoryIconProps {
    text?: string;
    image?: ResponsiveImageType;
    className?: string;
    description?: string;
    event?: LinkEventType;
}

const CategoryIcon: React.FC<CategoryIconProps & CategoryIconListBuildProps> = (props) => {
    const {
        image = {} as ResponsiveImageType,
        description = "",
        screenSize,
        event = {} as LinkEventType,
        isMobileApp,
        className = "",
        text,
    } = props;

    const imgProps = getImageProps(
        {
            image,
            description,
        },
        screenSize,
    );
    const linkProps = buildLinkProps(event, isMobileApp);

    return (
        <Link {...linkProps} className={className}>
            <div className={styles.image}>
                <ProductImage dispatchLoadEvents width="75%" {...imgProps} />
                <p className={styles.link}>{text}</p>
            </div>
        </Link>
    );
};

CategoryIcon.displayName = "CategoryIcon";

export default CategoryIcon;
