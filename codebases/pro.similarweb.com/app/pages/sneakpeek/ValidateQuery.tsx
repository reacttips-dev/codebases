import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { Injector } from "common/ioc/Injector";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { stringify } from "querystring";
import React, { Component } from "react";
import DurationService from "services/DurationService";
import { allTrackers } from "services/track/track";
import styled from "styled-components";
import Alert from "./components/Alert";
import { SneakpeekApiService } from "./SneakpeekApiService";

const Loader = styled.div`
    height: 20px;
    padding: 10px 40px;
`;

@SWReactRootComponent
export class ValidateQuery extends Component<any, any> {
    private swNavigator;
    private module;

    constructor(props) {
        super(props);
        this.swNavigator = Injector.get("swNavigator");
        this.module = this.swNavigator.current().name.split(".")[0];
        this.state = {
            isValid: true,
            message: "",
            showLoader: false,
            showMsg: false,
        };
    }

    public render() {
        return (
            <div>
                {this.state.showLoader && (
                    <Loader>
                        <DotsLoader />
                    </Loader>
                )}
                {this.state.showMsg && (
                    <Alert text={this.state.message} isValid={this.state.isValid} />
                )}
            </div>
        );
    }

    public normalizeParams = (params) => {
        const keyParams = ["keyword", "keywords", "appId"];
        const retParams = {};
        Object.entries(params).forEach(
            ([param, value]) => (retParams[keyParams.includes(param) ? "key" : param] = value),
        );

        return retParams;
    };

    public runValidation = () => {
        const swNavigator = Injector.get("swNavigator") as any;
        const params = swNavigator.getParams();
        const normalizeParams = this.normalizeParams(params);
        const { from, to } = DurationService.getDurationData(params.duration).forAPI;
        const apiParams = `type=${this.props.type}&database=${this.props.database}&${stringify({
            ...normalizeParams,
            from,
            to,
        })}`;

        this.setState(
            {
                showLoader: true,
                showMsg: false,
            },
            () => {
                SneakpeekApiService.validateQury(
                    apiParams,
                    this.props.sql,
                    this.props.dynamicParams,
                    this.props.database,
                    this.props.granularity,
                )
                    .then(() => this.setAlert(true, "Query is valid"))
                    .catch((data) => this.setAlert(false, `Query is NOT valid: ${data.message}`));
            },
        );

        allTrackers.trackEvent(`sneakpeek/query/${this.module}`, "validate query", this.props.sql);
    };

    public componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if ((prevProps.sql !== this.props.sql || !!this.props.sql) && prevState.showMsg) {
            this.setState({ showMsg: false });
        }
    }

    public setAlert = (isValid, message) => {
        this.setState({
            showLoader: false,
            showMsg: true,
            isValid,
            message,
        });
    };
}
