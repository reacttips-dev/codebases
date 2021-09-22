import { useState } from "react";
import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { colorsPalettes } from "@similarweb/styles";
import { Banner } from "@similarweb/ui-components/dist/banner";
import { Button, ButtonLabel } from "@similarweb/ui-components/dist/button";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { swSettings } from "common/services/swSettings";
import { KeywordGroupCreationDropdown } from "components/GroupCreationDropdown/src/KeywordGroupCreationDropdown";
import I18n from "components/WithTranslation/src/I18n";
import { i18nFilter } from "filters/ngFilters";
import { TrackWithGuidService } from "services/track/TrackWithGuidService";
import {
    getTracker,
    KeywordsGroupEditorModal,
} from "pages/keyword-analysis/KeywordsGroupEditorModal";

const KeywordsGeoBannerStyle = styled(Banner)`
    background-color: ${colorsPalettes.blue["100"]};
    margin-bottom: 16px;
    height: 56px;
`;

const KeywordsGeoLowStateIcon = styled(SWReactIcons).attrs({
    iconName: "wand",
    size: "sm",
})`
  svg path {
      fill: ${colorsPalettes.blue[400]};
    }
  }
`;

const onGeneratorToolClick = () => {
    const swNavigator = Injector.get("swNavigator") as any;
    swNavigator.go("keywordAnalysis-keywordGeneratorTool");
};

const onButtonClick = () => {
    TrackWithGuidService.trackWithGuid("keywordAnalysis.geography.banner", "click", {});
};

const CustomButton = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [keywordGroupToEdit, setKeywordGroupToEdit] = useState<any>();
    const swNavigator = Injector.get<SwNavigator>("swNavigator");
    const { keyword } = swNavigator.getParams();

    const openKeywordGroupModal = () => {
        setIsOpen(true);
        setKeywordGroupToEdit(keyword ?? "");
    };

    const onModalOpen = (editor) => {
        editor._listItemsManager.onAddItem(keyword, false);
        const tracker = getTracker();
        tracker.createGroupFromAddToMenu(keyword);
    };

    return (
        <>
            <KeywordGroupCreationDropdown
                onKeywordsModalClick={openKeywordGroupModal}
                onGeneratorToolClick={onGeneratorToolClick}
                containerClass="DropdownContent-container-keyword-analysis-generator"
                appendTo="body"
                bubbleClass="keywords-generator-notification-keywordsAnalysis"
                bubbleDirection="left"
                hideNotification={false}
                hasKeywordsGenerator={swSettings.components.KeywordsGenerator.isAllowed}
            >
                <Button className="SideNav-button" onClick={onButtonClick}>
                    <ButtonLabel>
                        <I18n>try.it.now</I18n>
                    </ButtonLabel>
                </Button>
            </KeywordGroupCreationDropdown>
            <KeywordsGroupEditorModal
                onClose={() => setIsOpen(false)}
                open={isOpen}
                keywordsGroup={keywordGroupToEdit}
                onEditorOpened={onModalOpen}
            />
        </>
    );
};

export const KeywordsGeoLowStateBanner: any = () => {
    return (
        <KeywordsGeoBannerStyle
            title={i18nFilter()("keywordAnalysis.geo.table.emptyState.message.bold")}
            subtitle={i18nFilter()("keywordAnalysis.geo.table.emptyState.message.text")}
            CustomIcon={<KeywordsGeoLowStateIcon />}
            CustomButton={CustomButton()}
        />
    );
};
