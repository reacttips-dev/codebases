import {clone, isEqual, get} from "lodash-es";
import * as Moment from "moment";
import * as React from "react";
import {FormattedMessage} from "react-intl";
import {InjectedIntlProps, injectIntl} from "react-intl";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {DeliveryIcon, Store, StoreStatusMessage, Divider} from "@bbyca/bbyca-components";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import {Language} from "@bbyca/ecomm-webapp-content";
import {Locale} from "@bbyca/apex-components/dist/models";

import {classIf, classname} from "../../../../../utils/classname";
import AvailabilityPlaceHolder from "../../../../../components/ProductAvailability/components/AvailabilityPlaceHolder";
import {
    AvailabilityReduxStore,
    ProductContent,
    AvailabilityPickupStatus,
    AvailabilityShippingStatus,
    PickupStore,
    PickupWithAddress,
    Shipping as ShippingModel,
    Warranty,
} from "../../../../../models";
import getLogger from "../../../../../../common/logging/getLogger";
import State from "../../../../../store";
import {FeatureToggles, RpuPickUpLinks} from "../../../../../../config";
import {
    AvailabilityActionCreators,
    availabilityActionCreators,
    productActionCreators,
    ProductActionCreators,
} from "../../../../actions";
import {errorActionCreators, ErrorActionCreators, userActionCreators, UserActionCreators} from "../../../../../actions";
import {CmsEnvironment, getCmsEnvironment} from "../../../../../utils/environment";
import {FeatureToggle} from "../../../../../components/FeatureToggle";
import Link from "../../../../../components/Link";
import Shipping from "../../../../../components/ProductAvailability/components/Shipping";
import {getSortedPickupStores} from "Decide/store/selectors/productSelectors";

import NearbyStores, {NUMBER_OF_STORES_TO_SHOW} from "./NearbyStores";
import messages from "./translations/messages";
import {DeliveryAvailability} from "../DeliveryAvailability";
import DeliveryNotice from "../DeliveryNotice";
import * as styles from "./style.css";
import BrownGoodsDeliveryMessage from "./BrownGoodsDeliveryMessage";
import PostalCodeSubmit, {MIN_POSTAL_CODE_LENGTH} from "../../../../components/PostalCodeSubmit";
import {validatePostalCode} from "../../../../../Decide/utils/validatePostalCode";
import {getFeatureToggle} from "store/selectors";
import {FEATURE_TOGGLES} from "../../../../../../config/featureToggles";

export interface AvailabilityProps {
    isAvailabilityError: boolean;
    availability: AvailabilityReduxStore;
    isAddToCartEnabled?: boolean;
    isMarketplace: boolean;
    isRpuEnabled?: boolean;
    isSpecialDelivery: boolean;
    targettedContent: ProductContent;
    loadingStores: boolean;
    sku: string;
    seoText?: string;
    postalCode: string;
    productReleaseDate: string;
    regionName: string;
    updateStores?: () => void;
    locale: Locale;
    rpuMessageLinks: RpuPickUpLinks;
    language: Language;
    selectedWarranty: Warranty;
    sortedPickupStores: PickupStore[];
    showLowInventory: boolean;
}

export interface StateProps {
    storeLocatorUrl?: string;
    features: FeatureToggles;
    loadingProduct: boolean;
    isGetLocationLoading: boolean;
    env: CmsEnvironment;
    isAvailabilityLoading: boolean;
    marketplaceDeliveryPromise?: number;
}

export interface DispatchProps {
    productActions: ProductActionCreators;
    errorActions: ErrorActionCreators;
    availabilityActions: AvailabilityActionCreators;
    userActions: UserActionCreators;
}

interface OwnState {
    isServerSide: boolean;
}

export class ProductAvailability extends React.Component<
    AvailabilityProps & StateProps & DispatchProps & InjectedIntlProps,
    OwnState
