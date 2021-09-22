import React from "react";
import _ from "lodash";
import styled from "styled-components";
import { Button, ButtonLabel, IconButton } from "@similarweb/ui-components/dist/button";
import I18n from "components/React/Filters/I18n";
import { i18nFilter } from "filters/ngFilters";
import { allTrackers } from "services/track/track";
import { IProModalCustomStyles, ProModal } from "components/Modals/src/ProModal";
import { LeadGeneratorBox } from "../../../components/elements";
import { AddGrowthMetricModal } from "../../../dialogs/AddGrowthMetricModal";
import { getClientValueGrowth, setServerValueGrowth } from "../filters/GrowthFilters";
import { IDesktopOnlyBoxProps } from "./DesktopOnlyBox";
import { isDesktopDevice } from "pages/lead-generator/lead-generator-new/helpers";
import StyledFiltersBox from "pages/lead-generator/lead-generator-new/components/FiltersBox/StyledFiltersBox";

// TODO: Refactor, extract

export interface IFilterRowProps {
    isActive: boolean;
}

export interface IChangedStyleProps extends IFilterRowProps {
    trend: string;
    value: number;
}

const proModalStyles: IProModalCustomStyles = {
    content: {
        width: "420px",
        height: "287px",
        padding: "24px",
    },
    overlay: {
        backgroundColor: "rgba(27,38,83,0.9)",
        zIndex: 1000,
    },
};

const SelectedFilters = styled.div`
    font-family: Roboto;
    font-size: 14px;
    color: rgb(42, 62, 82);
`;

export const Row = styled.div`
    display: flex;
    align-items: center;
    opacity: 0.8;
    border-top: 1px solid #e5e7ea;
    width: 100%;
    height: 56px;
    box-sizing: border-box;
    padding: 0 8px;
`;

const Footer = styled(Row)`
    opacity: 1;
    justify-content: flex-end;
`;

const GrowthBoxWapper = styled.div`
    ${LeadGeneratorBox} {
        padding-bottom: 0;
    }
`;

function AddFilterButton({ hasSelectedFilters, onClick }) {
    if (hasSelectedFilters) {
        return (
            <Button type="flat" onClick={onClick}>
                <ButtonLabel>
                    <I18n>grow.lead_generator.new.growth_filters.add_filter</I18n>
                </ButtonLabel>
            </Button>
        );
    }

    return (
        <IconButton type={"flat"} iconName="add" onClick={onClick}>
            <ButtonLabel>
                <I18n>grow.lead_generator.new.growth_filters.create_filter</I18n>
            </ButtonLabel>
        </IconButton>
    );
}

class GrowthBox extends React.Component<IDesktopOnlyBoxProps, any> {
    public state = {
        isOpen: false,
        filterInEdit: {} as any,
    };

    public onToggle = () => {
        const { setActive, isActive, title } = this.props;
        setActive(!isActive);
        const state = isActive ? "off" : "on";
        allTrackers.trackEvent("toggle", "switch", `${i18nFilter()(title)}/${state}`);
    };

    public openModal = (filter = {}) => {
        this.setState({
            isOpen: true,
            filterInEdit: filter,
        });
    };

    public closeModal = () => {
        this.setState({
            isOpen: false,
            filterInEdit: {},
        });
        allTrackers.trackEvent("Pop Up", "close", "lead generation reports/growth/create_filter");
    };

    public addFilter = (filter) => {
        const crrFilters = this.getSelectedFilters().filter(
            (item) => item.name !== filter.name && item.name !== this.state.filterInEdit.name,
        );
        const newSelectedFilters = [...crrFilters, filter];

        this.setSelectedFilters(newSelectedFilters);
        this.setState({
            filterInEdit: {},
            isOpen: false,
        });

        allTrackers.trackEvent(
            "Add Growth Filter",
            `submit-ok`,
            `${filter.name}/${filter.period}/${newSelectedFilters.length}`,
        );
    };

    public editFilter = (filter) => {
        this.openModal(filter);
    };

    public removeFilter = (filter) => {
        const newFiltersToSave = this.getSelectedFilters().filter(
            (item) => item.name !== filter.name,
        );
        this.setSelectedFilters(newFiltersToSave);
        this.setState({
            isOpen: false,
            filterInEdit: {},
        });
    };

    public setSelectedFilters(value) {
        setServerValueGrowth(this.props.filters[0], value);
        this.props.setActive(value.length > 0);
    }

    public getSelectedFilters() {
        return getClientValueGrowth(this.props.filters[0].getValue());
    }

    public getAvailableGrowthFilters() {
        const availableGrowthFilters = Object.values(this.props.filters[0].availableMetrics);
        const selectedGrowthFilters = this.getSelectedFilters();

        return availableGrowthFilters.filter(({ name }) =>
            selectedGrowthFilters.every(({ name: n }) => name !== n),
        );
    }

    public hasSelectedFilters(): boolean {
        return this.getSelectedFilters().length > 0;
    }

    public hasAvailableFilters(): boolean {
        return this.getAvailableGrowthFilters().length > 0;
    }

    public onAddFilter = (): void => {
        this.openModal();
        allTrackers.trackEvent("Pop Up", "open", "lead generation reports/growth/create_filter");
    };

    render(): JSX.Element {
        const { isOpen } = this.state;
        const { filters, device, technologies, ...rest } = this.props;
        let availableGrowthFilters = this.getAvailableGrowthFilters();

        if (!_.isEmpty(this.state.filterInEdit)) {
            availableGrowthFilters = [this.state.filterInEdit, ...availableGrowthFilters];
        }

        return (
            <GrowthBoxWapper>
                <StyledFiltersBox isDesktopOnly={isDesktopDevice(device)} {...rest}>
                    <SelectedFilters>
                        {filters.map((filter) => {
                            const { component: Component } = filter;
                            return (
                                <Component
                                    filters={filters}
                                    filter={filter}
                                    technologies={technologies}
                                    isActive={this.props.isActive}
                                    editFilter={this.editFilter}
                                    removeFilter={this.removeFilter}
                                    key={filter.stateName}
                                />
                            );
                        })}
                    </SelectedFilters>
                    <ProModal
                        isOpen={isOpen}
                        shouldCloseOnOverlayClick={false}
                        onCloseClick={this.closeModal}
                        customStyles={proModalStyles}
                    >
                        <AddGrowthMetricModal
                            availableGrowthFilters={availableGrowthFilters}
                            onAdd={this.addFilter}
                            onCancel={this.closeModal}
                            selectedFilter={this.state.filterInEdit}
                        />
                    </ProModal>
                    <Footer>
                        {this.hasAvailableFilters() && (
                            <AddFilterButton
                                hasSelectedFilters={this.hasSelectedFilters()}
                                onClick={this.onAddFilter}
                            />
                        )}
                    </Footer>
                </StyledFiltersBox>
            </GrowthBoxWapper>
        );
    }
}

export default GrowthBox;
