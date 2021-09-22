import * as React from "react";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import I18n from "../Filters/I18n";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { StatelessComponent } from "react";

const AddToDashboardModalButton: StatelessComponent<any> = (props) => {
    let key;
    if (props.isSaving && props.isSuccess) {
        key = props.multipleDashboards
            ? "common.addtodashboard.wizard.cta.done.multiple"
            : "common.addtodashboard.wizard.cta.done";
    } else {
        key = "common.addtodashboard.wizard.cta";
    }
    return (
        <Button
            style={{ marginTop: "27px", minWidth: "104px" }}
            type={props.type}
            isDisabled={props.isDisabled}
            onClick={props.onClick}
        >
            <ButtonLabel>
                <I18n>{key}</I18n>
            </ButtonLabel>
        </Button>
    );
};
export default SWReactRootComponent(AddToDashboardModalButton, "AddToDashboardModalButton");

AddToDashboardModalButton.defaultProps = {
    type: "",
};
