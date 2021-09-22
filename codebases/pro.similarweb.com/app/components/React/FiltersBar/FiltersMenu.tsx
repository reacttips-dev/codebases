import { IconButton } from "@similarweb/ui-components/dist/button";
import { ISidebarListItem, SidebarList } from "@similarweb/ui-components/dist/sidebar";
import * as React from "react";
import { PureComponent } from "react";
import styled from "styled-components";

export interface IFiltersMenuProps {
    compactFilters?: ISidebarListItem[];
    isSideBarOpen: boolean;
    toggleSidebar?(): void;
    onSidebarToggle?(isOpen: boolean): void;
}

export const FiltersMenuStyle = styled.span`
    position: absolute;
    right: 5px;
    top: 12px;
`;

export class FiltersMenu extends PureComponent<IFiltersMenuProps> {
    public static propTypes = {};

    public static defaultProps = {
        width: "100%",
        toggleSidebar: (isOpen) => null,
        isSideBarOpen: false,
    };
    private sideBarToggler;

    public constructor(props, context) {
        super(props, context);
    }

    public render() {
        const { compactFilters, isSideBarOpen, toggleSidebar, onSidebarToggle } = this.props;
        return (
            <>
                <FiltersMenuStyle ref={(el) => (this.sideBarToggler = el)}>
                    <IconButton onClick={toggleSidebar} type="flat" iconName="dots-more" />
                </FiltersMenuStyle>
                <SidebarList
                    sideBarToggler={this.sideBarToggler}
                    isSidebarOpen={isSideBarOpen}
                    listItems={compactFilters}
                    onSidebarToggle={onSidebarToggle}
                />
            </>
        );
    }
}
