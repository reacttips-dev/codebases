import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { IProModalCustomStyles, ProModal } from "components/Modals/src/ProModal";
import {
    ESelectionOptions,
    GroupShareModal,
} from "pages/workspace/marketing/pages/GroupShareModal";
import styled from "styled-components";
import { Spinner } from "components/Loaders/src/Spinner";
import { Injector } from "common/ioc/Injector";
import { swSettings } from "common/services/swSettings";
import SWReactRootComponent from "decorators/SWReactRootComponent";
import { IAccountUser, SharingService } from "sharing/SharingService";
import { i18nFilter } from "filters/ngFilters";
import { useTrack } from "components/WithTrack/src/useTrack";
import { keywordsGroupsService } from "pages/keyword-analysis/KeywordGroupsService";

const getProModalStyles: (isConfirmation) => IProModalCustomStyles = (isConfirmation) => {
    return {
        content: {
            width: "434px",
            boxSizing: "content-box",
            minHeight: isConfirmation ? "auto" : "263px",
            display: "flex",
            alignItems: "center",
        },
    };
};

const LoadingSpinner = styled(Spinner)`
    margin: 0 auto;
    width: 55px;
    height: 55px;
`;

const getInitialSelectedOption = (group) => {
    const { sharedWithAccounts, sharedWithUsers } = group;
    if (sharedWithAccounts.length > 0) {
        return ESelectionOptions.SHARED_WITH_ACCOUNT;
    } else if (sharedWithUsers.length > 0) {
        return ESelectionOptions.SHARED_WITH_USERS;
    } else return ESelectionOptions.NOT_SHARED;
};

const sortUsers = (users) => {
    return users.sort((a, b) => (a.LastName > b.LastName ? 1 : -1));
};

interface IKeywordGroupsShareModalProps {
    keywordGroup: any;
    onCloseClick?: VoidFunction;
    onFinish?: (group) => void;
    isOpen?: boolean;
    users?: IAccountUser[];
}

