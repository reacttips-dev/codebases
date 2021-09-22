import * as React from "react";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import State from "store";
import {bindActionCreators} from "redux";
import {connect, Dispatch} from "react-redux";
import {DeliveryIcon, Loader, LoadingSkeleton, Link as Hlink} from "@bbyca/bbyca-components";
import {Key} from "@bbyca/apex-components";
import {EventTypes} from "@bbyca/apex-components/dist/models";
import {getHelpTopicsId} from "@bbyca/apex-components/dist/utils/helpTopics";

import {AvailabilityReduxStore, LevelOfService, ProductContent} from "../../../../../models";
import {AppState} from "../../../../../reducers";
import {classname} from "../../../../../utils/classname";
import {CmsEnvironment} from "../../../../../utils/environment";
import {getNumDaysFromToday} from "../../../../../utils/date";
import Shipping from "../../../../../components/ProductAvailability/components/Shipping";
import AvailabilityPlaceHolder from "../../../../../components/ProductAvailability/components/AvailabilityPlaceHolder";
import Link from "../../../../../components/Link";

import {ProductActionCreators, productActionCreators} from "../../../../actions";

import DeliveryNotice from "../DeliveryNotice";
import WhiteGoodsDeliveryMessage from "./WhiteGoodsDeliveryMessage";
import * as styles from "./style.css";
import messages from "./translations/messages";
import PostalCodeSubmit from "../../../../components/PostalCodeSubmit";

interface Props {
    availability: AvailabilityReduxStore;
    loadingProduct: boolean;
    isGetLocationLoading: boolean;
    isSpecialDelivery: boolean;
    isWhiteGood?: boolean;
    targettedContent: ProductContent;
    postalCode: string;
    regionName: string;
    updateAvailability: () => void;
    env: CmsEnvironment;
    handlePostalCodeSubmit: () => void;
    inputRef: any;
    deliveryHelpUrl: string;
}

interface DispatchProps {
    productActions: ProductActionCreators;
}

export type DeliveryAvailabilityProps = Props & InjectedIntlProps;

export class DeliveryAvailability extends React.Component<DeliveryAvailabilityProps & DispatchProps> {
    public render() {
        if (this.availableForPurchaseOnline()) {
            return this.deliveryAvailability();
        }
        return this.legacyDeliveryAvailability();
    }

    public async componentDidUpdate(prevProps: DeliveryAvailabilityProps) {
        if (this.props.postalCode !== prevProps.postalCode) {
            await this.props.updateAvailability();
            this.sendDeliveryPromiseTracking();
        }
    }

    public componentDidMount() {
        this.sendDeliveryPromiseTracking();
    }

    public sendDeliveryPromiseTracking() {
        if (this.props.availability && this.isLevelsOfServicesAvailable()) {
            const deliveryDate = this.getDeliveryDate();

            if (!deliveryDate) {
                return;
            }

            const deliveryDateInDaysFromToday: number = getNumDaysFromToday(deliveryDate);

            const deliveryDatePrecisionInDays = this.getDeliveryDatePrecisionInDays();
            const totalDays = deliveryDateInDaysFromToday + deliveryDatePrecisionInDays;

            this.props.productActions.trackDeliveryPromise(totalDays);
        }
    }

    private deliveryAvailability = () => {
        if (this.props.loadingProduct || !this.props.availability) {
            return <AvailabilityPlaceHolder />;
        }
        return (
            <div
                className={`${styles.scheduledDeliveryContainer} scheduledDeliveryContainer`}
                data-automation="scheduled-delivery-container">
                <div className={styles.availabilityMessageProduct}>
                    <DeliveryIcon
                        className={classname([styles.iconStyle, styles.icon])}
                        color={"black"}
                        opacity={"1"}
                        availability="available"
                    />
                    <span className={styles.scheduledDeliveryTitle} data-automation="scheduled-delivery-title">
                        <FormattedMessage {...messages.specialDelivery} />
                    </span>
                    <Loader loading={this.props.isGetLocationLoading} loadingDisplay={<LoadingSkeleton.Title />}>
                        <div data-automation="scheduled-delivery-message" className={styles.deliveryDate}>
                            {this.props.isWhiteGood && this.scheduledDeliveryMessage()}
                            {this.specialDeliveryMessage()}
                        </div>
                    </Loader>
                </div>
                <PostalCodeSubmit
                    postalCode={this.props.postalCode}
                    handlePostalCodeSubmit={this.props.handlePostalCodeSubmit}
                    ctaText={this.props.intl.formatMessage(messages.updatePostalCode)}
                    className={styles.postalCode}
                    error={false}
                    errorMessage={this.props.intl.formatMessage(messages.postalCodeErrorMessage)}
                    inputRef={this.props.inputRef}
                />
            </div>
        );
    };

