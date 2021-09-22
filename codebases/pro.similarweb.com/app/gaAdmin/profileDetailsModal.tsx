import { Button } from "@similarweb/ui-components/dist/button";
import { ProModal } from "components/Modals/src/ProModal";
import React from "react";
import {
    InlineIcon,
    IsDeleted,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Part,
    PartName,
    PartValue,
    PreJson,
} from "./styledComponents";

const DetailPart = ({
    name = "",
    children = null,
    fullRow = false,
    placeholder = false,
    showSemicolon = true,
}) => (
    <Part fullRow={fullRow}>
        {!placeholder && (
            <React.Fragment>
                <PartName fullRow={fullRow}>{name}:</PartName>
                <PartValue>{children}</PartValue>
            </React.Fragment>
        )}
    </Part>
);

const profileDetailsProModalStyles = {
    content: {
        maxWidth: "800px",
        width: "100%",
    },
};

export const ProfileDetailsModal = (props) => {
    const { profile, onCloseClick } = props;

    const [showJson, setShowJson] = React.useState(false);

    const toggleJson = React.useCallback(() => {
        setShowJson(!showJson);
    }, [showJson]);

    return (
        <ProModal
            customStyles={profileDetailsProModalStyles}
            isOpen={!!profile}
            onCloseClick={onCloseClick}
            {...props}
        >
            {profile ? (
                <React.Fragment>
                    <ModalHeader>{profile.domain}</ModalHeader>
                    <ModalBody>
                        {showJson ? (
                            <PreJson>{JSON.stringify(profile, null, "    ")}</PreJson>
                        ) : (
                            <React.Fragment>
                                <DetailPart name="Domain" fullRow={true}>
                                    {profile.domain}
                                </DetailPart>

                                <DetailPart name="Email" fullRow={true}>
                                    {profile.email}
                                </DetailPart>

                                <DetailPart name="Website URL" fullRow={true}>
                                    <a href={profile.profileWebsiteUrl} target="_blank">
                                        {profile.profileWebsiteUrl}
                                    </a>
                                </DetailPart>

                                <DetailPart name="Is Private?" showSemicolon={false}>
                                    {profile.isPrivate ? (
                                        <span>
                                            <InlineIcon size="xs" iconName="private" />
                                            YES
                                        </span>
                                    ) : (
                                        <span>No</span>
                                    )}
                                </DetailPart>
                                {profile.isPrivate ? (
                                    <DetailPart name="SW User">
                                        {profile.swUserInfo?.FirstName ||
                                        profile.swUserInfo?.LastName ? (
                                            <React.Fragment>
                                                <div>
                                                    {profile.swUserInfo?.FirstName}{" "}
                                                    {profile.swUserInfo?.LastName}
                                                </div>
                                                <div>{profile.swUserInfo?.UserName}</div>
                                            </React.Fragment>
                                        ) : (
                                            "unknown"
                                        )}
                                    </DetailPart>
                                ) : (
                                    <DetailPart placeholder={true} />
                                )}

                                <DetailPart name="Is Deleted?" fullRow={true} showSemicolon={false}>
                                    {profile.isDeleted ? (
                                        <IsDeleted>
                                            <span className="isDeletedFlag">
                                                <InlineIcon size="xs" iconName="clear-circle" />
                                                YES
                                            </span>
                                            {profile.deleteReason && `- ${profile.deleteReason}`}
                                        </IsDeleted>
                                    ) : (
                                        "No"
                                    )}
                                </DetailPart>

                                <DetailPart name="Profile ID">{profile.profileId}</DetailPart>
                                <DetailPart name="Profile Name">{profile.profileName}</DetailPart>

                                <DetailPart name="Web Property ID">
                                    {profile.webPropertyId}
                                </DetailPart>
                                <DetailPart name="Web Property Name">
                                    {profile.webPropertyName}
                                </DetailPart>
                            </React.Fragment>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button type="flat" onClick={toggleJson}>
                            {showJson ? "Show properties" : "Show full JSON"}
                        </Button>
                        <Button onClick={onCloseClick}>Close</Button>
                    </ModalFooter>
                </React.Fragment>
            ) : (
                "No Data"
            )}
        </ProModal>
    );
};
