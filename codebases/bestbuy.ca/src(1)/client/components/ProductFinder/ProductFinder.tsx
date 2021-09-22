import * as React from "react";
import {Col, Row, Loader} from "@bbyca/bbyca-components";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import {IBrowser as ScreenSize} from "redux-responsive/types";
import {State as StoreState} from "store";
import AddToCartButton, {AddToCartButtonSkeleton} from "./components/AddToCartButton";
import CarrierSelector from "./components/CarrierSelector";
import ColourVariantOptions, {ColourVariantOptionSkeleton} from "./components/ColourVariantOption";
import PickupStore from "./components/PickupStore";
import ImageGallery, {ImageGallerySkeleton} from "./components/ImageGallery";
import Header, {HeaderSkeleton} from "./components/Header";
import OptionsHeader, {OptionsHeaderSkeleton} from "./components/OptionsHeader";
import PlanSelector from "./components/PlanSelector";
import PhoneOption, {PhoneOptionSkeleton} from "./components/PhoneOption";
import Price, {PriceLoadingSkeleton} from "./components/Price";
import {LeafOption, Option} from "./ProductFinderOptions";
import * as styles from "./styles.css";
import messages from "./translations/messages";
import useFetch from "./hooks/FetchHook";
import {useEffect} from "react";
import {productFinderActionCreators, ProductFinderActionCreators} from "../../actions";
import {bindActionCreators} from "redux";
import {getScreenSize} from "store/selectors";

interface ProductFinderProps {
    id?: string;
    screenSize: ScreenSize;
    defaults: string[];
    language: string;
    callback: () => boolean;
    productFinderActions: ProductFinderActionCreators;
}

interface OwnProps {
    url: string;
}

type Props = ProductFinderProps & OwnProps;

const Skeleton = () => {
    return (
        <>
            <Row className={styles.productFinder}>
                <Col xs={12} sm={6} md={8} className={styles.imageGalleryDesktopColumn}>
                    <ImageGallerySkeleton className={`${styles.imageGalleryDesktop} ${styles.imageGallerySkeleton}`} />
                </Col>
                <Col xs={12} sm={6} md={4}>
                    <HeaderSkeleton />
                    <PhoneOptionSkeleton />
                    <PhoneOptionSkeleton />
                    <OptionsHeaderSkeleton />
                    <PhoneOptionSkeleton />
                    <PhoneOptionSkeleton />
                    <ColourVariantOptionSkeleton />
                    <ImageGallerySkeleton className={`${styles.imageGalleryMobile} ${styles.imageGallerySkeleton}`} />
                    <PriceLoadingSkeleton includePlan={true} loading={true} />
                    <AddToCartButtonSkeleton />
                </Col>
            </Row>
        </>
    );
};

const alphabeticalOrderModel = (left: Option, right: Option) => {
    if (left.selectedValue < right.selectedValue) {
        return -1;
    } else if (left.selectedValue > right.selectedValue) {
        return 1;
    } else {
        return 0;
    }
};

const capacityOrderModel = (left: Option, right: Option) => {
    const leftValue = left.selectedValue && left.selectedValue.replace(/\D/g, "");
    const rightValue = right.selectedValue && right.selectedValue.replace(/\D/g, "");

    if (Number(leftValue) > Number(rightValue)) {
        return 1;
    } else if (Number(leftValue) < Number(rightValue)) {
        return -1;
    } else {
        return 0;
    }
};

const getProductDefaults = () => ({sku: "", images: [], price: 1200.0, options: {color: {en: "white", fr: "blanc"}}});

const enum Carrier {
    UNLOCKED = "unlocked",
}

