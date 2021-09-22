import * as React from "react";
import { TextContainer, Container } from "./StyledComponents";
import StackedIcons from "../../../Workspace/BenchmarkToArena/src/StackedIcons";
import { FlexRow } from "styled components/StyledFlex/src/StyledFlex";

export const CoreStackedIconsCell: any = ({ className, icons, children }) => {
    return (
        <Container className={className}>
            <FlexRow alignItems="center">
                <StackedIcons icons={icons} size={24} />
                <TextContainer items={icons.length}>{children}</TextContainer>
            </FlexRow>
        </Container>
    );
};
CoreStackedIconsCell.defaultProps = {
    icons: [],
};
CoreStackedIconsCell.displayName = "CoreWebsiteCell";
