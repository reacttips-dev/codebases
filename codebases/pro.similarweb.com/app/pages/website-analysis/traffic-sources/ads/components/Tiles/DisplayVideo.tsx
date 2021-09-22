import React, { StatelessComponent } from "react";
import TileDetails from "./TileDetails";
import TileVideo from "./TileVideo";

const DisplayVideo: StatelessComponent<any> = ({ item }) => {
    return (
        <div className="tile-box">
            <TileVideo {...item} />
            <TileDetails item={item} />
        </div>
    );
};

// creativeTile.propTypes = {};
// creativeTile.defaultProps = {};

export default DisplayVideo;
