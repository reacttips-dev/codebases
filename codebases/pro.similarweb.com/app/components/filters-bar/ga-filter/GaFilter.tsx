import { SWReactIcons } from "@similarweb/icons";
import autobind from "autobind-decorator";
import * as classnames from "classnames";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import * as _ from "lodash";
import * as PropTypes from "prop-types";
import * as React from "react";
import { connect } from "react-redux";
import { estimatedVsGaSwitchToggle } from "../../../actions/commonActions";
import { estimationsVsGaUserPreferencesUpdate } from "../../../actions/estimationsVsGaUserPreferencesUpdate";
import SWReactRootComponent from "../../../decorators/SWReactRootComponent";
import { VerifiedDataToggleInfoTooltip } from "../../React/Tooltip/VerifiedDataToggleInfoTooltip/VerifiedDataToggleInfoTooltip";

import { IOnOffSwitchProps, OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import "./GaFilter.scss";
import { SwTrack } from "services/SwTrack";

export interface IGaFilterProps extends IOnOffSwitchProps {
    isDisabled?: boolean;
    label: string;
    showGAApprovedData?: boolean;
    GaText?: string;
    SwText?: string;
    onChange?: (gaFlag: boolean) => void;
}

export class GaFilter extends React.Component<IGaFilterProps, any> {
    private services;

    public static propTypes = {
        isDisabled: PropTypes.bool,
        showGAApprovedData: PropTypes.bool,
        GaText: PropTypes.string,
        SwText: PropTypes.string,
        onChange: PropTypes.func,
    };

    public static defaultProps = {
        isDisabled: false,
        GaText: "GA",
        SwText: "SW",
    };

    constructor(props, context) {
        super(props, context);
        this.services = {
            swSettings,
        };
        this.state = {
            showGAApprovedData: false,
        };
    }

    public render() {
        const { isDisabled, className, label, showGAApprovedData } = this.props;
        const classNames = classnames("GaFilter", isDisabled ? "GaFilter--disabled" : null);
        const infoTip =
            this.services.swSettings.components.Home.resources.GaMode != "Skip" ? (
                <VerifiedDataToggleInfoTooltip>
                    <span>
                        <SWReactIcons iconName="info" className="GaInfo-icon" />
                    </span>
                </VerifiedDataToggleInfoTooltip>
            ) : (
                ""
            );
        return (
            <div className={classNames} onClick={isDisabled ? _.noop : this.onClick}>
                <div className="GaFilter-container">
                    {label} <SWReactIcons iconName="ga-icon" className="GaFilter-icon" />
                    {infoTip}
                </div>
                <OnOffSwitch
                    className={className}
                    onClick={_.noop}
                    isSelected={showGAApprovedData}
                    isDisabled={isDisabled}
                />
            </div>
        );
    }

    @autobind
    public onClick() {
        //Fire tracking events
        const isGASelected = !this.props.showGAApprovedData;
        const selectedText = !isGASelected ? this.props.SwText : this.props.GaText;
        SwTrack.all.trackEvent("toggle", "click", "display data/" + selectedText);
        this.props.onChange(isGASelected);
    }
}

function mapStateToProps({ common }) {
    const { showGAApprovedData } = common;
    return {
        showGAApprovedData,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        onChange: (checked) => {
            dispatch(estimatedVsGaSwitchToggle(checked));
            dispatch(
                estimationsVsGaUserPreferencesUpdate({
                    type: "WebsiteAnalysisVerifiedData",
                    isEnabled: checked,
                }),
            );
        },
    };
}

const connectedComponent = connect(mapStateToProps, mapDispatchToProps)(GaFilter);

SWReactRootComponent(connectedComponent, "GaFilter");

export default connectedComponent;
