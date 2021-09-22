import React, { Component } from "react";
import { Button } from "@similarweb/ui-components/dist/button";
import { i18nFilter } from "../../../../../../filters/ngFilters";

class ClearAllButton extends Component<any, any> {
    public static getDerivedStateFromProps(props, state) {
        const { onReset, ...selectedFilters } = props;
        let disabled = true;
        if (Object.values(selectedFilters).join() !== state.selectedFilters) {
            disabled = false;
        }

        if (state.disabled !== disabled) {
            return {
                disabled,
            };
        }

        return null;
    }

    constructor(props) {
        super(props);
        const { onReset, ...selectedFilters } = props;
        this.state = {
            disabled: true,
            selectedFilters: Object.values(selectedFilters).join(),
        };
    }

    public render() {
        const buttonText = i18nFilter()("analysis.source.search.keywords.filters.clear_all");
        const { onReset } = this.props;
        const { disabled } = this.state;
        return (
            <Button
                dataAutomation="Clear Button"
                type="flat"
                isDisabled={disabled}
                onClick={onReset}
            >
                {buttonText}
            </Button>
        );
    }
}

export default ClearAllButton;
