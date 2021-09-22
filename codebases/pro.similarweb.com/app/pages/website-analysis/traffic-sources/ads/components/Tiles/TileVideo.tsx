import React, { StatelessComponent } from "react";
import { trackCreativeImageClick, trackCampaignVisit, trackCreativeVideoClick } from "./tileTrack";
import VideoPlayerOverlayComponent from "./VideoPlayerOverlayComponent";

const TileVideo: StatelessComponent<any> = ({
    Url,
    CampaignUrl,
    Width: width,
    Height: height,
    UrlVideo,
}) => {
    return (
        <div className="image-and-link">
            <a className="tile-img-container">
                <img className="tile-img" src={Url} />
                <VideoPlayerOverlayComponent
                    videoUrl={UrlVideo}
                    videoStartTrack={() => trackCreativeVideoClick(Url)}
                />
            </a>
            <a
                className="tile-link"
                href={CampaignUrl}
                target="_blank"
                onClick={() => trackCampaignVisit(CampaignUrl)}
            >
                {CampaignUrl}
            </a>
        </div>
    );
};

export default TileVideo;
