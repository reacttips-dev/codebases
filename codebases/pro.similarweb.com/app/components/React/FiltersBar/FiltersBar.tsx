import * as React from "react";
import { PureComponent } from "react";
import styled from "styled-components";

export interface IFilter {
    id: string;
    filter: JSX.Element;
}

export interface IFiltersBarProps {
    filters: IFilter[];
}

const FiltersContainerStyle = styled.div`
    display: flex;
    align-items: center;
`;

export class FiltersBar extends PureComponent<IFiltersBarProps> {
    public constructor(props, context) {
        super(props, context);
    }

    public render() {
        const a = "6";
        const { filters } = this.props;
        return (
            <FiltersContainerStyle className="FiltersContainer">
                {filters.map((filter) => filter.filter)}
            </FiltersContainerStyle>
        );
    }
}
