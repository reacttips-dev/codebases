import React, { Component } from "react";
import { IReactWidgetUtilityComponentProps } from "components/widget/widget-utilities/react-component";
import { SitesDropDown } from "@similarweb/ui-components/dist/dropdown";
import { Injector } from "common/ioc/Injector";
import autobind from "autobind-decorator";
import styled from "styled-components";

const SelectorContainer = styled.div`
    width: 160px;
`;
export default class ReactDomainSelector extends Component<
    IReactWidgetUtilityComponentProps<any>,
    any
> {
    constructor(props) {
        super(props);
        const { widget } = props;
        const state: any = {
            sites: widget.getProperties(true).key.map((item) => ({
                name: item.id,
                id: item.id,
                displayName: item.id,
                imageUrl: null,
            })),
        };
        state.selectedSiteId = state.sites.find(
            ({ id }) => id === widget.apiParams.keys.split(",")[0],
        ).id;
        this.state = state;
    }
    @autobind
    onChange({ id }) {
        const { widget } = this.props;
        widget.apiParams = { keys: id };
        widget.emit("widgetKeyChanged", id);
        this.setState({
            selectedSiteId: id,
        });
    }

    async componentWillMount() {
        const { $scope, widget } = this.props;
        const sitesResource: any = Injector.get("sitesResource");
        // update selected option when the "outside world" is changing  the widget selected key
        $scope.$watch("ctrl.widget.apiParams.keys", (newVal, oldVal) => {
            if (newVal !== oldVal) {
                this.setState({
                    selectedSite: newVal,
                });
            }
        });
        const icons = await Promise.all(
            this.state.sites.map(
                (item) =>
                    new Promise((resolve, reject) =>
                        sitesResource.GetWebsiteImage({ website: item.name }, (data) =>
                            resolve(data.image),
                        ),
                    ),
            ),
        );
        this.setState(({ sites }) => ({
            sites: icons.map((icon, index) => {
                const item = sites[index];
                return {
                    ...item,
                    imageUrl: icon,
                };
            }),
        }));
    }

    render() {
        const { sites, selectedSiteId } = this.state;
        return (
            <SitesDropDown sites={sites} selectedSite={selectedSiteId} onClick={this.onChange} />
        );
    }
}