export const ProductFinder = (props: Props) => {
    const [selected, setSelected] = React.useState(props.defaults || ["bell", "S10", "64 GB", "black"]);
    const [includePlan, setIncludePlan] = React.useState(true);
    const [pickupStore, setPickupStore] = React.useState("");
    const pickupStoreFormSubmitButtonRef = React.useRef(null);
    const {screenSize, url, language} = props;

    if (!url || url.length === 0) {
        return <div className="productFinderEmpty"></div>;
    }

    const [loading, options, error, rawOptions] = useFetch(url);

    useEffect(() => {
        if (rawOptions) {
            props.productFinderActions.sendPageloadAnalytics(rawOptions);
        } else if (error) {
            props.productFinderActions.sendErrorAnalytics(error);
        }
    }, [rawOptions, error]);

    if (error) {
        return <></>;
    } else if ((loading && !options && !error) || (!loading && !options && !error)) {
        return <Loader loading={true} loadingDisplay={<Skeleton />} />;
    } else {
        const updateSelectedOption = (position: number) => (name: string, newSelectedId: string): void => {
            setSelected(
                selected.map((oldSelectedId, i) => {
                    if (i !== position) {
                        return oldSelectedId;
                    }
                    return newSelectedId;
                }),
            );
        };

        const updateIncludePlan = () => {
            setSelected([
                includePlan ? Carrier.UNLOCKED : props.defaults[0],
                props.defaults[1],
                props.defaults[2],
                props.defaults[3],
            ]);
            setIncludePlan(!includePlan);
        };

        const getFirstOption = (option: Option) => option && option.options && option.options.allIds[0];

        const carrierOptionsTree = options.getNodeForPath(selected.slice(0, 1));

        const modelOptionsTree =
            options.getNodeForPath(selected.slice(0, 2)) ||
            (carrierOptionsTree && updateSelectedOption(1)("", getFirstOption(carrierOptionsTree)));

        const capacityOptionsTree =
            options.getNodeForPath(selected.slice(0, 3)) ||
            (modelOptionsTree && updateSelectedOption(2)("", getFirstOption(modelOptionsTree)));

        const colourOptionsTree =
            options.getNodeForPath(selected.slice(0, 4)) ||
            (capacityOptionsTree && updateSelectedOption(3)("", getFirstOption(capacityOptionsTree)));

        const {sku, images, price, options: productOptions} =
            (colourOptionsTree && (colourOptionsTree as LeafOption).product) || getProductDefaults();

        const {color} = productOptions;

        const imageProps = {
            images,
            key: sku,
            loading,
            screenSize,
        };

        const modelOptions =
            modelOptionsTree && options.getAllOptionsForPath(selected.slice(0, 1)).sort(alphabeticalOrderModel);
        const capacityOptions =
            capacityOptionsTree && options.getAllOptionsForPath(selected.slice(0, 2)).sort(capacityOrderModel);

        const onSubmit = () => {
            if (
                pickupStoreFormSubmitButtonRef &&
                pickupStoreFormSubmitButtonRef.current &&
                pickupStoreFormSubmitButtonRef.current.click &&
                typeof pickupStoreFormSubmitButtonRef.current.click === "function"
            ) {
                pickupStoreFormSubmitButtonRef.current.click();
            }

            if (includePlan && (!pickupStore || pickupStore === "")) {
                return false;
            }

            props.productFinderActions.sendAnalytics(colourOptionsTree && (colourOptionsTree as LeafOption).product);

            return true;
        };

        const rowId = !!props.id ? {id: props.id} : {};
        const carrierSelectorOptions = options.getAllOptionsForPath(selected.slice(0, 0));
        const hasUnlockedPhones = (carrierSelectorOptions || []).find(
            (option) => typeof option.label === "string" && option.label.toLowerCase().indexOf(Carrier.UNLOCKED) !== -1,
        );
        return (
            <Row {...rowId} className={styles.productFinder} data-automation="product-finder">
                <Col xs={12} sm={6} md={8} className={styles.imageGalleryDesktopColumn}>
                    <ImageGallery {...imageProps} className={styles.imageGalleryDesktop} />
                </Col>
                <Col xs={12} sm={6} md={4} data-automation="phone-finder">
                    <Header loading={loading} />
                    <div className={styles.carrierContainer}>
                        <PlanSelector
                            includePlan={includePlan}
                            loading={loading}
                            onChange={updateIncludePlan}
                            hasUnlockedOption={!!hasUnlockedPhones}
                        />
                        <CarrierSelector
                            loading={loading}
                            groupName={"phone-carrier"}
                            optionName={<FormattedMessage id={messages.selectACarrier.id} />}
                            options={carrierSelectorOptions}
                            onChange={updateSelectedOption(0)}
                            selectedValue={carrierOptionsTree && carrierOptionsTree.selectedValue}
                            includePlan={includePlan}
                        />
                    </div>
                    {screenSize.lessThan.small && <hr />}
                    <OptionsHeader loading={loading} />
                    <PhoneOption
                        loading={loading}
                        className={`${styles.toggle} ${styles.flexRadioGroup}`}
                        dataAutomation="phone-finder-model"
                        groupName={"phone-model"}
                        optionName={<FormattedMessage id={messages.model.id} />}
                        options={modelOptions}
                        onChange={updateSelectedOption(1)}
                        selectedValue={modelOptionsTree && modelOptionsTree.selectedValue}
                    />
                    <ColourVariantOptions
                        loading={loading}
                        className={styles.colourVariant}
                        colorName={color[language]}
                        groupName={"phone-colour"}
                        optionName={"Colour"}
                        options={
                            colourOptionsTree && (options.getAllOptionsForPath(selected.slice(0, 3)) as LeafOption[])
                        }
                        onChange={updateSelectedOption(3)}
                        selectedValue={colourOptionsTree && colourOptionsTree.selectedValue}
                        selectedValueLabel={colourOptionsTree && colourOptionsTree.label}
                        sku={sku}
                    />
                    <PhoneOption
                        loading={loading}
                        className={`${styles.toggle} ${styles.flexRadioGroup}`}
                        dataAutomation="phone-capacity"
                        groupName={"phone-capacity"}
                        optionName={<FormattedMessage id={messages.capacity.id} />}
                        options={capacityOptions}
                        onChange={updateSelectedOption(2)}
                        selectedValue={capacityOptionsTree && capacityOptionsTree.selectedValue}
                    />
                    <ImageGallery {...imageProps} className={styles.imageGalleryMobile} />
                    {screenSize.lessThan.small && <hr className={styles.imageGalleryDivider} />}
                    <Price loading={loading} price={price} includePlan={includePlan} />
                    {includePlan && (
                        <>
                            <hr />
                            <PickupStore
                                submitButtonRef={pickupStoreFormSubmitButtonRef}
                                setPickupStore={(storeSku) => setPickupStore(storeSku)}
                            />
                        </>
                    )}
                    <AddToCartButton
                        loading={loading}
                        offer={includePlan ? [{sku}, {sku: pickupStore}] : {sku}}
                        callback={onSubmit}
                    />
                </Col>
            </Row>
        );
    }
};

const mapStateToProps = (state: StoreState, ownProps: OwnProps) => {
    return {
        screenSize: getScreenSize(state),
        language: state.intl.language,
        url: ownProps.url,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        productFinderActions: bindActionCreators(productFinderActionCreators, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProductFinder);
