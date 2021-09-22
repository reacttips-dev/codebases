import { useMemo, useState, useEffect, FC } from "react";
import _ from "lodash";
import styled from "styled-components";
import { SWReactIcons } from "@similarweb/icons";
import { Title } from "@similarweb/ui-components/dist/title";
import { setFont } from "@similarweb/styles/src/mixins";
import { colorsPalettes } from "@similarweb/styles";
import { ButtonsGroup, IButtonWithTextProps } from "components/ButtonsGroup/src/ButtonsGroup";
import { ProModal } from "components/Modals/src/ProModal";
import { IKeywordsGroupEditorGroup, KeywordsGroupEditor } from "./KeywordsGroupEditor";
import { Injector } from "common/ioc/Injector";
import { SwNavigator } from "common/services/swNavigator";
import { i18nFilter } from "filters/ngFilters";
import { IKeywordGroup } from "userdata";
import { AssetsService } from "services/AssetsService";
import { KeywordsGroupsTracking, NewGroupTracker } from "./KeywordsGroupsTracking";
import { emptyKeyordGroup } from "./KeywordGroupEditorHelpers";

const KEYWORD_GROUP_PREFIX = "*";
const successGif = AssetsService.assetUrl(
    "/images/keyword-analysis/create-new-group-animation.gif",
);

export const isNewGroup = (group: IKeywordGroup) => {
    return !group.Id;
};

export const getTracker = (group?: IKeywordGroup) => {
    const { existingGroupTracker, newGroupTracker, genericGroupTracker } = KeywordsGroupsTracking;
    if (!group) {
        return genericGroupTracker;
    } else if (isNewGroup(group)) {
        return newGroupTracker;
    } else {
        return existingGroupTracker;
    }
};

interface KeywordsGroupEditorModalProps {
    onClose: () => void;
    open?: boolean;
    keywordsGroup?: IKeywordGroup;
    onSave?: (modifiedGroup) => void;
    hideViewGroupLink?: boolean;
    onDelete?: (deletedGroup) => void;
    reloadOnClose?: boolean;
    showDeleteButton?: boolean;
    onEditorOpened?: (editor) => void;
    onEditorClosed?: (editor) => void;
}

const GroupNameContainer = styled.div`
    display: inline-flex;
    margin: 18px 0 10px 0;
    ${setFont({ $size: 16, $weight: 300, $color: colorsPalettes.carbon[500] })};

    > div {
        margin-right: 10px;
    }
`;

export const KeywordsGroupEditorModal: FC<KeywordsGroupEditorModalProps> = ({
    onClose,
    open = false,
    keywordsGroup = emptyKeyordGroup,
    onSave,
    hideViewGroupLink,
    onDelete,
    reloadOnClose = false,
    showDeleteButton,
    onEditorOpened = _.noop,
    onEditorClosed = _.noop,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [saveSuccessful, setSaveSuccessful] = useState(false);
    const [group, setGroup] = useState(keywordsGroup);
    const swNavigator = Injector.get<SwNavigator>("swNavigator");

    const titleText = i18nFilter()(
        isNewGroup
            ? "KeywordAnalysis.keywordgroup.wizard.create"
            : "KeywordAnalysis.keywordgroup.wizard.edit",
    );

    const tracker = useMemo(() => {
        return getTracker(group);
    }, [group, isNewGroup]);

    const buttonsProps: IButtonWithTextProps[] = useMemo(
        () => [
            {
                type: "primary",
                onClick: () => handleClose(),
                text: "keywordanalysis.groupwizard.close",
            },
            ...(!hideViewGroupLink
                ? [
                      {
                          type: "flat",
                          onClick: () => viewGroup(),
                          text: "keywordanalysis.groupwizard.viewgroup",
                      } as IButtonWithTextProps,
                  ]
                : []),
        ],
        [hideViewGroupLink, group],
    );

    useEffect(() => {
        // if modal was closed and now should open
        if (open === true && isOpen === false) {
            setSaveSuccessful(false);
            setGroup(keywordsGroup);
        }
        setIsOpen(open);
    }, [open]);

    const viewGroup = () => {
        const targetState = swNavigator.current().name.startsWith("keywordAnalysis.search")
            ? swNavigator.current()
            : "keywordAnalysis_overview";
        const targetParams = {
            keyword: KEYWORD_GROUP_PREFIX + group.Id,
        };
        handleClose();
        swNavigator.go(
            targetState,
            { ...swNavigator.getParams(), ...targetParams },
            {
                reload: true,
            },
        );
        (tracker as NewGroupTracker).onView(group.Name, group.Keywords);
    };

    const handleClose = () => {
        setIsOpen(false);
        if (saveSuccessful) {
            (tracker as NewGroupTracker).onClose();
        } else {
            (tracker as NewGroupTracker).onCancel();
        }
        onEditorClosed(saveSuccessful);
        onClose();
        if (reloadOnClose) {
            swNavigator.reload();
        }
    };

    const onDeleteSuccess = (modifiedGroup: IKeywordGroup) => {
        setSaveSuccessful(true);
        handleClose();
        onDelete && onDelete(modifiedGroup);
    };

    const onSaveSuccess = async (modifiedGroup: IKeywordGroup) => {
        onSave && onSave(modifiedGroup);
        setSaveSuccessful(true);
        setGroup(modifiedGroup);
        $(".customCategoriesWizardWindow")
            .removeClass("customCategoriesWizardWindow")
            .addClass("edit-keyword-group-complete");
    };

    return (
        <ProModal
            className="keywordsGroupEditorModal"
            isOpen={isOpen}
            onCloseClick={handleClose}
            shouldCloseOnOverlayClick={false}
            showCloseIcon={!saveSuccessful}
        >
            {!saveSuccessful ? (
                <KeywordsGroupEditor
                    showDeleteButton={showDeleteButton}
                    keywordsGroup={(group as unknown) as IKeywordsGroupEditorGroup}
                    titleText={titleText}
                    tracker={tracker}
                    ctrl={{
                        onDeleteSuccess,
                        onSaveSuccess,
                        onEditorLoaded: (editor) => onEditorOpened(editor),
                    }}
                />
            ) : (
                <div className="edit-keyword-group-complete">
                    <div className="create-group-success-content">
                        <Title>New Keyword Group Created Successfully</Title>
                        <GroupNameContainer>
                            <SWReactIcons iconName="folder" size="sm" />
                            {group.Name}
                        </GroupNameContainer>
                        <img className="create-group-success-img" src={successGif} />
                    </div>
                </div>
            )}
            <footer className="create-group-success-footer">
                <ButtonsGroup buttonsProps={buttonsProps} />
            </footer>
        </ProModal>
    );
};
