import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo } from "@fortawesome/free-solid-svg-icons";
import { primary } from "../_components/styled/variable";
import { StyledVideoModal } from "../_components/styled/styles.js";
import YoutubeEmbed from "../_components/common/YoutubeEmbed";

const TldrVideoInAction = ({ title, videoInAction }) => {
  const [show, setShow] = useState(false);
  return (
    <StyledVideoModal>
      <FontAwesomeIcon
        icon={faVideo}
        size="1x"
        color={primary}
        className="mr-1"
      ></FontAwesomeIcon>
      <a
        href="#viewInAction"
        onClick={() => setShow(true)}
        data-toggle="modal"
        className="view-in-action-link"
      >
        View in action
      </a>

      <Modal
        size="lg"
        backdrop="static"
        centered
        show={show}
        onHide={() => setShow(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>

        <YoutubeEmbed
          embedId={videoInAction}
          title={title}
          width="100%"
          height="500px"
        ></YoutubeEmbed>
      </Modal>
    </StyledVideoModal>
  );
};

export default TldrVideoInAction;
