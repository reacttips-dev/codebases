import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle as faSolidCheckCircle,
  faFolder,
  faEllipsisV,
  faQuestionCircle,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { faCheckCircle as faRegularCheckCircle } from "@fortawesome/free-regular-svg-icons";
import { lightInactive } from "../variable";
import {
  CheckboxComponent,
  FolderComponent,
  ModalInputField,
  EmptyScreenComponent,
  MoveFolderSlide,
} from "./stylesHome";
import {
  Tooltip,
  Modal,
  OverlayTrigger,
  Button,
  Spinner,
} from "react-bootstrap";
import emptyScreenImage from "../../../assets/images/empty-state.svg";
import { Link } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import { ShowNoContent } from "../../common/statelessView";
import { StyledIntercomChatButton } from "../styles";

export const Checkbox = (props) => {
  const { hasAbsolutePosition, description, checked } = props;

  return (
    <CheckboxComponent hasAbsolutePosition={hasAbsolutePosition}>
      <OverlayTrigger
        placement="bottom"
        overlay={<Tooltip>{description}</Tooltip>}
      >
        <FontAwesomeIcon
          icon={checked ? faSolidCheckCircle : faRegularCheckCircle}
          color={lightInactive}
          size="lg"
          onClick={(e) => {
            e.stopPropagation();
            props.onCheck(!checked);
          }}
        />
      </OverlayTrigger>
    </CheckboxComponent>
  );
};

export const Folder = (props) => {
  const { folder } = props;
  const [hovering, setHovering] = React.useState(false);

  const threeDotMenu = React.forwardRef(({ onClick }, ref) => (
    <div
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    >
      <FontAwesomeIcon icon={faEllipsisV} color={lightInactive} />
    </div>
  ));

  return (
    <FolderComponent
      onClick={props.onClick}
      hasNoContent={folder.total_contents === 0}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <FontAwesomeIcon icon={faFolder} color={lightInactive} size="lg" />
      <span className="name">{folder.name}</span>
      {folder.total_contents || (folder.total_contents && !hovering > 0) ? (
        <span className="count badge">{folder.total_contents}</span>
      ) : null}
      {hovering ? (
        <div onClick={(e) => e.stopPropagation()}>
          <Dropdown>
            <Dropdown.Toggle as={threeDotMenu}></Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item as="a" onClick={props.onRenameHandler}>
                Rename
              </Dropdown.Item>
              <Dropdown.Item as="a" onClick={props.onDuplicateHandler}>
                Duplicate
              </Dropdown.Item>
              <Dropdown.Item as="a" onClick={props.onDeleteHandler}>
                Delete
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      ) : null}
    </FolderComponent>
  );
};

export const TldrNewFolderDialog = (props) => {
  const { show, onHide, inProgress, rename } = props;
  const [value, setValue] = React.useState(props.value ? props.value : "");
  const innerRef = useRef();

  useEffect(() => {
    innerRef.current && innerRef.current.focus();
    setValue(props.value ? props.value : "");
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered size="sm" backdrop="static">
      <Modal.Header bsPrefix="modal-header align-items-center">
        <Modal.Title>{`${
          rename ? "Rename" : "Create a new"
        } folder`}</Modal.Title>
      </Modal.Header>
      <hr className="modal-hr" />
      <Modal.Body>
        <ModalInputField
          ref={innerRef}
          type="text"
          placeholder="My Folder"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (value.trim().length > 0) props.onYes(value);
            }
          }}
        />
      </Modal.Body>
      <hr className="modal-hr" />
      <Modal.Footer>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            props.onHide();
          }}
          variant="outline-warning"
          disabled={inProgress === "true" ? true : false}
        >
          Cancel
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            if (value.trim().length > 0) props.onYes(value);
          }}
          variant="warning"
        >
          {inProgress === "true" && (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              <span className="sr-only">
                {rename ? "Applying..." : "Creating..."}
              </span>
            </>
          )}
          {props.inProgress === "false" && `${rename ? "Apply" : "Create"}`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export const EmptyStateScreen = (props) => {
  return (
    <EmptyScreenComponent>
      <h1>{props.title}</h1>
      <img src={emptyScreenImage} alt="Empty State" />
      <p className="description">{props.description}</p>
      {props.link ? (
        <Link to={props.link} style={{ textDecoration: "underline" }}>
          {props.linkPlaceholder}
        </Link>
      ) : null}
      {props.actionButtonOnClick ? (
        <Link
          onClick={props.actionButtonOnClick}
          style={{ textDecoration: "underline" }}
        >
          {props.actionButtonPlaceholder}
        </Link>
      ) : null}
    </EmptyScreenComponent>
  );
};

export const TldrMoveToFolderModel = (props) => {
  const { show, onHide, inProgress, folderItems } = props;
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  useEffect(() => {
    return () => {
      setSelectedIndex(0);
    };
  }, [show]);

  return (
    <Modal show={show} onHide={onHide} centered size="md" backdrop="static">
      <Modal.Header bsPrefix="modal-header align-items-center">
        <Modal.Title>Add to Folder</Modal.Title>
      </Modal.Header>
      <hr className="modal-hr" />
      <Modal.Body>
        <MoveFolderSlide>
          {folderItems.length === 0 ? (
            <ShowNoContent text="No folders found." />
          ) : (
            folderItems.map((item, index) => (
              <div
                className={`move-folder-item ${
                  index === selectedIndex ? "selected" : ""
                }`}
                onClick={() => setSelectedIndex(index)}
                key={index}
              >
                <span className="arrow">&#62;</span>
                <span className="name">{item.name}</span>
              </div>
            ))
          )}
        </MoveFolderSlide>
      </Modal.Body>
      <hr className="modal-hr" />
      <Modal.Footer>
        <div className="move-to-folder-modal-footer">
          <div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                props.onAddFolder();
              }}
              variant="outline-warning"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              Add folder
            </Button>
          </div>
          <div>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                props.onHide();
              }}
              variant="outline-warning"
              disabled={inProgress === "true" ? true : false}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                props.onYes(folderItems[selectedIndex]);
              }}
              variant="warning"
              disabled={folderItems.length === 0}
            >
              {inProgress === "true" && (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                  />
                  <span className="sr-only">Add...</span>
                </>
              )}
              {props.inProgress === "false" && "Add"}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export const IntercomCustomIcon = () => {
  return (
    <OverlayTrigger
      placement="top"
      overlay={<Tooltip id="heart">Contact us</Tooltip>}
    >
      <StyledIntercomChatButton id="chatonintercom">
        <FontAwesomeIcon
          icon={faQuestionCircle}
          id="chatonintercom"
        ></FontAwesomeIcon>
      </StyledIntercomChatButton>
    </OverlayTrigger>
  );
};
