import * as React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LoadingSkeleton } from "@bbyca/bbyca-components";

import { State } from "store";
import { DetailedProduct, RecommendationApiProduct, SpecItem } from "models";
import { routingActionCreators, RoutingActionCreators } from "actions";

import * as variantStyles from "./style.css";
import { PillSizeVariantWithPrice as ExperienceA } from "./PillSizeVariantWithPrice";
import { PillSizeVariantNoPrice as ExperienceB } from "./PillSizeVariantNoPrice";
import { DropdownSizeVariant as ExperienceC } from "./DropdownSizeVariant";

export interface Props {
    selectedProduct: DetailedProduct;
    categoryL2Id: string;
}

export interface StateProps {
    language: Language;
    sizeVariantsToggle: number;
    productVariants: SizeVariantOption[];
}

export interface DispatchProps {
    routingActions: RoutingActionCreators;
}

export interface OwnState {
    isWaitingForRecommendedVariants: boolean | undefined;
}

export interface SizeVariantOption {
    sku: string;
    variantSize: string;
    salePrice: number;
    isSelected: boolean;
}

export interface VariantOptionsUIProps {
    variantOptions: SizeVariantOption[];
    currentVariant: SizeVariantOption;
    routingActions?: RoutingActionCreators;
    language?: Language;
}

export class ProductSizeVariants extends React.Component<StateProps & DispatchProps & Props, OwnState> {
    constructor(props) {
        super(props);
        this.state = {
            isWaitingForRecommendedVariants: undefined,
        };
    }

    public render() {
        return this.shouldRenderProductSizeVariants() ? (
            this.renderProductSizeVariants()
        ) : (
            <div className={variantStyles.sizeVariantsLoading}>
                <LoadingSkeleton.Line />
                <LoadingSkeleton.Line />
                <LoadingSkeleton.Line />
            </div>
        );
    }

    public componentDidMount() {
        this.waitForRecommendedVariants();
    }

    public componentWillReceiveProps(nextProps: StateProps & Props) {
        if (this.props.selectedProduct.sku !== nextProps.selectedProduct.sku) {
            this.setState({ isWaitingForRecommendedVariants: undefined });
        }

        this.waitForRecommendedVariants();
    }

    private async waitForRecommendedVariants() {
        const { isWaitingForRecommendedVariants } = this.state;
        if (isWaitingForRecommendedVariants === undefined) {
            this.setState({ isWaitingForRecommendedVariants: true });
            // NOTE: handles when Adobe doesn't return variants
            setTimeout(() => {
                this.setState({ isWaitingForRecommendedVariants: false });
            }, 5000);
        }
    }

    private shouldRenderProductSizeVariants(): boolean {
        const { isWaitingForRecommendedVariants } = this.state;
        return (
            isWaitingForRecommendedVariants === false ||
            (this.props.productVariants !== undefined && this.props.productVariants.length > 0)
        );
    }

    private renderProductSizeVariants = () => {
        const { selectedProduct, productVariants = [], sizeVariantsToggle, routingActions, language, categoryL2Id } = this.props;
        const currentVariant = this.detailedProductToVariantOptionMapper(selectedProduct, categoryL2Id);

        if (
            !selectedProduct ||
            !currentVariant.variantSize ||
            parseFloatAndRound(currentVariant.variantSize) <= 0 ||
            productVariants.length <= 0
        ) {
            return null;
        }

        const sortedVariantOptions: SizeVariantOption[] = [currentVariant, ...productVariants].filter(
            (variantOption) => parseFloatAndRound(variantOption.variantSize) > 0,
        ).sort(categorySpecificLogic[categoryL2Id].comparisonFn);

        switch (sizeVariantsToggle) {
            case 0:
                return <ExperienceA variantOptions={sortedVariantOptions} currentVariant={currentVariant} />;
            case 1:
                return <ExperienceB variantOptions={sortedVariantOptions} currentVariant={currentVariant} />;
            case 2:
                return (
                    <ExperienceC
                        variantOptions={sortedVariantOptions}
                        currentVariant={currentVariant}
                        routingActions={routingActions}
                        language={language}
                    />
                );
            default:
                return <ExperienceA variantOptions={sortedVariantOptions} currentVariant={currentVariant} />;
        }
    }

