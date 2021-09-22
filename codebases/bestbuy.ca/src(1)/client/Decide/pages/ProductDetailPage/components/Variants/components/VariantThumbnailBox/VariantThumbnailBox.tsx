import * as React from "react";
import {bindActionCreators} from "redux";
import {connect} from "react-redux";
import {Expandable, DisplayDefault} from "@bbyca/bbyca-components";
import {FormattedMessage} from "react-intl";
import {debounce} from "lodash-es";

import {VariantDisplayLimit, ProductVariant} from "models/DetailedProduct";
import VariantSwatchPlaceHolder from "components/VariantSwatch/VariantSwatchPlaceHolder";
import {productVariantActionCreators, ProductVariantActionCreators} from "actions";

import VariantThumbnail from "./VariantThumbnail";
import * as styles from "./style.css";
import messages from "./translations/messages";
import {VariantHeader, VariantHeaderProp} from "../VariantHeader";

export interface DispatchProps {
    actions: ProductVariantActionCreators;
}

export interface VariantThumbnailBoxProps {
    pageSku: string;
    productVariants: ProductVariant[];
    loadingVariants: boolean;
}

export const VariantThumbnailBox: React.FC<VariantThumbnailBoxProps & DispatchProps> = ({
    pageSku,
    productVariants,
    loadingVariants,
    actions,
}) => {
    const DEFAULT_MAX_NUMBER_THUMBNAILS = 4;
    const THUMBNAIL_ITEM_WIDTH = 98;
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
            variantDisplayType: selectedProduct.variantDisplayType || "",
            text,
            variantType: selectedProduct.variantType,
        };

        return selectedVariantHeader;
    };

    const [currentVariantHeaderValues, setCurrentVariantHeaderValues] = React.useState<VariantHeaderProp | null>(
        getVariantHeader(pageSku, productVariants),
    );

    const [maxNumberOfThumbnails, setMaxNumberOfThumbnails] = React.useState(DEFAULT_MAX_NUMBER_THUMBNAILS);

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

    const containerRef = React.useRef<HTMLDivElement>();

    const calculateNumberOfThumbnailsPerLine = () => {
        const containerWidth = containerRef && containerRef.current && containerRef.current.offsetWidth;
        setMaxNumberOfThumbnails(
            containerWidth ? Math.floor(containerWidth / THUMBNAIL_ITEM_WIDTH) : DEFAULT_MAX_NUMBER_THUMBNAILS,
        );
    };

    React.useEffect(() => {
        // in case the resize event is not triggered.
        calculateNumberOfThumbnailsPerLine();

        const debounceCalculateNumberOfThumbnails = debounce(calculateNumberOfThumbnailsPerLine, 100);

        window.addEventListener("resize", debounceCalculateNumberOfThumbnails);
        return () => window.removeEventListener("resize", debounceCalculateNumberOfThumbnails);
    });

    const getVariantThumbnails = () => {
        return (
            <div className={styles.variantOptionsBoxContainer} ref={containerRef}>
                {productVariants &&
                    productVariants.map((variant) => {
                        return (
                            <VariantThumbnail
                                key={variant.sku}
                                onVariantSelected={onVariantSelectedHandler}
                                onMouseEnter={onMouseEnterHandler}
                                onMouseLeave={onMouseLeaveHandler}
                                pageSku={pageSku}
                                variant={variant}
                            />
                        );
                    })}
            </div>
        );
    };

    const hasNoVariants = () => {
        return productVariants.length === 0 || (productVariants.length === 1 && productVariants[0].sku === pageSku);
    };

    if (loadingVariants) {
        return <VariantSwatchPlaceHolder />;
    }

    if (hasNoVariants()) {
        return null;
    }

    return (
        <div className={styles.variantContainerThumbnail}>
            {currentVariantHeaderValues && (
                <VariantHeader
                    label={currentVariantHeaderValues.label}
                    text={currentVariantHeaderValues.text}
                    variantDisplayType={currentVariantHeaderValues.variantDisplayType}
                    variantType={currentVariantHeaderValues.variantType}
                />
            )}

            {productVariants.length > maxNumberOfThumbnails && productVariants[0].displayLimit !== VariantDisplayLimit.all ? (
                <Expandable
                    headerText={<FormattedMessage {...messages.showMore} />}
                    toggleHeaderText={<FormattedMessage {...messages.showFewer} />}
                    className={styles.expandableContainer}
                    direction={"up"}
                    variant={"compact"}>
                    <DisplayDefault className={styles.expandableInnerBody}>
                        <div>{getVariantThumbnails()}</div>
                    </DisplayDefault>
                </Expandable>
            ) : (
                getVariantThumbnails()
            )}
        </div>
    );
};

const mapDispatchToProps = (dispatch): DispatchProps => {
    return {
        actions: bindActionCreators(productVariantActionCreators, dispatch),
    };
};

export default connect<{}, DispatchProps, VariantThumbnailBoxProps>(null, mapDispatchToProps)(VariantThumbnailBox);
