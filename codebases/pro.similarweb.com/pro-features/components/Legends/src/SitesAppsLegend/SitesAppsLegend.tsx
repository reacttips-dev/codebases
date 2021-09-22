import { IItemIconProps } from "@similarweb/ui-components/dist/item-icon";
import React, { StatelessComponent } from "react";
import {
    MoreSourcesText,
    MoreText,
    Pipe,
    SourceContent,
    SourceIcon,
    SourcesContainer,
    SourcesLine,
    SourceText,
} from "./StyledComponents";

const defaultKeys = {
    moresite: "+ 1 more site",
    moresites: "+ %numOf% more sites",
    moreapp: "+ 1 more app",
    moreapps: "+ %numOf% more apps",
};

export interface IConversionTileDescProps {
    type: "websites" | "apps";
    items: IItemIconProps[];
    translate?: (key, params?) => string;
}

export const SitesAppsLegend: StatelessComponent<IConversionTileDescProps> = ({
    type,
    items,
    translate,
}) => {
    const defaultTranslation = (key, params?) =>
        params ? defaultKeys[key].replace("%numOf%", params.numOf) : defaultKeys[key];
    const trans = translate || defaultTranslation;
    const source = type === "apps" ? "app" : "site";
    const moreText =
        items.length === 3
            ? trans(`more${source}`)
            : items.length > 3
            ? trans(`more${source}s`, { numOf: (items.length - 2).toString() })
            : null;
    return (
        <SourcesLine>
            <SourcesContainer>
                <SourceContent>
                    <SourceIcon {...items[0]} />
                    <SourceText>{items[0].iconName}</SourceText>
                </SourceContent>
                {items[1] ? (
                    <SourceContent>
                        <SourceIcon {...items[1]} />
                        <SourceText>{items[1].iconName}</SourceText>
                    </SourceContent>
                ) : null}
            </SourcesContainer>
            {moreText ? (
                <MoreSourcesText>
                    <Pipe>|</Pipe>
                    <MoreText>{moreText}</MoreText>
                </MoreSourcesText>
            ) : null}
        </SourcesLine>
    );
};
