import * as React from "react";
import { Dropdown, EllipsisDropdownItem } from "@similarweb/ui-components/dist/dropdown";
import { Button } from "@similarweb/ui-components/dist/button";
import * as _ from "lodash";

export interface IMarketingWorkspaceMoreDropdownButtonProps {
    buttonLabel: string;
    options: Array<{ label: string; action: () => void }>;
    onDropdownToggle?: (isOpen: boolean) => void;
}
export class MarketingWorkspaceMoreDropdownButton extends React.Component<
    IMarketingWorkspaceMoreDropdownButtonProps
> {
    private onDropdownComponentClick = ({ id }) => {
        const { options } = this.props;

        if (_.isFunction(options[id].action)) {
            options[id].action();
        }
    };
    render() {
        const { options, buttonLabel, onDropdownToggle } = this.props;
        return (
            <Dropdown
                width={227}
                onClick={this.onDropdownComponentClick}
                onToggle={onDropdownToggle}
                buttonWidth="auto"
            >
                {[
                    <Button key={`${buttonLabel}_title`} type="flat">
                        {buttonLabel}
                    </Button>,
                    ...options.map((option, idx) => (
                        <EllipsisDropdownItem key={`${idx}_${option.label}`} id={idx}>
                            {option.label}
                        </EllipsisDropdownItem>
                    )),
                ]}
            </Dropdown>
        );
    }
}
