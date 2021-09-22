import * as React from "react";
import { Component } from "react";
import { Switcher, TextSwitcherItem } from "@similarweb/ui-components/dist/switcher";
import I18n from "../../../../../components/React/Filters/I18n";
import { SwitcherContainer, SwitcherTitle } from "../elements";
import * as _ from "lodash";

interface ISwitcherCtrlProps {
    firstFilter: any;
    secondFilter: any;
    filtersOptions: string[];
    filtersDisclaimers?: string[];
    title?: string;
    onChange?(index: number): void;
}

interface ISwitcherCtrlState {
    selectedFilter: number;
}

class SwitcherCtrl extends Component<ISwitcherCtrlProps, ISwitcherCtrlState> {
    constructor(props) {
        super(props);

        let selectedFilter = 0;
        props.firstFilter.hideInBox = false;
        props.secondFilter.hideInBox = true;
        if (props.secondFilter.getValue() !== props.secondFilter.initValue) {
            selectedFilter = 1;
            props.firstFilter.hideInBox = true;
            props.secondFilter.hideInBox = false;
        }
        props.firstFilter.setValue({ [props.firstFilter.stateName]: props.firstFilter.getValue() });
        props.secondFilter.setValue({
            [props.secondFilter.stateName]: props.secondFilter.getValue(),
        });

        this.state = {
            selectedFilter,
        };
    }

    static defaultProps = {
        onChange: (index: number) => _.noop,
    };

    private onChangeFilter = (selectedFilter) => {
        this.setState({ selectedFilter });
        this.props.firstFilter.hideInBox = !this.props.firstFilter.hideInBox;
        this.props.secondFilter.hideInBox = !this.props.secondFilter.hideInBox;
        this.props.firstFilter.setValue({
            [this.props.firstFilter.stateName]: this.props.secondFilter.getValue(),
            [this.props.secondFilter.stateName]: this.props.firstFilter.getValue(),
        });
        this.props.onChange(selectedFilter);
    };

    public render() {
        return (
            <div>
                <SwitcherContainer>
                    {this.props.title && (
                        <SwitcherTitle>
                            <I18n>{this.props.title}</I18n>
                        </SwitcherTitle>
                    )}
                    <Switcher
                        selectedIndex={this.state.selectedFilter}
                        customClass="TextSwitcher"
                        onItemClick={this.onChangeFilter}
                    >
                        {this.props.filtersOptions.map((item) => (
                            <TextSwitcherItem key={`${item}SWITCHER`}>
                                <I18n>{item}</I18n>
                            </TextSwitcherItem>
                        ))}
                    </Switcher>
                </SwitcherContainer>
                {this.props.filtersDisclaimers && (
                    <p>
                        <I18n>{this.props.filtersDisclaimers[this.state.selectedFilter]}</I18n>
                    </p>
                )}
            </div>
        );
    }
}

export default SwitcherCtrl;
