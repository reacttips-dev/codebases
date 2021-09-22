import * as React from "react";
import { StatelessComponent } from "react";
import { Box } from "@similarweb/ui-components/dist/box";
import {
    TitlePlaceholderLoader,
    LinePlaceholderLoader,
    ListItemPlaceholderLoader,
} from "@similarweb/ui-components/dist/placeholder-loaders";

export const LoadingBox: StatelessComponent<any> = ({ resourceName, children }) => {
    return (
        <Box className="Box--researchHomepage Box-container--loading fade-items-in">
            {children}
            <TitlePlaceholderLoader id={`${resourceName}_lt`} className="Loader--title" />
            <LinePlaceholderLoader id={`${resourceName}_ll`} className="Loader--line" />
            <ListItemPlaceholderLoader id={`${resourceName}_li1`} className="Loader--item" />
            <ListItemPlaceholderLoader id={`${resourceName}_li2`} className="Loader--item" />
            <ListItemPlaceholderLoader id={`${resourceName}_li3`} className="Loader--item" />
            <ListItemPlaceholderLoader id={`${resourceName}_li4`} className="Loader--item" />
            <ListItemPlaceholderLoader id={`${resourceName}_li5`} className="Loader--item" />
        </Box>
    );
};
