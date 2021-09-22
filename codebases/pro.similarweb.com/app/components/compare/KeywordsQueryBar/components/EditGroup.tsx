import { useState } from "react";
import { useTranslation } from "components/WithTranslation/src/I18n";
import { IKeywordGroup } from "components/compare/KeywordsQueryBar/KeywordsQueryBarTypes";
import { PlainTooltip } from "@similarweb/ui-components/dist/plain-tooltip";
import { ButtonContainer } from "../KeywordsQueryBarStyles";
import { IconButton } from "@similarweb/ui-components/dist/button";
import { ServicesType } from "./KeywordsQueryBarItem";
import { EDIT_TOOLTIP } from "../constants";
import { KeywordsGroupEditorModal } from "pages/keyword-analysis/KeywordsGroupEditorModal";

export const EditGroupButton = ({
    services,
    keywordGroup,
}: {
    services: ServicesType;
    keywordGroup?: IKeywordGroup;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const translate = useTranslation();

    return (
        <PlainTooltip placement="bottom" tooltipContent={translate(EDIT_TOOLTIP)}>
            <ButtonContainer>
                <IconButton type="flat" iconName="edit-group" onClick={() => setIsOpen(true)} />
                <KeywordsGroupEditorModal
                    onClose={() => setIsOpen(false)}
                    open={isOpen}
                    keywordsGroup={
                        {
                            Id: keywordGroup?.id,
                            Keywords: keywordGroup?.keywords,
                            Name: keywordGroup?.text,
                        } as any
                    }
                    hideViewGroupLink={false}
                    onDelete={(deletedGroup: { Id: string }) => {
                        // In case the group we're deleting is the currently displayed
                        // group in the query bar - we should navigate back to the homepage
                        if (deletedGroup.Id === keywordGroup.id) {
                            const homeState = services.swNavigator.current().homeState;
                            services.swNavigator.go(homeState);
                        }
                    }}
                />
            </ButtonContainer>
        </PlainTooltip>
    );
};
