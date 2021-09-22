import {Button} from "@bbyca/bbyca-components";
import Link from "components/Link";
import * as React from "react";
import withRouterLink from "utils/withRouterLink";
import * as styles from "./styles.css";
import {classname} from "utils/classname";
import VideoModal from "./components/VideoModal";
import {EventTypes, LinkEventType} from "models";
import Portal from "components/Portal";
import {utils as adobeLaunch} from "@bbyca/adobe-launch";
import buildRouteLinkProps from "../DynamicContent/helpers/buildRouteLinkProps";

export interface SingleButtonProps {
    className?: string;
    buttonType: SingleButtonTypes;
    event: LinkEventType;
    darkTheme?: boolean;
}

export enum SingleButtonTypes {
    primary = "primary",
    secondary = "secondary",
    tertiary = "tertiary",
    link = "link",
    disabled = "disabled",
}

export const ButtonWithRouter = withRouterLink(Button);

const withClickHandler = (
    hasIFramedContent: boolean,
): [(e: React.MouseEvent) => void, boolean, (val: boolean) => void] => {
    const [showModal, setModalVisibility] = React.useState(false);
    const handleClick = (e: React.MouseEvent) => {
        if (hasIFramedContent) {
            e.preventDefault();
            adobeLaunch.customLink("Watch Trailer");
            setModalVisibility(true);
        }
    };
    return [handleClick, showModal, setModalVisibility];
};

const SingleButton: React.FC<SingleButtonProps> = ({buttonType, event, className = "", darkTheme}) => {
    const isDisabled = buttonType === SingleButtonTypes.disabled;
    const ctaProps = !isDisabled && buildRouteLinkProps(event);
    const target = ctaProps && ctaProps.href && ctaProps.external && !isDisabled ? "_blank" : "_self";
    const hasIFramedContent: boolean = !!(event.eventType === EventTypes.video);
    const isClientSide = typeof window !== "undefined";
    const coreStyles = [darkTheme ? styles.dark : "", className];
    const [handleClick, showModal, setModalVisibility] = withClickHandler(hasIFramedContent);

    if (event.ctaText) {
        return (
            <>
                {hasIFramedContent && event.url && isClientSide && (
                    <Portal target={document.body}>
                        <VideoModal
                            isOpen={!!showModal}
                            onClose={() => setModalVisibility(false)}
                            title={event.ctaText}
                            url={event.url}
                            ageRestricted={!!event.ageRestricted}
                        />
                    </Portal>
                )}

                {buttonType === SingleButtonTypes.link ? (
                    <Link
                        className={classname([...coreStyles, styles.link])}
                        onClick={handleClick}
                        chevronType={"right"}
                        {...ctaProps}>
                        {event.ctaText}
                    </Link>
                ) : (
                    <ButtonWithRouter
                        className={classname([...coreStyles, styles.singleButton, styles[buttonType]])}
                        onClick={handleClick}
                        isDisabled={isDisabled}
                        appearance={buttonType !== SingleButtonTypes.disabled ? buttonType : undefined}
                        extraAttrs={{
                            "data-automation": "dynamic-content-button",
                            target,
                        }}
                        {...ctaProps}>
                        {event.ctaText}
                    </ButtonWithRouter>
                )}
            </>
        );
    }
    return null;
};

export default SingleButton;
