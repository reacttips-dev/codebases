/* tslint:disable:react-a11y-role-has-required-aria-props */
// Disabling this role because it's the browser's responsibility to provide the correct behaviour for the elements with implicit roles.
// For example: <option></option>, the browser provides an implicit role=“option”
// and is also providing an implicit aria-selected equivalent (via the accessibility API),
// so there's no need for the markup to provide an explicit property here.
// This is the issue with Tslint and it has been deprecated (https://github.com/microsoft/tslint-microsoft-contrib/issues/409)
import * as React from "react";
import * as styles from "./style.css";
import {Select} from "@bbyca/bbyca-components";

export interface Option {
    value: string;
    label: string;
}

interface Props {
    optionSelected: string;
    dropdownTitle: string;
    options: Option[];
    onOptionChange: (targetValue: number) => any;
    className?: string;
}

export class Dropdown extends React.Component<Props, null> {
    public render() {
        const {optionSelected, dropdownTitle, options, className = ""} = this.props;
        return (
            this.props.options.length && (
                <Select
                    name={dropdownTitle}
                    className={`${className} ${styles.select}`}
                    value={optionSelected}
                    handleSyncChange={this.onSelectedValueChange}
                    aria-label={dropdownTitle}
                    data-automation="dropdown"
                    label={dropdownTitle}>
                    {this.renderOptions(options)}
                </Select>
            )
        );
    }

    private renderOptions = (options) => {
        return options.map((option) => (
            <option value={option.value} aria-label={option.label} key={option.value} data-automation="dropdown-option">
                {option.label}
            </option>
        ));
    };

    private onSelectedValueChange = (id, value) => {
        this.props.onOptionChange(value);
    };
}

export default Dropdown;
