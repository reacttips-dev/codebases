import { colorsPalettes } from "@similarweb/styles";
import * as classNames from "classnames";
import { Injector } from "common/ioc/Injector";
import { Marker } from "components/Legends/src/LegendBase/Legend";
import { WebsiteTooltip } from "components/React/Tooltip/WebsiteTooltip/WebsiteTooltip";
import * as React from "react";
import styled from "styled-components";
import { InjectableComponent } from "../../InjectableComponent/InjectableComponent";

const Wrapper = styled.span`
    min-width: 0px;
    align-items: center;
`;

const DomainWrapper = styled.span`
    margin-right: 8px;
    color: ${colorsPalettes.carbon["400"]};
`;

export class DomainCell extends InjectableComponent {
    render() {
        const chosenSites = Injector.get<any>("chosenSites");
        const domain = this.props.field;
        const color = chosenSites.getSiteColor(domain);
        const classes = classNames("u-flex-row value");

        return (
            <WebsiteTooltip domain={domain} hideTrackButton={true}>
                <Wrapper className={classes}>
                    <span>
                        <Marker color={color} />
                    </span>
                    <DomainWrapper className={"u-truncate"}> {domain} </DomainWrapper>
                </Wrapper>
            </WebsiteTooltip>
        );
    }
}
