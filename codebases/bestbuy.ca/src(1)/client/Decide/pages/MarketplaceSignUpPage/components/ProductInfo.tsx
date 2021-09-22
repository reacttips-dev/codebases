import * as React from "react";
import {useState} from "react";
import {FormattedMessage, InjectedIntlProps, injectIntl} from "react-intl";
import {Input, Checkbox, RadioButton, RadioGroup, required} from "@bbyca/bbyca-components";
import messages from "./translations/messages";
import * as styles from "./styles.css";
import {RadioButtonOption} from "../FormOptions";
import * as Constants from "../constants";

interface ProductCategories {
    label: string;
    sfKey: string;
    currentValue: string;
    name: string;
    tag: string;
    errorMsg: string;
}

export const ProductInfo: React.FC<InjectedIntlProps> = ({intl}) => {
    const initialProductCategoriesState: ProductCategories[] = [
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c1",
            tag: "appliance-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsAppliance}),
            sfKey: "Appliances",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c2",
            tag: "baby-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsBaby}),
            sfKey: "Baby & Maternity",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c3",
            tag: "beauty-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsBeauty}),
            sfKey: "Beauty & Personal Care",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c4",
            tag: "bedding-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsBedding}),
            sfKey: "Bedding, Bathroom & Lighting",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c5",
            tag: "cameras-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsCameras}),
            sfKey: "Cameras, Camcorders & Drones",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c6",
            tag: "car-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsCar}),
            sfKey: "Car Electronics & Dash Cams",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c7",
            tag: "cellphones-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsCellPhones}),
            sfKey: "Cell Phones & Accessories",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c8",
            tag: "computer-accessories-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsComputerAccessories}),
            sfKey: "Computer Accessories",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c9",
            tag: "computers-tablets-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsComputers}),
            sfKey: "Computers & Tablets",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c10",
            tag: "fashion-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsFashion}),
            sfKey: "Fashion & Apparel",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c11",
            tag: "headphones-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsHeadphones}),
            sfKey: "Headphones, Speakers & Audio",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c12",
            tag: "health-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsHealth}),
            sfKey: "Health & Fitness",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c13",
            tag: "homedecor-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsHomedecor}),
            sfKey: "Home Décor",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c14",
            tag: "furniture-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsFurniture}),
            sfKey: "Home Furniture",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c15",
            tag: "jewelery-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsJewelery}),
            sfKey: "Jewelry",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c16",
            tag: "kitchen-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsKitchen}),
            sfKey: "Kitchen & Dining",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c17",
            tag: "luggage-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsLuggage}),
            sfKey: "Luggage & Bags",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c18",
            tag: "musicalInstruments-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsMusicalInstruments}),
            sfKey: "Musical Instruments",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c19",
            tag: "movies-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsMovies}),
            sfKey: "Music & Movies",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c20",
            tag: "office-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsOfficeSupplies}),
            sfKey: "Office Supplies & Ink",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c21",
            tag: "patio-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsPatioFurniture}),
            sfKey: "Patio Furniture & Outdoor Cooking",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c22",
            tag: "pet-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsPetSupplies}),
            sfKey: "Pet Supplies",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c23",
            tag: "smartHome-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsSmartHome}),
            sfKey: "Smart Home",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c24",
            tag: "sports-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsSports}),
            sfKey: "Sports & Recreation",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c25",
            tag: "tools-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsTools}),
            sfKey: "Tools, Hardware & Gardening",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c26",
            tag: "toys-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsToys}),
            sfKey: "Toys, Drones & Education",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c27",
            tag: "tv-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsTV}),
            sfKey: "TV & Home Theatre",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c28",
            tag: "videoGames-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsVideoGames}),
            sfKey: "Video Games, Platforms & Accessories",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c29",
            tag: "watches-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsWatches}),
            sfKey: "Watches",
            currentValue: "",
        },
        {
            errorMsg: "",
            name: "00Nf400000KIAcT-c30",
            tag: "wearables-checkBox",
            label: intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsWearables}),
            sfKey: "Wearable Technology",
            currentValue: "",
        },
    ];

    const [productError, setProductError] = useState(false);
    const [checkboxValidationTriggered, setCheckboxValidationTriggered] = useState(false);
    const [productCategoriesState, setProductCategoriesState] = useState(initialProductCategoriesState);
    const handleProductCategoryChange: (index: number, val: string, sfKey: string) => void = (index, val, sfKey) => {
        const prodState = [...productCategoriesState];
        prodState[index].currentValue = val === "checked" ? sfKey : "";
        setProductCategoriesState(prodState);
        if (checkboxValidationTriggered) {
            productSelected(val);
        }
    };
    const productSelected: (val: string) => boolean = (val) => {
        const valid = !!val || productCategoriesState.filter((prodCatItem) => !!prodCatItem.currentValue).length > 0;
        setProductError(!valid);
        if (!valid) {
            setCheckboxValidationTriggered(true);
        }
        return valid;
    };

    return (
        <>
            <h3 data-automation="product-information-header" className={styles.sectionTitle}>
                <FormattedMessage {...messages.marketplaceSignUpFormFieldProductsTitle} />
            </h3>

            <Input
                className={styles.halfinput}
                extraAttrs={{"data-automation": "how-many-products-input"}}
                type="number"
                label={intl.formatMessage({...messages.marketplaceSignUpFormFieldProducts})}
                validators={[required]}
                errorMsg={intl.formatMessage({...messages.marketplaceSignUpFormFieldProductsError})}
                maxLength={10}
                name={Constants.HOW_MANY_SKUS}
            />

            <label data-automation="categories-label" className={styles.categoriesLabel}>
                <FormattedMessage {...messages.marketplaceSignUpFormFieldProductCategory} />
            </label>

            <div className={styles.checkBoxRow}>
                {productCategoriesState.map((data, index) => (
                    <div className={styles.checkBoxColumn}>
                        <Checkbox
                            key={index}
                            name={data.name}
                            label={data.label}
                            value={data.currentValue}
                            data-automation={data.tag}
                            extraAttrs={{"data-automation": data.tag}}
                            handleAsyncChange={(name, val) => handleProductCategoryChange(index, val, data.sfKey)}
                            validators={[productSelected]}
                            error={productError}
                            errorMsg={data.errorMsg}
                        />
                    </div>
                ))}
            </div>

            {productError && (
                <div data-automation="categories-error" className={styles.errorMsg}>
                    <FormattedMessage {...messages.marketplaceSignUpFormFieldProductCategoryError} />
                </div>
            )}

            <div className={styles.brandsLabel} data-automation="brands-div">
                <Input
                    className={styles.halfinput}
                    label={intl.formatMessage({...messages.marketplaceSignUpFormFieldProductBrands})}
                    extraAttrs={{"data-automation": "brands-input"}}
                    helperTxt={intl.formatMessage({...messages.marketplaceSignUpFormBrandsHelper})}
                    name="00Nf400000KIAcw"
                />
            </div>

            <RadioGroup className={styles.radioGroup} name={Constants.UPC_LABEL} value="">
                <label data-automation="upc-label">
                    <FormattedMessage {...messages.marketplaceSignUpFormFieldProductUseUPC} />
                </label>
                <RadioButton
                    extraAttrs={{"data-automation": "upc-yes-radioButton"}}
                    label={intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsYes})}
                    selectedValue={RadioButtonOption.yes}
                />
                <RadioButton
                    extraAttrs={{"data-automation": "upc-no-radioButton"}}
                    label={intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsNo})}
                    selectedValue={RadioButtonOption.no}
                />
            </RadioGroup>

            <RadioGroup className={styles.radioGroup} name={Constants.PROVIDE_IMAGES} value="">
                <label data-automation="images-label">
                    <FormattedMessage {...messages.marketplaceSignUpFormFieldProductProvideImages} />
                </label>
                <RadioButton
                    extraAttrs={{"data-automation": "images-yes-radioButton"}}
                    label={intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsYes})}
                    selectedValue={RadioButtonOption.yes}
                />
                <RadioButton
                    extraAttrs={{"data-automation": "images-no-radioButton"}}
                    label={intl.formatMessage({...messages.marketplaceSignUpFormFieldOptionsNo})}
                    selectedValue={RadioButtonOption.no}
                />
            </RadioGroup>
        </>
    );
};

export default injectIntl(ProductInfo);
