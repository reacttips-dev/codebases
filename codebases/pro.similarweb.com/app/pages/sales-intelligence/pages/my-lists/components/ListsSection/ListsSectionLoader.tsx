import React from "react";
import * as styles from "./styles";
import { PixelPlaceholderLoader } from "@similarweb/ui-components/dist/placeholder-loaders";
import SalesListItemLoader from "../../../../common-components/sales-list-item/SalesListItemLoader";

const HEAD_HEIGHT = 37;
const HEAD_WIDTH = 150;
const ListsSectionLoader: React.FC = () => {
    return (
        <styles.StyledListSection>
            <styles.StyledListSectionLoaderHead>
                <PixelPlaceholderLoader width={HEAD_WIDTH} height={HEAD_HEIGHT} />
            </styles.StyledListSectionLoaderHead>
            <styles.StyledListSectionBody>
                <styles.StyledListItemContainer index={0}>
                    <SalesListItemLoader />
                </styles.StyledListItemContainer>
                <styles.StyledListItemContainer index={1}>
                    <SalesListItemLoader />
                </styles.StyledListItemContainer>
            </styles.StyledListSectionBody>
        </styles.StyledListSection>
    );
};

export default React.memo(ListsSectionLoader);
