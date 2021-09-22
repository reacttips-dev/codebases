import { FC } from "react";
import DisplayTile from "./DisplayTile";
import DisplayVideo from "./DisplayVideo";
import UpgradeAccountTile from "./UpgradeAccountTile";
import { LockedTile } from "./LockedTile";
import {
    ALL_DISPLAY,
    DESKTOP_DISPLAY,
    MOBILE_DISPLAY,
    ALL_VIDEO,
    DESKTOP_VIDEO,
    MOBILE_VIDEO,
    VIDEO_OTHER,
    HTML5,
} from "../../channels";
import * as _ from "lodash";

const Tiles: FC<any> = ({
    list,
    lockedAdsCount,
    showUpgradeTile,
    onTileUpgradeClick,
    tileUnlockConfig,
}) => {
    const randomItem = _.sample(list);
    return (
        <div className="tiles-container">
            {list.map((item, idx) => {
                const { Type } = item;
                let TileComponent;
                if (item.Url === "grid.upgrade") {
                    TileComponent = LockedTile;
                } else {
                    switch (Type) {
                        case ALL_DISPLAY:
                        case DESKTOP_DISPLAY:
                        case MOBILE_DISPLAY:
                        case HTML5:
                            TileComponent = DisplayTile;
                            break;
                        case ALL_VIDEO:
                        case DESKTOP_VIDEO:
                        case MOBILE_VIDEO:
                        case VIDEO_OTHER:
                            TileComponent = DisplayVideo;
                            break;
                    }
                }
                return TileComponent && <TileComponent key={idx} item={item} />;
            })}
            {showUpgradeTile && (
                <UpgradeAccountTile
                    onTileUpgradeClick={onTileUpgradeClick}
                    tileUnlockConfig={tileUnlockConfig}
                    item={randomItem}
                    lockedAdsCount={lockedAdsCount}
                />
            )}
        </div>
    );
};

export default Tiles;
