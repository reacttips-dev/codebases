/* tslint:disable:react-a11y-role-has-required-aria-props */
import * as React from "react";
import * as styles from "./styles.css";
import {InjectedIntlProps} from "react-intl";
import messages from "./translations/messages";
import {Select, required} from "@bbyca/bbyca-components";

export interface Store {
    storeNo: string;
    storeName?: string;
    province?: string;
    city: string;
    status: string;
}

export interface Stores extends Array<Store> {}

export interface StoreSelectorStateProps {
    stores: Stores;
}

export type StoreSelectorProps = StoreSelectorStateProps & InjectedIntlProps;

export const StoreSelector: React.FC<StoreSelectorProps> = ({intl, stores}) => {
    const [selectedStore, setSelectedStore] = React.useState("");

    React.useEffect(() => {
        setSelectedStore("");
    }, [stores]);

    const handleStoreUpdate = (id: string, value: string) => {
        setSelectedStore(value);
    };

    return (
        <Select
            label={intl.formatMessage(messages.storeLocation)}
            extraAttrs={{"data-automation": "storeLocation"}}
            name="storeLocation"
            value={selectedStore}
            className={styles.mediumInput}
            handleSyncChange={handleStoreUpdate}
            helperTxt={intl.formatMessage(messages.storeLocationHelper)}
            validators={[required]}
            errorMsg={intl.formatMessage(messages.storeLocationErrorMessage)}>
            <option value="">{intl.formatMessage(messages.selectOption)}</option>
            {stores.map((store) => (
                <option value={store.storeNo} key={store.storeNo}>
                    {store.storeName}
                </option>
            ))}
        </Select>
    );
};

export default StoreSelector;
