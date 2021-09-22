import React from "react";
import * as styles from "./styles";
import { IconButton } from "@similarweb/ui-components/dist/button";

type TopBarProps = {
    children: React.ReactFragment;
    onBackClick(): void;
};

const TopBar: React.FC<TopBarProps> = (props) => {
    const { onBackClick, children } = props;

    return (
        <styles.StyledTobBar>
            <styles.StyledBackContainer>
                <IconButton
                    type="flat"
                    iconSize="sm"
                    iconName="arrow-left"
                    onClick={onBackClick}
                    dataAutomation="si-list-page-back-button"
                />
            </styles.StyledBackContainer>
            <styles.StyledTopBarBody>{children}</styles.StyledTopBarBody>
        </styles.StyledTobBar>
    );
};

export default TopBar;
