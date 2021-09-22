import * as React from "react";
import { connect } from "react-redux";
import * as actions from "actions/educationBarActions";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { OpenButton } from "@similarweb/pro-education-bar/src/components/open-button/src/OpenButton";
import { allTrackers } from "services/track/track";

class EducationBarButton extends React.Component<{ toggleEducationBar: (boolean) => void }, {}> {
    clickHandler = () => {
        this.props.toggleEducationBar(true);
        allTrackers.trackEvent("side bar", "open", "education bar");
    };

    public render() {
        return (
            <OpenButton clickHandler={this.clickHandler}>
                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="24" viewBox="0 0 27 20">
                    <path
                        fill="#FFF"
                        fillRule="nonzero"
                        d="M25.952.785a11.72 11.72 0 0 0-12.447 2.59A11.337 11.337 0 0 0 .75 1.012 1.26 1.26 0 0 0 0 2.156v18.969c-.002.376.183.73.493.945.31.215.708.266 1.063.135a11.352 11.352 0 0 1 10.236 1.266c.514.346 1.12.53 1.74.529a3.082 3.082 0 0 0 1.704-.51 11.724 11.724 0 0 1 10.039-1.42 1.156 1.156 0 0 0 1.495-1.102V1.953a1.258 1.258 0 0 0-.818-1.169zM11.712 6.7v12.905a14.746 14.746 0 0 0-8.366-1.257V3.602a7.983 7.983 0 0 1 7.769 2.1c.229.273.429.57.597.883V6.7zm11.711 11.55v.045a15.059 15.059 0 0 0-8.365 1.462V6.7c.292-.363.557-.726.803-.961a8.34 8.34 0 0 1 7.562-2.241V18.25z"
                    />
                </svg>
            </OpenButton>
        );
    }
}

function mapDispatchToProps(dispatch): object {
    return {
        toggleEducationBar: (isOpen) => {
            dispatch(actions.toggleEducationBar(isOpen));
        },
    };
}

function mapStateToProps(): object {
    return {};
}

let component = connect(mapStateToProps, mapDispatchToProps)(EducationBarButton);
SWReactRootComponent(component, "EducationBarButton");

export default component;
