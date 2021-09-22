import * as classNames from "classnames";
import * as React from "react";
import { StatelessComponent } from "react";
import { AppTooltip } from "../../../.pro-features/components/tooltips/src/AppTooltip/AppTooltip";
import { AssetsService } from "../../services/AssetsService";
import {
    AppClosableCloseIcon,
    AppClosableImageItem,
    ClosableItemColorMarker,
    ClosableItemContainer,
    ClosableItemIconContainer,
    ClosableItemText,
} from "./StyledComponent";

interface IAppClosableCompareItemProps {
    Id: string;
    displayName: string;
    AppStore?: string;
    Color: string;
    Icon: string;
    onIconClick: (item) => void;
    onClose: (item) => void;
    item;
    link: string;
    Tooltip: any;
    closable?: boolean;
}

export const AppClosableCompareItem: StatelessComponent<IAppClosableCompareItemProps> = (props) => {
    return (
        <ClosableItemContainer
            className={classNames("AppClosableCompareItem QueryBarClosableCompareItem")}
            onClick={props.onIconClick.bind(null, { ...props })}
        >
            <AppTooltip
                app={props.Tooltip}
                appId={props.Id}
                store={props.AppStore}
                placement="bottom"
                cssClass="appTooltip-element react-info-tip-container"
                getAssetsUrl={AssetsService.assetUrl.bind(AssetsService)}
            >
                <ClosableItemIconContainer>
                    {props.Icon && (
                        <AppClosableImageItem
                            data-automation-closable-app-icon-image={true}
                            src={props.Icon}
                        />
                    )}
                    {props.Color && (
                        <ClosableItemColorMarker style={{ backgroundColor: props.Color }} />
                    )}
                    {props.closable ? (
                        <span onClick={() => props.onClose(props.Id)}>
                            <AppClosableCloseIcon />
                        </span>
                    ) : null}
                </ClosableItemIconContainer>
            </AppTooltip>
            {props.displayName && (
                <ClosableItemText
                    data-automation-closable-item-text={true}
                    href={props.link}
                    target="_blank"
                >
                    {props.displayName}
                </ClosableItemText>
            )}
        </ClosableItemContainer>
    );
};
AppClosableCompareItem.displayName = "AppClosableCompareItem";
AppClosableCompareItem.defaultProps = {
    closable: true,
};
