import React, { ReactNode, useState } from "react";
import styled from "styled-components";
import { rgba, mixins, colorsPalettes } from "@similarweb/styles";
import { RadioButton } from "@similarweb/ui-components/dist/radio-button";
import { Checkbox } from "@similarweb/ui-components/dist/checkbox";
import { Button } from "@similarweb/ui-components/dist/button";
import { AutocompleteWithItems } from "@similarweb/ui-components/dist/autocomplete";
import { DotsLoader } from "@similarweb/ui-components/dist/search-input";
import { UserChipItem } from "@similarweb/ui-components/dist/chip";
import { ListItemUser } from "@similarweb/ui-components/dist/list-item";
import { Textarea } from "@similarweb/ui-components/dist/textarea";
import * as Fuse from "fuse.js";
import { useTranslation } from "components/WithTranslation/src/I18n";

const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    .input-container {
        position: static;
    }
`;
const Title = styled.div`
    ${mixins.setFont({ $size: 20, $color: colorsPalettes.carbon[500], $weight: 500 })};
    margin-bottom: 8px;
`;

const GroupNameText = styled.div`
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[400], $weight: 400 })};
    margin-bottom: 24px;
`;

const Text = styled.div`
    ${mixins.setFont({ $size: 16, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
    max-width: 80%;
    text-align: left;
`;

const ShareOptionContainer = styled.div`
    width: 100%;
    display: flex;
    align-items: flex-start;
    margin-bottom: 18px;
`;

const StyledRadioButton = styled(RadioButton)`
    padding: 0;
`;

const ShareOptionTexts = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    transform: translateY(-1px);
    flex-grow: 1;
    position: relative;
    z-index: 1;
`;

const ShareOptionTitle = styled.div`
    ${mixins.setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.8), $weight: 500 })};
    line-height: 20px;
`;
const ShareOptionSubTitle = styled.div`
    ${mixins.setFont({ $size: 14, $color: rgba(colorsPalettes.carbon[500], 0.8) })};
    line-height: 20px;
`;
const CheckBoxContainer = styled.div`
    margin-bottom: 8px;
    margin-left: -2px;
`;

const TextFieldContainer = styled.div`
    position: relative;
    width: 100%;
    margin-bottom: 8px;
    > div {
        position: static;
    }
`;

const ButtonsGroup = styled.div`
    width: 100%;
    display: flex;
    flex-direction: row-reverse;
    margin-top: 8px;
    button {
        margin-left: 8px;
    }
`;

const AutoCompleteContainer = styled.div`
    margin-top: 16px;
    width: 100%;
`;

const Warning = styled.div`
    width: 100%;
    background-color: ${colorsPalettes.yellow[100]};
    border-radius: 4px;
    display: block;
    text-align: left;
    padding: 10px 16px;
    ${mixins.setFont({ $size: 14, $color: colorsPalettes.carbon[500] })};
    box-sizing: border-box;
`;

const Error = styled(Warning)`
    background-color: ${colorsPalettes.red[100]};
    ${mixins.setFont({ $color: colorsPalettes.red.s100 })};
`;

export enum ESelectionOptions {
    NOT_SHARED,
    SHARED_WITH_ACCOUNT,
    SHARED_WITH_USERS,
}

interface IUser {
    FirstName: string;
    LastName: string;
    Id: number;
    Email: string;
}

interface IMarketingWorkspaceKeywordGroupsShareModal {
    onRemoveUser: (user: IUser) => void;
    onUserSelect: (user: IUser) => void;
    onMessageChange: (message) => void;
    onOptionClick: (id) => void;
    onApprove: VoidFunction;
    getUsers?: () => Promise<Array<IUser>>;
    onNotifyUsersToggle: VoidFunction;
    onSubmit: VoidFunction;
    onCancel: VoidFunction;
    selectedUsers: Array<IUser>;
    allUsers: Array<IUser>;
    confirmation?: boolean;
    notifyUsers?: boolean;
    isLoading?: boolean;
    error?: boolean;
    showCancel?: boolean;
    selectedOption: ESelectionOptions;
    submitButtonText: string;
    submitButtonDisabled?: boolean;
    groupName?: ReactNode;
}

export const GroupShareModal: React.FC<IMarketingWorkspaceKeywordGroupsShareModal> = (props) => {
    const [isFocused, setIsFocused] = useState(false);
    const onRemoveUser = (user) => () => {
        props.onRemoveUser(user);
    };
    const translate = useTranslation();

    const getChips = () => {
        return props.selectedUsers.map((user) => {
            return (
                <UserChipItem
                    key={user.Id}
                    onCloseItem={onRemoveUser(user)}
                    text={`${user.FirstName} ${user.LastName}`}
                />
            );
        });
    };

    const onOptionClick = (id) => () => {
        props.onOptionClick(id);
    };

    const onUserSelect = (user) => () => {
        props.onUserSelect(user);
    };

    const getUsers = async (query) => {
        let users = props.allUsers;
        const options = {
            keys: ["FirstName", "LastName", "Email"],
        };
        if (query) {
            const fuse: any = new Fuse(props.allUsers, options);
            users = fuse.search(query);
        }

        const filtered = users
            .filter(
                (user) => !props.selectedUsers.find((selectedUser) => selectedUser.Id === user.Id),
            )
            .slice(0, 5)
            .map((user) => {
                return (
                    <ListItemUser
                        key={user.Id.toString()}
                        email={user.Email}
                        name={`${user.FirstName} ${user.LastName}`}
                        onClick={onUserSelect(user)}
                    >
                        {user.Email}
                    </ListItemUser>
                );
            });
        return Promise.resolve(filtered);
    };

    if (props.confirmation) {
        return (
            <Container>
                <Title>{translate("keyword.groups.sharing.confirmation.title")}</Title>
                <Text>
                    {translate("keyword.groups.sharing.confirmation.sub.title", {
                        number: props.allUsers.length,
                    })}
                </Text>
                <ButtonsGroup>
                    <Button isLoading={props.isLoading} onClick={props.onApprove}>
                        {translate("keyword.groups.sharing.confirmation.send")}
                    </Button>
                    <Button type="flat" onClick={props.onCancel}>
                        {translate("keyword.groups.sharing.confirmation.back")}
                    </Button>
                </ButtonsGroup>
            </Container>
        );
    }
    return (
        <Container>
            <Title>{translate("keyword.groups.sharing.title")}</Title>
            <GroupNameText>{props.groupName}</GroupNameText>
            <ShareOptionContainer>
                <StyledRadioButton
                    itemSelected={props.selectedOption === ESelectionOptions.NOT_SHARED}
                    onClick={onOptionClick(ESelectionOptions.NOT_SHARED)}
                    itemLabel=""
                />
                <ShareOptionTexts>
                    <ShareOptionTitle>
                        {translate("keyword.groups.sharing.notshared.title")}
                    </ShareOptionTitle>
                    <ShareOptionSubTitle>
                        {translate("keyword.groups.sharing.notshared.text")}
                    </ShareOptionSubTitle>
                </ShareOptionTexts>
            </ShareOptionContainer>
            <ShareOptionContainer>
                <StyledRadioButton
                    itemSelected={props.selectedOption === ESelectionOptions.SHARED_WITH_ACCOUNT}
                    onClick={onOptionClick(ESelectionOptions.SHARED_WITH_ACCOUNT)}
                    itemLabel=""
                />
                <ShareOptionTexts>
                    <ShareOptionTitle>
                        {translate("keyword.groups.sharing.sharedwithaccount.title")}
                    </ShareOptionTitle>
                    <ShareOptionSubTitle>
                        {translate("keyword.groups.sharing.sharedwithaccount.text")}
                    </ShareOptionSubTitle>
                </ShareOptionTexts>
            </ShareOptionContainer>
            <ShareOptionContainer>
                <StyledRadioButton
                    itemSelected={props.selectedOption === ESelectionOptions.SHARED_WITH_USERS}
                    onClick={onOptionClick(ESelectionOptions.SHARED_WITH_USERS)}
                    itemLabel=""
                />
                <ShareOptionTexts>
                    <ShareOptionTitle>
                        {translate("keyword.groups.sharing.sharedwithusers.title")}
                    </ShareOptionTitle>
                    <ShareOptionSubTitle>
                        {translate("keyword.groups.sharing.sharedwithusers.text")}
                    </ShareOptionSubTitle>
                    {props.selectedOption === ESelectionOptions.SHARED_WITH_USERS && (
                        <AutoCompleteContainer>
                            <AutocompleteWithItems
                                selectedItems={getChips()}
                                placeholder={translate(
                                    "keyword.groups.sharing.sharedwithusers.placeholder",
                                )}
                                getListItems={getUsers}
                                loadingComponent={<DotsLoader />}
                                searchIcon="add"
                                isFocused={isFocused}
                                debounce={400}
                                onFocus={() => {
                                    setIsFocused(true);
                                }}
                                onBlur={() => {
                                    setIsFocused(false);
                                }}
                            />
                        </AutoCompleteContainer>
                    )}
                </ShareOptionTexts>
            </ShareOptionContainer>
            {props.selectedOption !== ESelectionOptions.NOT_SHARED && (
                <CheckBoxContainer>
                    <Checkbox
                        label={translate("keyword.groups.sharing.notify.label")}
                        onClick={props.onNotifyUsersToggle}
                        selected={props.notifyUsers}
                    />
                </CheckBoxContainer>
            )}
            {props.notifyUsers && (
                <TextFieldContainer>
                    <Textarea
                        maxCharacters={50}
                        onChange={props.onMessageChange}
                        placeholder={translate("keyword.groups.sharing.message.placeholder")}
                    />
                </TextFieldContainer>
            )}
            {props.selectedOption === ESelectionOptions.SHARED_WITH_ACCOUNT &&
                props.notifyUsers && (
                    <Warning>{translate("keyword.groups.sharing.warning")}</Warning>
                )}
            {props.error && <Error>{translate("keyword.groups.sharing.error")}</Error>}
            <ButtonsGroup>
                <Button
                    isDisabled={props.submitButtonDisabled}
                    isLoading={props.isLoading}
                    onClick={props.onSubmit}
                >
                    {props.submitButtonText}
                </Button>
                {props.showCancel && (
                    <Button type="flat" onClick={props.onCancel}>
                        {translate("keyword.groups.sharing.cancel")}
                    </Button>
                )}
            </ButtonsGroup>
        </Container>
    );
};

GroupShareModal.defaultProps = {
    onNotifyUsersToggle: () => null,
    onMessageChange: () => null,
    onSubmit: () => null,
};
