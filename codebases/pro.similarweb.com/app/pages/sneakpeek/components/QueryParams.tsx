import React, { Component } from "react";
import autobind from "autobind-decorator";
import { serializeParamsToServer } from "../dynamicParams";
import { CollectDynamiParamsValues } from "../EditDynamicParams";
import { Button } from "@similarweb/ui-components/dist/button";
import styled from "styled-components";

const Div = styled.div`
    padding-bottom: 20px;
`;

export default class QueryParams extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            dynamicParams: props.dynamicParams,
        };
    }

    @autobind
    setParamValue(paramName, newParamValue) {
        const { dynamicParams } = this.state;
        const paramObject = dynamicParams[paramName];
        this.setState({
            dynamicParams: {
                ...dynamicParams,
                [paramName]: {
                    ...paramObject,
                    value: newParamValue,
                },
            },
        });
    }

    @autobind
    onSubmit() {
        const { dynamicParams } = this.state;
        this.props.onSubmit(serializeParamsToServer(dynamicParams));
    }

    render() {
        return (
            <Div>
                <CollectDynamiParamsValues
                    dynamicParams={this.state.dynamicParams}
                    onParamValueChange={this.setParamValue}
                />
                <Button
                    height={36}
                    width={172}
                    className="configure-btn"
                    onClick={this.onSubmit}
                    style={{ marginTop: "25px" }}
                >
                    Execute Query!
                </Button>
            </Div>
        );
    }
}
