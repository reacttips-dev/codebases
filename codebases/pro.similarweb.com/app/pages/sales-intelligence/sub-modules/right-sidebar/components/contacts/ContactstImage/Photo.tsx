import React from "react";
import { SWReactIcons } from "@similarweb/icons";
import { StyledIcon, StyledPhoto } from "./styles";

type PhotoType = {
    src: string;
};

const Photo: React.FC<PhotoType> = ({ src }) => {
    const [showPhoto, setShowPhoto] = React.useState(false);

    const handleOnLoad = () => setShowPhoto(true);

    return (
        <StyledPhoto showPhoto={showPhoto}>
            <StyledIcon>
                <SWReactIcons size="sm" iconName="employees" />
            </StyledIcon>
            <img src={src} onLoad={handleOnLoad} />
        </StyledPhoto>
    );
};

export default Photo;
