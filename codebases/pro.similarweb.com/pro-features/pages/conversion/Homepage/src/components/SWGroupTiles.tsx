import { default as React, StatelessComponent } from "react";
import { SitesAppsLegend } from "../../../../../components/Legends/src/SitesAppsLegend/SitesAppsLegend";
import WithAllContexts from "../../../../app performance/src/common components/WithAllContexts";
import { StyledBoxLink, SWGroupsTilesContainer, TemporaryBox, Title } from "../StyledComponents";

export interface ISite {
    iconName: string;
    iconSrc: string;
}

export interface IGroupTile {
    title: string;
    iconName: string;
    sites: ISite[];
    onClick?: () => void;
}

export interface ISWGroupTilesProps {
    tilesProps: IGroupTile[];
}

export const SWGroupTiles: StatelessComponent<ISWGroupTilesProps> = ({ tilesProps }) => (
    <WithAllContexts>
        {({ translate, track }) => {
            const trackLink = (title) => track("Internal Link", "click", title);
            return (
                <SWGroupsTilesContainer>
                    {tilesProps.map((props, index) => {
                        const handleClick = () => {
                            trackLink(props.title);
                            if (props.onClick && typeof props.onClick === "function") {
                                props.onClick();
                            }
                        };

                        return (
                            <StyledBoxLink key={`${index}_${props.title}`} onClick={handleClick}>
                                <TemporaryBox key={"tile" + index}>
                                    <Title>{props.title}</Title>
                                    <SitesAppsLegend
                                        type="websites"
                                        items={props.sites}
                                        translate={translate}
                                    />
                                </TemporaryBox>
                            </StyledBoxLink>
                        );
                    })}
                </SWGroupsTilesContainer>
            );
        }}
    </WithAllContexts>
);
