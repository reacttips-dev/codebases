import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import * as classNames from "classnames";
import { BetaLabel } from "components/BetaLabel/BetaLabel";
import * as React from "react";
import styled from "styled-components";
import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";

const CellIconComponent: any = styled(SWReactIcons).attrs({
    size: "sm",
})`
    margin-right: 6px;
    path {
        fill: ${colorsPalettes.carbon["200"]};
    }
`;

const Wrapper: any = styled.span`
    margin-left: 5px;
`;

export class MetricIconCell extends InjectableComponent {
    public render() {
        const { value } = this.props,
            realValue = value["value"],
            icon = value["icon"],
            isBeta = value["isBeta"],
            tooltip = value["tooltip"],
            classes = classNames("u-flex-row value u-truncate");

        return (
            <div className="headerCell headerCell-leader u-truncate">
                <span className={classes}>
                    <CellIconComponent iconName={icon} />
                    {tooltip ? (
                        <PlainTooltip placement="top" tooltipContent={tooltip}>
                            <span>{realValue}</span>
                        </PlainTooltip>
                    ) : (
                        <span>{realValue}</span>
                    )}
                    {isBeta ? (
                        <Wrapper>
                            <BetaLabel />
                        </Wrapper>
                    ) : null}
                </span>
            </div>
        );
    }
}
