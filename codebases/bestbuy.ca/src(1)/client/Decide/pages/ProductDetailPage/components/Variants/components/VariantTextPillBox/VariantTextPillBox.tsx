import * as React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Expandable, DisplayDefault} from "@bbyca/bbyca-components";
import {FormattedMessage} from "react-intl";

import {VariantDisplayLimit, ProductVariant} from "models/DetailedProduct";
import {classname} from "utils/classname";
import VariantSwatchPlaceHolder from "components/VariantSwatch/VariantSwatchPlaceHolder";
import {productVariantActionCreators, ProductVariantActionCreators} from "actions";

import VariantTextPill from "./VariantTextPill";
import * as styles from "./style.css";
import messages from "./translations/messages";
import {VariantHeader, VariantHeaderProp} from "../VariantHeader";

export interface DispatchProps {
    actions: ProductVariantActionCreators;
}

export interface VariantTextPillBoxProps {
    pageSku: string;
    productVariants: ProductVariant[];
    loadingVariants: boolean;
    showPrice: boolean;
    locale: Locale;
}

export const VariantTextPillBox: React.FC<VariantTextPillBoxProps & DispatchProps> = ({
    pageSku,
    productVariants,
    loadingVariants,
    showPrice,
    locale,
    actions,
}) => {
    const MAX_VARIANT_ITEMS = 6; // maximum number of variant items before displaying show more options
    const getVariantHeader = (sku: string, variants: ProductVariant[]): VariantHeaderProp | null => {
        const selectedProduct = variants.find((product) => product.sku === sku);

        if (!selectedProduct) {
            return null;
        }

        const text =
            selectedProduct.unit && selectedProduct.value
                ? `${selectedProduct.value} ${selectedProduct.unit}`
                : selectedProduct.value || "";

        const selectedVariantHeader: VariantHeaderProp = {
            label: selectedProduct.label || "",
            variantDisplayType: "text",
            text,
            variantType: selectedProduct.variantType,
        };

        return selectedVariantHeader;
    };

    const [currentVariantHeaderValues, setCurrentVariantHeaderValues] = React.useState<VariantHeaderProp | null>(
        getVariantHeader(pageSku, productVariants),
    );

    const onMouseEnterHandler = React.useCallback(
        (variant: ProductVariant): void => {
            const variantHeaderValues = getVariantHeader(variant.sku, productVariants);
            setCurrentVariantHeaderValues(variantHeaderValues);
        },
        [pageSku, productVariants],
    );

    const onMouseLeaveHandler = React.useCallback(() => {
        const variantHeaderValues = getVariantHeader(pageSku, productVariants);
        setCurrentVariantHeaderValues(variantHeaderValues);
    }, [pageSku, productVariants]);

    const onVariantSelectedHandler = React.useCallback(
        (variant: ProductVariant) => {
            actions.sendAnalytics(variant);
        },
        [pageSku, productVariants],
    );

    const getVariantTextPills = () => {
        const variants = productVariants && productVariants.filter((variant) => variant.value && variant.value !== "");

        if (showPrice) {
            variants.sort(compareRegularPrice);
        }

        return (
            <div className={styles.variantOptionsBoxContainer}>
                {variants.map((variant) => {
                    return (
                        <VariantTextPill
                            key={variant.sku}
                            onVariantSelected={onVariantSelectedHandler}
                            onMouseEnter={onMouseEnterHandler}
                            onMouseLeave={onMouseLeaveHandler}
                            pageSku={pageSku}
                            variant={variant}
                            showPrice={showPrice}
                        />
                    );
                })}
            </div>
        );
    };

    const hasNoVariants = () => {
        return productVariants?.length === 0 || (productVariants?.length === 1 && productVariants[0].sku === pageSku);
    };

    const compareRegularPrice = (variant: ProductVariant, otherVariant: ProductVariant): number => {
        if (!variant.regularPrice) {
            return 1;
        }

        if (!otherVariant.regularPrice) {
            return -1;
        }

        if (variant.regularPrice - otherVariant.regularPrice === 0) {
            return variant.value.localeCompare(otherVariant.value, locale, {numeric: true});
        }

        return variant.regularPrice - otherVariant.regularPrice;
    };

    if (loadingVariants) {
        return <VariantSwatchPlaceHolder />;
    }

    if (hasNoVariants()) {
        return null;
    }

    return (
        <div className={classname(styles.variantContainer, "variantContainer")}>
            {currentVariantHeaderValues && (
                <VariantHeader
                    label={currentVariantHeaderValues.label}
                    text={currentVariantHeaderValues.text}
                    variantDisplayType={currentVariantHeaderValues.variantDisplayType}
                    variantType={currentVariantHeaderValues.variantType}
                />
            )}

            {productVariants.length > MAX_VARIANT_ITEMS && productVariants[0].displayLimit !== VariantDisplayLimit.all ? (
                <Expandable
                    headerText={<FormattedMessage {...messages.showMore} />}
                    toggleHeaderText={<FormattedMessage {...messages.showFewer} />}
                    className={styles.expandableContainer}
                    direction={"up"}
                    variant={"compact"}>
                    <DisplayDefault className={styles.expandableInnerBody}>
                        <div>{getVariantTextPills()}</div>
                    </DisplayDefault>
                </Expandable>
            ) : (
                getVariantTextPills()
            )}
        </div>
    );
};

const mapDispatchToProps = (dispatch): DispatchProps => {
    return {
        actions: bindActionCreators(productVariantActionCreators, dispatch),
    };
};

export default connect<{}, DispatchProps, VariantTextPillBoxProps>(null, mapDispatchToProps)(VariantTextPillBox);
