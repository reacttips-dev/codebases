import {ProductVariant} from "models/DetailedProduct";
import * as React from "react";
import * as styles from "./style.css";
import {isEqual} from "lodash-es";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import {buildProductSwatchUrl} from "utils/builders/productSwatchBuilder";
import messages from "./translations/messages";
import Image from "components/Image";
import Link from "components/Link";
import {Expandable, DisplayDefault} from "@bbyca/bbyca-components";
import {ProductVariantActionCreators, productVariantActionCreators} from "Decide/actions/productVariantActions";
import VariantSwatchPlaceHolder from "./VariantSwatchPlaceHolder";
import {classname, classIf} from "utils/classname";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";

export interface Props extends InjectedIntlProps {
    baseSwatchUrl?: string;
    pageSku: string;
    productVariants: ProductVariant[];
    isLink?: boolean;
    loadingVariants: boolean;
    onChange?: (sku: string) => void;
    className?: string;
    containerClass?: string;
    colorName?: string;
    isMarketplace?: boolean;
}

export interface DispatchProps {
    productVariantActions: ProductVariantActionCreators;
}

interface VariantHeader {
    label?: string;
    value?: string;
}

interface State {
    numberOfSwatches: number;
    selectedVariantHeader: VariantHeader;
}

const SWATCH_ITEM_WIDTH = 48;

export class VariantSwatch extends React.Component<Props & DispatchProps, State> {
    public static defaultProps: {isLink: boolean};
    private containerRef: React.RefObject<HTMLDivElement>;

    constructor(props: Props & DispatchProps) {
        super(props);
        this.containerRef = React.createRef<HTMLDivElement>();
        this.state = {
            numberOfSwatches: 0,
            selectedVariantHeader: {} as VariantHeader,
        };
    }

    public componentDidMount() {
        window.addEventListener("resize", this.handleResize);
        this.setState({
            numberOfSwatches: this.calculateNumberOfSwatches(),
            selectedVariantHeader: this.getVariantHeader(this.props.pageSku),
        });
    }

    public componentWillUnmount() {
        window.removeEventListener("resize", this.handleResize);
    }

    public componentWillReceiveProps(nextProps: Props) {
        if (!isEqual(this.props.productVariants, nextProps.productVariants)) {
            this.setState({
                selectedVariantHeader: this.getVariantHeader(this.props.pageSku, nextProps.productVariants),
            });
        }
    }

    public componentDidUpdate(prevProps: Props) {
        if (this.props.loadingVariants !== prevProps.loadingVariants) {
            this.setState({
                numberOfSwatches: this.calculateNumberOfSwatches(),
            });
        }
    }

    public render() {
        if (this.props.loadingVariants) {
            return <VariantSwatchPlaceHolder />;
        }

        if (this.hasNoVariants()) {
            return null;
        }

        return (
            <div className={classname([styles.container, this.props.containerClass])} ref={this.containerRef}>
                {this.getSelectedVariantHeader()}
                {this.props.productVariants.length > this.state.numberOfSwatches ? (
                    <Expandable
                        headerText={this.props.intl.formatMessage({...messages.showMoreColours})}
                        toggleHeaderText={this.props.intl.formatMessage({...messages.showLessColours})}
                        className={styles.expandableContainer}
                        direction={"up"}
                        variant={"compact"}>
                        <DisplayDefault className={styles.expandableInnerBody}>
                            <div>{this.getSwatches()}</div>
                        </DisplayDefault>
                    </Expandable>
                ) : (
                    <div className={styles.swatchContainer}>{this.getSwatches()}</div>
                )}
            </div>
        );
    }

    private handleResize = () => {
        const calculatedNumberOfSwatches = this.calculateNumberOfSwatches();
        if (this.state.numberOfSwatches !== calculatedNumberOfSwatches) {
            this.setState({
                ...this.state,
                numberOfSwatches: calculatedNumberOfSwatches,
            });
        }
    };

