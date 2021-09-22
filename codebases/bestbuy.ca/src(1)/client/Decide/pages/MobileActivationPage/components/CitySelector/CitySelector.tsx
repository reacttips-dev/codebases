/* tslint:disable:react-a11y-role-has-required-aria-props */
import * as React from "react";
import {InjectedIntlProps} from "react-intl";
import {Select, required} from "@bbyca/bbyca-components";

import messages from "./translations/messages";
import * as styles from "./styles.css";

export interface Cities extends Array<string> {}

export interface CitySelectorStateProps {
    cities: Cities;
    onCityUpdate: (value: string) => void;
}

export type CitySelectorProps = CitySelectorStateProps & InjectedIntlProps;

export const CitySelector: React.FC<CitySelectorProps> = ({intl, cities, onCityUpdate}) => {
    const [selectedCity, setSelectedCity] = React.useState("");

    React.useEffect(() => {
        setSelectedCity("");
    }, [cities]);

    const handleCityUpdate = (id: string, value: string) => {
        setSelectedCity(value);
        onCityUpdate(value);
    };

    return (
        <Select
            label={intl.formatMessage(messages.city)}
            extraAttrs={{"data-automation": "city"}}
            name="city"
            value={selectedCity}
            className={styles.mediumInput}
            validators={[required]}
            errorMsg={intl.formatMessage(messages.cityError)}
            handleSyncChange={handleCityUpdate}>
            <option value="">{intl.formatMessage(messages.selectOption)}</option>
            {cities.map((city) => (
                <option value={city} key={city}>
                    {city}
                </option>
            ))}
        </Select>
    );
};

export default CitySelector;