    private legacyDeliveryAvailability = () => {
        if (this.props.loadingProduct || !this.props.availability) {
            return <AvailabilityPlaceHolder />;
        }

        const config = getHelpTopicsId(this.props.env);
        return (
            <div className={"x-pdp-availability-online " + styles.onlineAvailabilityContainer}>
                <div className={styles.availabilityMessageProduct}>
                    <Shipping
                        icon={
                            <DeliveryIcon
                                className={classname([styles.iconStyle, styles.icon])}
                                availability={
                                    this.props.availability.shipping.purchasable ? "available" : "unavailable"
                                }
                            />
                        }
                        shipping={this.props.availability.shipping}
                        regionName={this.props.regionName}
                        className={styles.shippingAvailabilityTitle}
                    />
                </div>
                {!this.isUnknownShippingStatus() && (
                    <div className={styles.specialDelivery}>
                        <Link
                            to={EventTypes.help as Key}
                            params={config.specialDelivery}
                            query={{icmp: "mdot_specialDelivery"}}
                            ariaLabel={this.props.intl.formatMessage(messages.specialDelivery)}>
                            <FormattedMessage {...messages.specialDelivery} />
                        </Link>
                        <FormattedMessage {...messages.specialDeliveryMSG} />
                    </div>
                )}
                <DeliveryNotice targettedContent={this.props.targettedContent} />
            </div>
        );
    };

    private scheduledDeliveryMessage = () => {
        return (
            <div className={styles.scheduledDelivery}>
                <span><FormattedMessage {...messages.scheduledDeliveryMsg} /></span>
                <span className={styles.home}><FormattedMessage {...messages.scheduledDeliveryHome} /></span>
                <Hlink href={this.props.deliveryHelpUrl} targetSelf={false} className={styles.details} chevronType="right">
                    <FormattedMessage {...messages.scheduledDeliveryDetails} />
                </Hlink>

            </div>
        );
    }

    private specialDeliveryMessage: () => {[key: string]: any} = () => {
        const deliveryDate = this.getDeliveryDate();
        if (!deliveryDate) {
            return (
                <p className={styles.scheduledDeliveryMessage}>
                    <FormattedMessage {...messages.specialDeliveryMSGUnknownDate} />
                </p>
            );
        }
        return (
            <WhiteGoodsDeliveryMessage
                month={deliveryDate.getMonth()}
                year={deliveryDate.getFullYear()}
                day={deliveryDate.getDate()}
                postalCode={this.props.postalCode}
            />
        );
    };

    private isLevelsOfServicesAvailable: () => boolean | undefined = () => {
        const levelsOfService = this.getLevelsOfService();
        return levelsOfService && levelsOfService.length > 0;
    };

    private getDeliveryDate = (): Date | undefined => {
        let deliveryDate;

        if (this.props.availability) {
            deliveryDate = this.isLevelsOfServicesAvailable() && this.getDeliveryDateValue();
        }

        if (!deliveryDate) {
            return;
        }

        const boxedDeliveryDate = new Date(deliveryDate);
        return new Date(boxedDeliveryDate.getFullYear(), boxedDeliveryDate.getMonth(), boxedDeliveryDate.getDate());
    };

    private getLevelsOfService = (): LevelOfService[] | undefined => {
        return (
            this.props.availability &&
            this.props.availability.shipping &&
            this.props.availability.shipping.levelsOfServices
        );
    };

    private getDeliveryDateValue = () => {
        const levelsOfService = this.getLevelsOfService();
        return levelsOfService && levelsOfService[0] && levelsOfService[0].deliveryDate;
    };

    private getDeliveryDatePrecisionInDays = (): number => {
        let daysPrecision = 0;
        if (this.props.availability) {
            const dateTimePrecision =
                this.isLevelsOfServicesAvailable() &&
                this.props.availability.shipping.levelsOfServices[0].deliveryDatePrecision;

            if (!dateTimePrecision) {
                return daysPrecision;
            }

            daysPrecision = parseInt(dateTimePrecision && dateTimePrecision.split(":")[0], 10);

            if (isNaN(daysPrecision)) {
                return daysPrecision;
            }
        }
        return daysPrecision;
    };

    private getAvailabilityShippingStatus = () => {
        return (
            this.props.availability &&
            this.props.availability &&
            this.props.availability.shipping &&
            this.props.availability.shipping.status
        );
    };

    private availableForPurchaseOnline = (): boolean => {
        const shippingStatus = this.getAvailabilityShippingStatus();
        return shippingStatus === "InStock" || shippingStatus === "InStockOnlineOnly";
    };

    private isUnknownShippingStatus = (): boolean => {
        const shippingStatus = this.getAvailabilityShippingStatus();
        return shippingStatus === "Unknown";
    };
}
const mapStateToProps: (state: State) => Props = (state: State) => ({
    deliveryHelpUrl: state.config.scheduledDeliveryHelpUrl?.[state.intl?.language],
});

const mapDispatchToProps = (dispatch: Dispatch<AppState>) => ({
    productActions: bindActionCreators(productActionCreators, dispatch),
});

export default connect<Props>(mapStateToProps, mapDispatchToProps)(injectIntl(DeliveryAvailability));