    private getVariantHeader(sku: string, nextProductVariants?: ProductVariant[]): VariantHeader {
        if (this.props.productVariants.length === 0) {
            return {};
        }
        const productVariants = nextProductVariants || this.props.productVariants;
        const selectedProduct = productVariants.find((product: ProductVariant) => product.sku === sku);
        const selectedVariantHeader: VariantHeader = {
            label: selectedProduct && selectedProduct.label,
            value: selectedProduct && selectedProduct.value,
        };
        return selectedVariantHeader;
    }

    private setVariantHeader = (sku: string) => {
        const selectedVariantHeader = this.getVariantHeader(sku);
        this.setState({
            selectedVariantHeader,
        });
    };

    private getSelectedVariantHeader() {
        const isFallbackHeader = this.props.colorName || !this.state.selectedVariantHeader.label;
        const selectedVariantValue = this.props.colorName
            ? this.props.colorName
            : this.state.selectedVariantHeader.value || "";
        return (
            <h3 className={styles.header} data-automation="variant-header-colour">
                {isFallbackHeader ? <FormattedMessage {...messages.colour} /> : this.state.selectedVariantHeader.label}
                <span className={styles.colorName}>{`: ${selectedVariantValue}`}</span>
            </h3>
        );
    }

    private getSwatches() {
        const {pageSku, className = ""} = this.props;

        return this.props.productVariants.map((variant) => {
            const swatchTitle = variant.label && variant.value ? variant.label + " " + variant.value : variant.name;
            const image = (
                <Image
                    className={styles.swatchImage}
                    data-automation="variant-colour"
                    src={this.generateImageUrl(variant)}
                    alt={swatchTitle}
                    title={swatchTitle}
                />
            );
            return (
                <div className={classname([styles.sliderSwatch, className])} key={variant.sku}>
                    <div
                        role="button"
                        onClick={() => this.onClick(variant.sku)}
                        className={classname([styles.itemContainer, classIf(styles.selected, variant.sku === pageSku)])}
                        onMouseEnter={() => this.onMouseEnter(variant.sku)}
                        onMouseLeave={this.onMouseLeave}>
                        {this.props.isLink && this.props.pageSku && this.props.pageSku !== variant.sku ? (
                            <Link
                                to="product"
                                params={[variant.seoName, variant.sku]}
                                onClick={this.sendAnalytics(variant)}>
                                {image}
                            </Link>
                        ) : (
                            image
                        )}
                    </div>
                </div>
            );
        });
    }

    private hasNoVariants(): boolean {
        return (
            this.props.productVariants.length === 0 ||
            (this.props.productVariants.length === 1 && this.props.productVariants[0].sku === this.props.pageSku)
        );
    }

    private generateImageUrl(variant: ProductVariant): string {
        const imageUrl = this.props.isMarketplace
            ? variant.variantImageUrl || ""
            : buildProductSwatchUrl(variant.sku, this.props.baseSwatchUrl);
        return imageUrl;
    }

    private calculateNumberOfSwatches = () => {
        const containerWidth = this.containerRef && this.containerRef.current && this.containerRef.current.offsetWidth;
        return Math.floor(containerWidth / SWATCH_ITEM_WIDTH);
    };

    private onClick = (sku: string) => {
        const {onChange} = this.props;
        if (onChange && typeof onChange === "function") {
            onChange(sku);
        }
    };

    private onMouseEnter = (sku: string) => {
        this.setVariantHeader(sku);
    };

    private onMouseLeave = () => {
        this.setVariantHeader(this.props.pageSku);
    };

    private sendAnalytics = (productVariant: ProductVariant) => () => {
        if (this.props.productVariantActions) {
            this.props.productVariantActions.sendAnalytics(productVariant);
        }
    };
}

VariantSwatch.defaultProps = {
    isLink: true,
};

const mapDispatchToProps = (dispatch) => ({
    productVariantActions: bindActionCreators(productVariantActionCreators, dispatch),
});

export default connect<Props, DispatchProps>(
    null,
    mapDispatchToProps,
)(injectIntl<Props & DispatchProps>(VariantSwatch));
