import UnlockModalV2Container from "components/React/UnlockModalContainer/UnlockModalV2Container";
import * as _ from "lodash";
import * as React from "react";
import { Component } from "react";
import ReactModal from "react-modal";
import lockedTileImg from "./images/locked-tile.svg";
import { trackCampaignVisit, trackCreativeImageClick } from "./tileTrack";

const modalStyles = {
    overlay: {
        zIndex: "1021",
        backgroundColor: "rgba(43, 61, 82, 0.8)",
    },
    content: {
        top: "140px",
        left: "50%",
        bottom: "auto",
        maxHeight: "70%",
        maxWidth: "40%",
        overflow: "visible",
        opacity: "1",
        padding: 0,
        paddingTop: "35px",
        backgroundColor: "rgb(0,0,0)",
        borderRadius: "4px",
        border: "1px solid #000",
    },
};

export default class TileImage extends Component<any, any> {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    public render() {
        const { locked } = this.props;
        const minWidth = Math.min(window.innerWidth * 0.4, this.props.Width);
        modalStyles.content = _.merge(modalStyles.content, {
            width: `${this.props.Width}px`,
            left: `calc(50% - ${minWidth / 2}px)`,
        });
        return (
            <div className="image-and-link">
                <div className="tile-img-container">
                    <span
                        style={{
                            display: "block",
                            width: "100%",
                            cursor: "pointer",
                            textAlign: "center",
                        }}
                        onClick={locked ? undefined : this.toggleModalState}
                    >
                        {locked && (
                            <UnlockModalV2Container
                                className="tile-locked-link"
                                isLink={true}
                                buttonText=""
                                modalConfig={{
                                    featureKey: "GetMoreResults",
                                    trackingSubName: "creatives",
                                }}
                            />
                        )}
                        <img
                            className="tile-img"
                            src={locked ? lockedTileImg : this.props.Url}
                            alt=""
                        />
                        {locked && <div className="tile-img-locked-text">Upgrade your account</div>}
                    </span>
                    <ReactModal
                        style={modalStyles}
                        isOpen={this.state.showModal}
                        onRequestClose={this.toggleModalState}
                        shouldCloseOnOverlayClick={true}
                        contentLabel="Display Ad image modal"
                    >
                        <span className="modal-player-closing-modal-icon">
                            <i className="icon icon-times" onClick={this.toggleModalState} />
                        </span>
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <img className="tile-img" src={this.props.Url} alt="" />
                        </div>
                    </ReactModal>
                </div>
                {!locked && (
                    <a
                        className="tile-link"
                        href={this.props.CampaignUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackCampaignVisit(this.props.CampaignUrl)}
                    >
                        {this.props.CampaignUrl}
                    </a>
                )}
            </div>
        );
    }

    private toggleModalState = (): void => {
        this.setState(
            (prevState) => ({ showModal: !prevState.showModal }),
            () => {
                if (this.state.showModal) {
                    trackCreativeImageClick(this.props.Url);
                }
            },
        );
    };
}
