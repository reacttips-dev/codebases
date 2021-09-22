import * as React from "react";
import {Loader} from "@bbyca/bbyca-components";

import {classname} from "utils/classname";

import ChildProductHeader from "../../../../components/ChildProductHeader";
import * as styles from "../../styles.css";
import ProductAddonSectionLoader from "./ProductAddonSectionLoader";

interface Props {
    header: React.ReactNode;
    subheader?: React.ReactNode;
    hideHeader?: boolean;
    children: React.ReactNode;
    dataAutomation?: string;
    className?: string;
    isLoading: boolean;
    loadingDisplay?: React.ReactNode;
    icon?: React.ReactNode;
}

const ProductAddonSection: React.FC<Props> = ({
    header,
    subheader,
    hideHeader = false,
    children,
    dataAutomation,
    className = "",
    isLoading = false,
    loadingDisplay = <ProductAddonSectionLoader />,
    icon,
}) => {
    const config = {
        className: classname([styles.productAddonSecion, className]),
        ...(dataAutomation ? {"data-automation": dataAutomation} : {}),
    };
    return (
        <Loader loading={isLoading} loadingDisplay={loadingDisplay}>
            <div {...config}>
                {!hideHeader && (
                    <ChildProductHeader
                        data-automation="addon-section-header"
                        className={styles.header}
                        header={header}
                        subheader={subheader}
                    />
                )}
                {children}
            </div>
        </Loader>
    );
};

ProductAddonSection.displayName = "ProductAddonSection";

export default ProductAddonSection;