export const KeywordGroupsShareModal: React.FC<IKeywordGroupsShareModalProps> = (props) => {
    const initialSelectedOption = useRef<ESelectionOptions>(
        getInitialSelectedOption(props.keywordGroup),
    );
    const [selectedOption, setSelectedOption] = useState<ESelectionOptions>(
        initialSelectedOption.current,
    );
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [notifyUsers, setNotifyUsers] = useState(false);
    const [message, setMessage] = useState(false);
    const [loading, setLoading] = useState(false);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [confirmation, setConfirmation] = useState(false);
    const [error, setError] = useState(false);
    // set the users as users from prop, or empty array and load them inside the useeffect
    const [allUsers, setAllUsers] = useState(props.users?.length > 0 ? sortUsers(props.users) : []);
    const [track, trackWithGuid] = useTrack();
    useEffect(() => {
        trackWithGuid("share.keyword.group", "open");
        const applySelectedUsers = (users) => {
            let selected = [];
            if (props.keywordGroup.sharedWithUsers.length > 0) {
                selected = users.filter(({ Id }) => {
                    return props.keywordGroup.sharedWithUsers.includes(Id.toString());
                });
            }
            setSelectedUsers(selected);
        };
        const getAccountUsers = async () => {
            setLoadingUsers(true);
            const { users } = await SharingService.getAccountUsers();
            setAllUsers(sortUsers(users));
            applySelectedUsers(users);
            setLoadingUsers(false);
        };
        if (allUsers.length == 0) {
            getAccountUsers();
        } else {
            applySelectedUsers(allUsers);
        }
        return () => {
            trackWithGuid("share.keyword.group", "close");
        };
    }, []);
    const onOptionClick = (option: ESelectionOptions) => {
        setSelectedOption(option);
    };
    const onUserSelect = useCallback(
        (user) => {
            const newSelectedUsers = [...selectedUsers];
            const userIndex = selectedUsers.findIndex(({ Id }) => Id === user.Id);
            if (userIndex > -1) {
                newSelectedUsers.splice(userIndex, 1);
            } else {
                newSelectedUsers.push(user);
            }
            setSelectedUsers(newSelectedUsers);
        },
        [selectedUsers],
    );

    const onNotifyUsersToggle = () => {
        setNotifyUsers(!notifyUsers);
    };

    const onMessageChange = (message) => {
        setMessage(message);
    };

    const onApprove = async () => {
        setLoading(true);
        const group = await keywordsGroupsService.shareKeywordGroupWithAccount(
            props.keywordGroup.id,
            {
                accountId: swSettings.user.accountId,
                message,
            },
        );
        setLoading(false);
        setConfirmation(false);
        trackWithGuid("share.keyword.group", "submit-ok", {
            type: "with-account",
            count: null,
        });
        props.onFinish(group);
    };

    const onSubmit = async () => {
        try {
            setError(false);
            let group;
            switch (selectedOption) {
                case ESelectionOptions.NOT_SHARED:
                    // no need to unshare when the group is already unshared
                    if (initialSelectedOption.current !== ESelectionOptions.NOT_SHARED) {
                        setLoading(true);
                        group = await keywordsGroupsService.removeGroupSharing(
                            props.keywordGroup.id,
                        );
                        setLoading(false);
                        trackWithGuid("share.keyword.group", "submit-ok", {
                            type: "remove-sharing",
                            count: null,
                        });
                        props.onFinish(group);
                    }
                    return;
                case ESelectionOptions.SHARED_WITH_ACCOUNT:
                    // when sharing with an entire account, a confirmation modal will be displayed
                    setConfirmation(true);
                    return;
                case ESelectionOptions.SHARED_WITH_USERS:
                    setLoading(true);
                    group = await keywordsGroupsService.shareKeywordGroupWithUsers(
                        props.keywordGroup.id,
                        {
                            users: selectedUsers.map((user) => user.Id),
                            message,
                        },
                    );
                    setLoading(false);
                    trackWithGuid("share.keyword.group", "submit-ok", {
                        type: "with-users",
                        count: selectedUsers.length,
                    });
                    props.onFinish(group);
            }
        } catch (e) {
            setLoading(false);
            setError(true);
        }
    };

    const onCancel = useCallback(() => {
        if (confirmation) {
            setConfirmation(false);
        } else {
            props.onCloseClick();
        }
    }, [confirmation]);

    const proModalStyles = useMemo(() => {
        return getProModalStyles(confirmation);
    }, [confirmation]);
    const submitButtonText = useMemo(() => {
        if (selectedOption !== initialSelectedOption.current) {
            switch (selectedOption) {
                case ESelectionOptions.NOT_SHARED:
                    return i18nFilter()("keyword.groups.sharing.removeaccess");
                case ESelectionOptions.SHARED_WITH_ACCOUNT:
                case ESelectionOptions.SHARED_WITH_USERS:
                    return i18nFilter()("keyword.groups.sharing.share");
            }
        } else return i18nFilter()("keyword.groups.sharing.done");
    }, [selectedOption]);

    return (
        <ProModal
            isOpen={props.isOpen}
            onCloseClick={props.onCloseClick}
            shouldCloseOnOverlayClick={true}
            customStyles={proModalStyles}
        >
            {loadingUsers && <LoadingSpinner />}
            {!loadingUsers && (
                <GroupShareModal
                    onApprove={onApprove}
                    onRemoveUser={onUserSelect}
                    selectedUsers={selectedUsers}
                    allUsers={allUsers}
                    onOptionClick={onOptionClick}
                    submitButtonText={submitButtonText}
                    submitButtonDisabled={
                        selectedOption === ESelectionOptions.SHARED_WITH_USERS &&
                        selectedUsers.length === 0
                    }
                    selectedOption={selectedOption}
                    onUserSelect={onUserSelect}
                    onNotifyUsersToggle={onNotifyUsersToggle}
                    onSubmit={onSubmit}
                    onCancel={onCancel}
                    onMessageChange={onMessageChange}
                    isLoading={loading}
                    confirmation={confirmation}
                    error={error}
                    notifyUsers={notifyUsers}
                    showCancel={true}
                    groupName={props.keywordGroup?.name}
                />
            )}
        </ProModal>
    );
};

KeywordGroupsShareModal.defaultProps = {
    onCloseClick: () => null,
    onFinish: (group) => null,
    isOpen: false,
};

// register the component as root component for using via angular templates
export default SWReactRootComponent(KeywordGroupsShareModal, "KeywordGroupsShareModal");
