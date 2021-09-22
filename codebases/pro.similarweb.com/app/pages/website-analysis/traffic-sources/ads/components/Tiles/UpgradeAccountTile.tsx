import { SWReactIcons } from "@similarweb/icons";
import { Button } from "@similarweb/ui-components/dist/button";
import React from "react";
import LocationService from "../../../../../../../.pro-features/components/Modals/src/UnlockModal/LocationService";
import UnlockModalProvider from "../../../../../../components/React/UnlockModalProvider/UnlockModalProvider";
import { allTrackers } from "../../../../../../services/track/track";
import TileDetails from "./TileDetails";

interface IUpgradeAccountTileState {
    isUnlockModalOpen: boolean;
}

class UpgradeAccountTile extends React.PureComponent<any, IUpgradeAccountTileState> {
    constructor(props) {
        super(props);

        this.state = {
            isUnlockModalOpen: false,
        };
    }

    public render() {
        const { item, lockedAdsCount, tileUnlockConfig } = this.props;
        return (
            <div className="tile-box upgrade-tile">
                <div className="image-and-link">
                    <span className="unlock-title">
                        <SWReactIcons iconName="private" className="locker" />
                        <span className="unlock-text">{`Unlock ${lockedAdsCount} more ads!`}</span>
                    </span>
                    <Button onClick={this.upgradeClick} className="unlock-button">
                        {/*<a className="upgrade-account-link" href={swSettings.swurls.UpgradeAccountURL} target='_blank'></a>*/}
                        Upgrade
                    </Button>
                </div>
                <TileDetails item={item} />
                {tileUnlockConfig && (
                    <UnlockModalProvider
                        isOpen={this.state.isUnlockModalOpen}
                        onCloseClick={() => {
                            this.setState({ isUnlockModalOpen: false });
                        }}
                        location={`${LocationService.getCurrentLocation()}/Upgrade`}
                        {...tileUnlockConfig}
                    />
                )}
            </div>
        );
    }

    private upgradeClick = () => {
        const { onTileUpgradeClick, tileUnlockConfig } = this.props;
        if (!tileUnlockConfig) {
            onTileUpgradeClick();
        } else {
            this.setState({ isUnlockModalOpen: true }, () => {
                allTrackers.trackEvent("hook/Contact Us/Pop Up", "click", "Upgrade");
            });
        }
    };
}

export default UpgradeAccountTile;