    private getCurrentOptionFromSpecs = (currProduct: DetailedProduct, specKey: RegExp): string => {
        if (currProduct && !!currProduct.specs) {
            const flattenSpecsByGroup: SpecItem[] = [].concat(...Object.keys(currProduct.specs).map((specsGroupId) => [
                ...currProduct.specs[specsGroupId],
            ]) as any[]).filter((specItem) => !!specItem.name);
            const currentOptionFromSpec: SpecItem = flattenSpecsByGroup.find((desiredSpec) => specKey.test(desiredSpec.name));
            return (currentOptionFromSpec && currentOptionFromSpec.value) ? currentOptionFromSpec.value : "";
        }

        return "";
    }

    private detailedProductToVariantOptionMapper = (currProduct: DetailedProduct, categoryL2Id: string): SizeVariantOption => {

        return {
            sku: currProduct.sku,
            salePrice: currProduct.priceWithoutEhf,
            variantSize: replaceFloatsWithRoundedInt(this.getCurrentOptionFromSpecs(currProduct, categorySpecificLogic[categoryL2Id].specRegex)),
            isSelected: true,
        };
    }
}

const mapStateToProps = (state: State): StateProps => {
    const recommendedProducts: RecommendationApiProduct[] = state.product.recommendations.variants;
    let productVariants: SizeVariantOption[];

    if (recommendedProducts.length) {
        productVariants = recommendedProducts.map((rawProductData: RecommendationApiProduct) => ({
            sku: rawProductData.sku,
            salePrice: rawProductData.salePrice,
            variantSize: replaceFloatsWithRoundedInt(rawProductData.variantSize),
            isSelected: false
        }));
    }

    return {
        language: state.intl.language,
        sizeVariantsToggle: state.config.features.sizeVariants || 0,
        productVariants,
    };
};

const mapDispatchToProps = (dispatch): DispatchProps => ({
    routingActions: bindActionCreators(routingActionCreators, dispatch)
});

// helpers
const parseFloatAndRound = (sizeWithUnit: string): number => Math.ceil(parseFloat(sizeWithUnit));
const replaceFloatsWithRoundedInt = (sizeWithUnit: string): string =>
    sizeWithUnit.replace(/^\d*(\.|\,)?\d?/, parseFloatAndRound(sizeWithUnit));
const TB_CONVERSION = 1000;

const compareHardDriveSizes = (variant: SizeVariantOption, otherVariant: SizeVariantOption): number => {
    // comparison base in GB
    const unitRegex: RegExp = /(tb)|(to)/i; // convert TB to 1000x
    const currentSize = variant.variantSize;
    const otherSize = otherVariant.variantSize;

    const normalizedSize = unitRegex.test(currentSize)
        ? parseFloatAndRound(currentSize) * TB_CONVERSION
        : parseFloatAndRound(currentSize);
    const normalizedOtherVariant = unitRegex.test(otherSize)
        ? parseFloatAndRound(otherSize) * TB_CONVERSION
        : parseFloatAndRound(otherSize);

    return normalizedSize - normalizedOtherVariant;
};

const compareTvVariantSize = (variant, otherVariant): number => parseFloatAndRound(variant.variantSize) - parseFloatAndRound(otherVariant.variantSize);

const categorySpecificLogic = {
    // TV sizes
    21344: {
        comparisonFn: compareTvVariantSize,
        specRegex: /(screen size)|((Format de l'écran))/i
    },
    // Hard drive sizes
    20232: {
        comparisonFn: compareHardDriveSizes,
        specRegex: /(capacity)|(Capacité)/i
    }
};

export default connect<StateProps, DispatchProps, Props>(
    mapStateToProps,
    mapDispatchToProps,
)(ProductSizeVariants);
