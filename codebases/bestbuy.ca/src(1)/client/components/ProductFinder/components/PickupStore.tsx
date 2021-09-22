import * as React from "react";
import {injectIntl, InjectedIntlProps} from "react-intl";
import {get} from "lodash-es";

import {Form, Select, required} from "@bbyca/bbyca-components";

import messages from "../translations/messages";
import * as styles from "../styles.css";
import STORES from "../data/pickup-stores";

interface Props {
    setPickupStore: (pickupStore: string) => void;
    submitButtonRef: React.RefObject<HTMLButtonElement>;
}

interface State {
    province: string;
    city: string;
    store: string;
}

export class PickupStore extends React.Component<Props & InjectedIntlProps, State> {
    constructor(props: Props & InjectedIntlProps) {
        super(props);

        this.state = {
            province: "",
            city: "",
            store: "",
        };
    }

    public render() {
        const {city, province, store} = this.state;
        const {
            intl: {formatMessage},
            submitButtonRef,
        } = this.props;

        return (
            <Form onSubmit={(data, e) => e.preventDefault()}>
                <h2>{formatMessage(messages.pickupStoreHeader)}</h2>
                <p>{formatMessage(messages.pickupStoreSubcopy)}</p>
                {/* tslint:disable:react-a11y-role-has-required-aria-props */}
                <Select
                    className={styles.pickupStoreSelect}
                    name="province"
                    label={formatMessage(messages.province)}
                    errorMsg={formatMessage(messages.provinceError)}
                    validators={[required]}
                    value={province}
                    handleSyncChange={this.handleChange}>
                    <option value="">{formatMessage(messages.fieldGuidance)}</option>
                    {Object.keys(STORES).map(this.toOption)}
                </Select>
                <Select
                    className={styles.pickupStoreSelect}
                    name="city"
                    label={formatMessage(messages.city)}
                    errorMsg={formatMessage(messages.cityError)}
                    validators={[required]}
                    value={city}
                    handleSyncChange={this.handleChange}>
                    <option value="">{formatMessage(messages.fieldGuidance)}</option>
                    {Object.keys(get(STORES, [province], "")).map(this.toOption)}
                </Select>
                <Select
                    className={styles.pickupStoreSelect}
                    name="store"
                    label={formatMessage(messages.store)}
                    errorMsg={formatMessage(messages.storeError)}
                    validators={[required]}
                    value={store}
                    handleSyncChange={this.handleChange}>
                    <option value="">{formatMessage(messages.fieldGuidance)}</option>
                    {Object.keys(get(STORES, [province, city], "")).map(this.toOption)}
                </Select>
                {/* tslint:enable:react-a11y-role-has-required-aria-props */}
                <button style={{display: "none;"}} type="submit" ref={submitButtonRef} />
            </Form>
        );
    }

    private handleChange = (name: string, value: string): void => {
        const {setPickupStore} = this.props;

        this.setState(
            (state) => {
                switch (name) {
                    case "province":
                        return {province: value, city: "", store: ""};
                    case "city":
                        return {...state, city: value, store: ""};
                    case "store":
                        return {...state, store: value};
                    default:
                        return {...state};
                }
            },
            () => setPickupStore(get(STORES, [this.state.province, this.state.city, this.state.store])),
        );
    };

    private toOption = (value: string): React.ReactNode => {
        return (
            /* tslint:disable:react-a11y-role-has-required-aria-props */
            <option key={value} value={value}>
                {value}
            </option>
        );
    };
}

export default injectIntl(PickupStore);