> {
    private inputRef;

    constructor(props: AvailabilityProps & StateProps & DispatchProps & InjectedIntlProps) {
        super(props);
        this.state = {
            isServerSide: true,
        };
        this.inputRef = React.createRef<HTMLDivElement>();
    }
    public shouldComponentUpdate(nextProps: AvailabilityProps) {
        let shallow: AvailabilityProps & StateProps = clone(this.props);
        shallow = {
            ...shallow,
            isAddToCartEnabled: this.props.isAddToCartEnabled === undefined ? false : this.props.isAddToCartEnabled,
            isRpuEnabled: this.props.isRpuEnabled === undefined ? false : this.props.isRpuEnabled,
        };
        return !isEqual(shallow, nextProps);
    }

    public componentDidMount() {
        this.setState({isServerSide: typeof window === "undefined"});
    }

    public render() {
        if (this.props.isAvailabilityError) {
            return null;
        }

        const browseMode = this.props.isAddToCartEnabled === false && this.props.isRpuEnabled === false;

        return (
            <div className={styles.container}>
                {browseMode || (
                    <div>
                        {this.isWhiteGood()
                            ? this.getWhiteGoodsDeliveryMessage()
                            : this.getBrownGoodsDeliveryMessage(this.state.isServerSide)}
                        {this.storeAvailability(this.state.isServerSide)}
                    </div>
                )}
            </div>
        );
    }

    private handlePostalCodeSubmit = async () => {
        const value = this.inputRef.current?.state?.value || "";
        const isPostalCodeValid = validatePostalCode(value, MIN_POSTAL_CODE_LENGTH, false);
        if (!isPostalCodeValid) {
            return;
        }
        await this.props.userActions.locate(true, false, value);
        if (!this.props.isSpecialDelivery) {
            this.props.availabilityActions.getAvailability(this.props.sku);
        }
        adobeLaunch.customLink("PDP:Update Location");
    };

    private updateAvailability = async () => {
        return this.props.availabilityActions.getAvailability(this.props.sku);
    };

    private isWhiteGood = () => (this.props.availability?.scheduledDelivery);

    private getWhiteGoodsDeliveryMessage = () => {
        if (!this.props.availability || this.props.isAvailabilityLoading) {
            return <AvailabilityPlaceHolder />;
        }

        return (
            <DeliveryAvailability
                availability={this.props.availability}
                isSpecialDelivery={this.props.isSpecialDelivery}
                isWhiteGood={this.isWhiteGood()}
                regionName={this.props.regionName}
                postalCode={this.props.postalCode}
                targettedContent={this.props.targettedContent}
                loadingProduct={this.props.loadingProduct}
                isGetLocationLoading={this.props.isGetLocationLoading}
                updateAvailability={this.updateAvailability}
                env={this.props.env}
                handlePostalCodeSubmit={this.handlePostalCodeSubmit}
                inputRef={this.inputRef}
            />
        );
    };

    private getBrownGoodsDeliveryMessage = (isServerSide: boolean) => {
        const formattedReleaseDate = this.getFormattedReleaseDate();
        const deliveryDate = this.getDeliveryDate();
        const marketplaceShippingMessage = this.getMarketplaceShippingMessaging();

        if (!this.props.availability) {
            return <AvailabilityPlaceHolder />;
        }

        return (
            <div
                className={classname([
                    "x-pdp-availability-online",
                    styles.onlineAvailabilityContainer,
                    classIf(
                        styles.unavailableContainer,
                        !isServerSide &&
                            !this.props.isAvailabilityLoading &&
                            !this.props.availability.shipping.purchasable,
                    ),
                ])}>
                <div className={styles.availabilityMessageProduct}>
                    <Shipping
                        availabilityTitleClass={styles.shippingAvailabilityTitle}
                        icon={
                            <DeliveryIcon
                                className={styles.availabilityHeaderIcon}
                                availability={
                                    this.props.availability.shipping.purchasable ? "available" : "unavailable"
                                }
                            />
                        }
                        shipping={this.props.availability.shipping}
                        regionName={this.props.regionName}
                        className={styles.availabilityMessage}
                    />
                </div>
                {formattedReleaseDate && (
                    <div className={styles.productReleaseDate}>
                        <FormattedMessage {...messages.ProductReleaseDate} values={{date: formattedReleaseDate}} />
                    </div>
                )}
                {deliveryDate && (
                    <>
                        <BrownGoodsDeliveryMessage
                            year={deliveryDate.getFullYear()}
                            month={deliveryDate.getMonth()}
                            day={deliveryDate.getDate()}
                        />
                        <div className={styles.deliveryDate}>
                            <FormattedMessage
                                {...messages.DeliverySubHeader}
                                values={{
                                    freeShipping: (
                                        <strong>
                                            {this.props.language === "en" ? "free shipping" : "l’expédition gratuite"}
                                        </strong>
                                    ),
                                    deliverySubHeaderLink: (
                                        <span className={styles.deliverySubHeaderLink}>
                                            <Link to="freeShippingPolicy">
                                                <FormattedMessage {...messages.DeliverySubHeaderLink} />
                                            </Link>
                                        </span>
                                    ),
                                }}
                            />
                        </div>
                    </>
                )}
                {this.props.isMarketplace && (
                    <div className={styles.deliveryContainer}>{marketplaceShippingMessage}</div>
                )}
                <DeliveryNotice targettedContent={this.props.targettedContent} />
            </div>
        );
    };

    private getMarketplaceShippingMessaging = () => {
        if (this.props.marketplaceDeliveryPromise !== undefined) {
            return (
                <FormattedMessage
                    {...messages.MarketplaceSellerSpecificShippingDate}
                    values={{numberOfDays: this.props.marketplaceDeliveryPromise}}
                />
            );
        }
        return <FormattedMessage {...messages.MarketplaceSellerShippingDate} />;
    };

    private isPickupEnabled = () => {
        const {availability, isSpecialDelivery, isRpuEnabled, isAddToCartEnabled} = this.props;
        
        const pickupAvailability: PickupWithAddress = availability?.pickup;
        const shippingAvailability: ShippingModel = availability?.shipping;
        const pickupStatus = pickupAvailability?.status;
        const shippingStatus = shippingAvailability?.status;
        const isOnlineOnly = pickupStatus === AvailabilityPickupStatus.OnlineOnly;
        const isComingSoon = pickupStatus === AvailabilityPickupStatus.ComingSoon;
        const isPreOrder = shippingStatus === AvailabilityShippingStatus.Preorder;
        const isInStockOnlineOnly = shippingStatus === AvailabilityShippingStatus.InStockOnlineOnly;
        const isPurchasable = pickupAvailability?.purchasable;
        const isWhiteGoodUnpickupable = isSpecialDelivery && !isPurchasable;

        return isRpuEnabled !== false &&
            isAddToCartEnabled !== false &&
            !isInStockOnlineOnly &&
            !isOnlineOnly &&
            !isPreOrder &&
            !isWhiteGoodUnpickupable &&
            !isComingSoon;
    }

    private storeAvailability = (isServerSide: boolean) => {
        const { showLowInventory, isMarketplace } = this.props;
        if (isMarketplace) {
            return;
        } else if (!this.props.availability) {
            return <AvailabilityPlaceHolder />;
        }
        
        const pickupAvailability: PickupWithAddress = this.props.availability?.pickup;
        const isPurchasable = pickupAvailability?.purchasable;
        const pickupStoresLength = pickupAvailability?.stores?.length || 0;
        const numberOfStores = Math.min(pickupStoresLength, NUMBER_OF_STORES_TO_SHOW);
        const isStoreAvailabilityShown = this.isPickupEnabled();
        
        let pickupHeader = messages.OutOfStock;
        let pickupSubHeader = messages.OutOfStockSubHeader;
        
        if (isPurchasable) {
            pickupHeader = messages.Title;
            pickupSubHeader = messages[this.props.availability.pickup.status];
        } else if (pickupAvailability.status === AvailabilityShippingStatus.NotAvailable) {
            pickupHeader = messages.NotAvailableTitle;
            pickupSubHeader = messages.NotAvailable;
        }

        return (
            <>
                {/* show pickup info if rpu is enabled and if pickup message is not duplicate of shipping message */}
                {isStoreAvailabilityShown && (
                    <>
                        <Divider className={styles.divider} />
                        <div
                            className={classname([
                                styles.storeAvailabilityContainer,
                                classIf(
                                    styles.unavailableContainer,
                                    !isServerSide &&
                                        !this.props.isAvailabilityLoading &&
                                        !this.props.availability.pickup.purchasable,
                                ),
                            ])}>
                            {messages[this.props.availability.pickup.status] && (
                                <div className={styles.availabilityMessageProduct}>
                                    <Store
                                        className={styles.availabilityHeaderIcon}
                                        availability={isPurchasable ? "available" : "unavailable"}
                                    />
                                    <p
                                        className={classname([
                                            styles.availabilityMessageTitle,
                                            classIf(styles.noPaddingTop, this.props.locale === "fr-CA"),
                                        ])}>
                                        <FormattedMessage {...pickupHeader} />
                                    </p>
                                    <p className={styles.storesNearCity}>
                                        <FormattedMessage
                                            {...pickupSubHeader}
                                            values={{
                                                postalCode: <strong>{this.props.postalCode}</strong>,
                                                number: numberOfStores,
                                            }}
                                        />
                                    </p>
                                </div>
                            )}
                            <FeatureToggle
                                isFeatureActive={this.props.features.pdpImportantUpdateText}
                                defaultComponent={null}
                                featureComponent={
                                    <div className={styles.storeStatusMessageContainer}>
                                        <StoreStatusMessage
                                            message={this.props.intl.formatMessage(messages.RpuPickUpMessage)}
                                            linkProps={{
                                                ctaText: this.props.intl.formatMessage(messages.RpuPickupHelpTopic),
                                                href:
                                                    this.props.rpuMessageLinks &&
                                                    this.props.rpuMessageLinks.storeFrontPickUpHelpTopicUrl[
                                                        this.props.language
                                                    ],
                                                targetSelf: false,
                                            }}
                                        />
                                    </div>
                                }
                            />
                            {pickupStoresLength > 0 && !this.props.isSpecialDelivery && (
                                <PostalCodeSubmit
                                    postalCode={this.props.postalCode}
                                    handlePostalCodeSubmit={this.handlePostalCodeSubmit}
                                    ctaText={this.props.intl.formatMessage(messages.updatePostalCode)}
                                    className={styles.postalCode}
                                    error={false}
                                    errorMessage={this.props.intl.formatMessage(messages.postalCodeErrorMessage)}
                                    inputRef={this.inputRef}
                                />
                            )}
                            <NearbyStores
                                availability={this.props.availability}
                                locale={this.props.locale}
                                storeLocatorUrl={this.props.storeLocatorUrl}
                                stores={this.props.sortedPickupStores}
                                updateStores={this.props.updateStores}
                                seoText={this.props.seoText}
                                sku={this.props.sku}
                                onReserveButtonClick={this.onReserveInStoreButtonClick}
                                showLowInventory={showLowInventory}
                            />
                        </div>
                    </>
                )}
            </>
        );
    };

    private onReserveInStoreButtonClick = async (storeId: string, positionNumber: number) => {
        const selectedWarrantySku = this.props.selectedWarranty ? this.props.selectedWarranty.sku : undefined;

        try {
            await this.props.productActions.reserveInStore(
                {
                    items: [
                        {
                            sku: this.props.sku,
                            quantity: 1,
                            ...(selectedWarrantySku ? {selectedWarrantySku} : {}),
                        },
                    ],
                    storeId,
                },
                {rpuFrom: `pdp store listing:${positionNumber}`},
            );
        } catch (error) {
            getLogger().error(error);
        }
    };

    private getFormattedReleaseDate = (): string => {
        let formattedDate;
        if (this.props.productReleaseDate) {
            // tslint:disable:object-literal-sort-keys
            const values = this.props.productReleaseDate.split(/[^0-9]/);
            formattedDate = Moment({
                year: parseInt(values[0], 10),
                month: parseInt(values[1], 10) - 1, // Month is zero based, so subtract 1
                day: parseInt(values[2], 10),
                hours: parseInt(values[3], 10),
                minutes: parseInt(values[4], 10),
                seconds: parseInt(values[5], 10),
            }).format("LL");
        }

        return formattedDate;
    };

    private getDeliveryDate = (): Date | undefined => {
        let deliveryDate;
        if (this.hasDeliveryDate()) {
            const deliveryDateString = get(this.props.availability, "shipping.levelsOfServices[0].deliveryDate");
            deliveryDate = new Date(deliveryDateString);
        }
        return deliveryDate;
    };

    private hasDeliveryDate = (): boolean => {
        return get(this.props.availability, "shipping.levelsOfServices[0].deliveryDate", false);
    };
}

