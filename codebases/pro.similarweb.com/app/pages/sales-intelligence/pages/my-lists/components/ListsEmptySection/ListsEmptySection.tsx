import React from "react";
import * as styles from "./styles";
import { SWReactIcons } from "@similarweb/icons";

type ListsEmptySectionProps = {
    name: string;
    imageName: string;
    description: string;
    renderActionButton(): React.ReactNode;
};

const ListsEmptySection: React.FC<ListsEmptySectionProps> = (props) => {
    const { name, imageName, description, renderActionButton } = props;

    return (
        <styles.StyledListsEmptySection>
            <styles.StyledEmptyImageContainer>
                <SWReactIcons iconName={imageName} />
            </styles.StyledEmptyImageContainer>
            <div>
                <styles.StyledEmptyTitle>{name}</styles.StyledEmptyTitle>
                <styles.StyledEmptyDescription>{description}</styles.StyledEmptyDescription>
                {renderActionButton()}
            </div>
        </styles.StyledListsEmptySection>
    );
};

export default React.memo(ListsEmptySection);
