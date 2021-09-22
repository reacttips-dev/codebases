import { FC } from "react";
import TileImage from "./TileImage";
import TileDetails from "./TileDetails";

const DisplayTile: FC<any> = ({ item, locked }) => {
    return (
        <div className="tile-box">
            <TileImage {...item} locked={locked} />
            <TileDetails item={item} locked={locked} />
        </div>
    );
};

export default DisplayTile;