const mapStateToProps = (state: State) => ({
    storeLocatorUrl: state.config.dataSources.storeLocatorUrl,
    features: state.config.features,
    loadingProduct: state.product.loadingProduct,
    isGetLocationLoading: state.user.isGetLocationLoading,
    env: getCmsEnvironment(state.config.environment),
    isAvailabilityLoading: state.product.isAvailabilityLoading,
    locale: state.intl.locale,
    language: state.intl.language,
    rpuMessageLinks: state.config.rpu,
    marketplaceDeliveryPromise: state.product.product.marketplaceDeliveryPromise,
    sortedPickupStores: getSortedPickupStores(state),
    showLowInventory: getFeatureToggle(FEATURE_TOGGLES.showLowInventory)(state)
});

const mapDispatchToProps = (dispatch) => ({
    productActions: bindActionCreators(productActionCreators, dispatch),
    errorActions: bindActionCreators(errorActionCreators, dispatch),
    availabilityActions: bindActionCreators(availabilityActionCreators, dispatch),
    userActions: bindActionCreators(userActionCreators, dispatch),
});

export default connect<StateProps, DispatchProps, AvailabilityProps>(
    mapStateToProps,
    mapDispatchToProps,
)(injectIntl<StateProps & AvailabilityProps & DispatchProps>(ProductAvailability));
