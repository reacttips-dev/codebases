import React from "react";
import * as styles from "./styles";
import QuotaContainer from "../../../../common-components/quota/QuotaContainer/QuotaContainer";

type ListsSectionProps<DATA_TYPE> = {
    name: string;
    items: DATA_TYPE[];
    dataAutomation: string;
    includesQuota?: boolean;
    ListItemComponent: React.ComponentType<{ item: DATA_TYPE; onClick(item: DATA_TYPE): void }>;
    onItemClick(item: DATA_TYPE): void;
    extractId(item: DATA_TYPE): string;
    renderActionComponent(): React.ReactNode;
};

function ListsSection<DATA_TYPE>(props: React.PropsWithChildren<ListsSectionProps<DATA_TYPE>>) {
    const {
        name,
        items,
        onItemClick,
        ListItemComponent,
        extractId,
        dataAutomation,
        renderActionComponent,
        includesQuota = false,
    } = props;

    return (
        <styles.StyledListSection data-automation={dataAutomation}>
            <styles.StyledListSectionHead>
                <styles.StyledListSectionName data-automation={`${dataAutomation}-title`}>
                    {name}
                </styles.StyledListSectionName>
                {includesQuota && <QuotaContainer />}
                {renderActionComponent()}
            </styles.StyledListSectionHead>
            <styles.StyledListSectionBody>
                {items.map((item, index) => (
                    <styles.StyledListItemContainer index={index} key={extractId(item)}>
                        <ListItemComponent item={item} onClick={onItemClick} />
                    </styles.StyledListItemContainer>
                ))}
            </styles.StyledListSectionBody>
        </styles.StyledListSection>
    );
}

export default ListsSection;
