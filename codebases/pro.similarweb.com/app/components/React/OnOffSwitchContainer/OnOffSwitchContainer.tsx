import * as React from "react";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { OnOffSwitch } from "@similarweb/ui-components/dist/on-off-switch";

@SWReactRootComponent
export class OnOffSwitchContainer extends React.PureComponent<
    { isSelected: boolean; onToggle: (isSelected) => {} },
    { isSelected: boolean }
> {
    constructor(props) {
        super(props);
        this.state = {
            isSelected: this.props.isSelected,
        };
    }

    public onItemClick = (event) => {
        this.setState({
            isSelected: !this.state.isSelected,
        });
        this.props.onToggle(!this.state.isSelected);
    };

    public render() {
        return <OnOffSwitch isSelected={this.state.isSelected} onClick={this.onItemClick} />;
    }
}
