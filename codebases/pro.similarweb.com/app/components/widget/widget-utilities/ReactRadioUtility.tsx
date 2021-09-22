import React, { Component } from "react";
import { RadioSwitcher } from "components/React/switcher/RadioSwitcher";
import autobind from "autobind-decorator";
import styled from "styled-components";

/** the purpose of this class is to trigger the re-rendering upon selecting an item */

const StyledRadioUtility = styled(RadioSwitcher)`
    .radio-container {
        padding: 7.5px 20px;
    }
` as any;

export default class ReactRadioUtility extends Component<any, any> {
    constructor(props) {
        super(props);
        const { selectedValue } = props;
        this.state = {
            selectedValue,
        };
    }
    @autobind
    onChange(value) {
        const selectedValue = this.props.onChange(value);
        if (selectedValue !== this.state.selectedValue) {
            this.setState({
                selectedValue,
            });
        }
    }
    render() {
        const { items } = this.props;
        const { selectedValue } = this.state;
        return (
            <StyledRadioUtility
                onChange={this.onChange}
                items={items}
                selectedValue={selectedValue}
                className="radio-switcher-container"
            />
        );
    }
}
