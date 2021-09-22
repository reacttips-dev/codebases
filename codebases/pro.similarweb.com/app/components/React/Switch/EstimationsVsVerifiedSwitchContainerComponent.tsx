import { swSettings } from "common/services/swSettings";
import * as React from "react";
import * as PropTypes from "prop-types";
import * as classNames from "classnames";
import { connect } from "react-redux";
import { estimatedVsGaSwitchToggle } from "../../../actions/commonActions";
import { InjectableComponent } from "../InjectableComponent/InjectableComponent";
import { VerifiedDataToggleInfoTooltip } from "../Tooltip/VerifiedDataToggleInfoTooltip/VerifiedDataToggleInfoTooltip";
import { estimationsVsGaUserPreferencesUpdate } from "../../../actions/estimationsVsGaUserPreferencesUpdate";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";
import autobind from "autobind-decorator";
import { SWReactIcons } from "@similarweb/icons";
import { SwTrack } from "services/SwTrack";

export class EstimationsVsVerifiedSwitchContainerComponent extends InjectableComponent {
    protected swSettings;
    private switcher;
    constructor(props) {
        super(props);
        // This binding is necessary to make `this` work in the callback
        this.swSettings = swSettings;
    }

    render() {
        const infoTip =
            this.swSettings.components.Home.resources.GaMode != "Skip" ? (
                <VerifiedDataToggleInfoTooltip>
                    <SWReactIcons iconName="info" className="GaInfo-icon" />
                </VerifiedDataToggleInfoTooltip>
            ) : null;
        const compAClassName = classNames({
            [this.props.compAClass]: this.props.compAClass,
            ["on"]: !this.props.showGAApprovedData,
        });
        const compBClassName = classNames({
            [this.props.compBClass]: this.props.compBClass,
            ["on"]: this.props.showGAApprovedData,
        });
        return (
            <div className={this.props.containerClassName}>
                <span onClick={this.triggerSwitchClick.bind(this)} className={compAClassName}>
                    {this.props.compAText}
                </span>
                <OnOffSwitch
                    onClick={this.onChange}
                    isSelected={this.props.showGAApprovedData}
                    isDisabled={this.props.disabled}
                />
                {/*<SwitchComponent ref={this.setRef} onChange={this.onChange} checked={this.props.showGAApprovedData} disabled={this.props.disabled}/>*/}
                <span onClick={this.triggerSwitchClick.bind(this)} className={compBClassName}>
                    {this.props.compBText}
                </span>
                {infoTip}
            </div>
        );
    }

    @autobind
    setRef(ref) {
        this.switcher = ref;
    }

    @autobind
    triggerSwitchClick() {
        this.switcher.click();
    }

    @autobind
    onChange() {
        //Fire tracking events
        const checked = !this.props.showGAApprovedData;
        const selected = !checked ? this.props.compAText : this.props.compBText;
        SwTrack.all.trackEvent("toggle", "click", "display data/" + selected);
        this.props.onChange(checked);
    }

    static propTypes = {
        disabled: PropTypes.bool,
        checked: PropTypes.bool,
    };
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

const connectedComponent = connect(
    mapStateToProps,
    mapDispatchToProps,
)(EstimationsVsVerifiedSwitchContainerComponent);

SWReactRootComponent(connectedComponent, "EstimationsVsVerifiedSwitchContainerComponent");

export default connectedComponent;
