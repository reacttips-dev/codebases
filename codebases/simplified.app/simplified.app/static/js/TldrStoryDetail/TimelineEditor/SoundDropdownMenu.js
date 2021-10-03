import React from "react";
import PropTypes from "prop-types";
import { Dropdown } from "react-bootstrap";
import {
  StyledTemplateActionsDropDownItem,
  StyledTemplateActionsDropDownMenu,
} from "../../_components/styled/styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCut, faEllipsisV, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { grey } from "../../_components/styled/variable";

const CustomToggle = React.forwardRef(({ onClick }, ref) => (
  <Link
    className="px-2"
    to=""
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      e.stopPropagation();
      onClick(e);
    }}
  >
    <FontAwesomeIcon icon={faEllipsisV} size="1x" color={grey} />
  </Link>
));

function SoundDropdownMenu({ onAdjust, onDelete }) {
  return (
    <Dropdown drop="down" alignRight={true}>
      <Dropdown.Toggle as={CustomToggle} id="dropdown-active-artboard-action" />

      <StyledTemplateActionsDropDownMenu>
        <StyledTemplateActionsDropDownItem
          onClick={(e) => {
            e.stopPropagation();
            onAdjust();
          }}
        >
          Adjust
          <FontAwesomeIcon icon={faCut} size="1x" />
        </StyledTemplateActionsDropDownItem>
        <StyledTemplateActionsDropDownItem
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          Delete
          <FontAwesomeIcon icon={faTrash} size="1x" />
        </StyledTemplateActionsDropDownItem>
      </StyledTemplateActionsDropDownMenu>
    </Dropdown>
  );
}

SoundDropdownMenu.propTypes = {
  onAdjust: PropTypes.func,
  onDelete: PropTypes.func,
};

export default SoundDropdownMenu;
