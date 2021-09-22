import { dynamicFilterFilter } from "filters/dynamicFilter";
import { prefixNumberFilter } from "filters/ngFilters";
import * as PropTypes from "prop-types";
import * as React from "react";
import styled from "styled-components";
import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";

export const RightAlignedCell = styled.div`
    text-align: right;
    padding-right: 12px;
`;

export class RankCell extends InjectableComponent {
    private prefixNumber: any;
    private dynamicFilter: any;

    constructor(props, context) {
        super(props, context);
        this.prefixNumber = prefixNumberFilter();
        this.dynamicFilter = dynamicFilterFilter();
    }

    public static propTypes = {
        format: PropTypes.string,
        value: PropTypes.any,
    };

    public static defaultProps = {
        format: "number",
    };

    public render() {
        const { format, value } = this.props;
        return (
            <RightAlignedCell className="cell-innerText" title={value < 1 ? "" : "#" + value}>
                {this.prefixNumber(this.dynamicFilter(value, format, "-"), "#")}
            </RightAlignedCell>
        );
    }
}
