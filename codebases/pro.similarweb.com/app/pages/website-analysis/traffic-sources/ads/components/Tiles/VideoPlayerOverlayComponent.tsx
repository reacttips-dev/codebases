/**
 * Created by eyal.albilia on 10/31/17.
 */
import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactModal from "react-modal";

export const modalStyles = {
    overlay: {
        zIndex: "1021",
        backgroundColor: "rgba(43, 61, 82, 0.8)",
    },
    content: {
        top: "140px",
        left: "50%",
        bottom: "auto",
        maxHeight: "85%",
        marginLeft: "-280px",
        overflow: "visible",
        opacity: "1",
        width: "40%",
        padding: 0,
        paddingTop: "35px",
        backgroundColor: "rgb(0,0,0)",
        borderRadius: "4px",
        border: "1px solid #000",
    },
};

export default class VideoPlayerOverlayComponent extends Component<any, any> {
    public static propTypes = {
        videoStartTrack: PropTypes.func,
        videoUrl: PropTypes.string.isRequired,
    };

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
        };
    }

    public render() {
        return (
            <div>
                <span className="tile-play-container" onClick={this.toggleModalState}>
                    <span className="play-circle">
                        <span className="play-triangle" />
                    </span>
                </span>
                <ReactModal
                    style={modalStyles}
                    isOpen={this.state.showModal}
                    onRequestClose={this.toggleModalState}
                    shouldCloseOnOverlayClick={true}
                    contentLabel="Display Ads player modal"
                >
                    <span className="modal-player-closing-modal-icon">
                        <i className="icon icon-times" onClick={this.toggleModalState} />
                    </span>
                    <video
                        controls={true}
                        autoPlay={true}
                        style={{ width: "100%", display: "block" }}
                    >
                        <source src={this.props.videoUrl} type="video/mp4" />
                    </video>
                </ReactModal>
            </div>
        );
    }

    private toggleModalState = (): void => {
        this.setState(
            (prevState) => ({ showModal: !prevState.showModal }),
            () => {
                if (this.state.showModal) {
                    this.props.videoStartTrack();
                }
            },
        );
    };
}
