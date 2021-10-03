import React from "react";
import PropTypes from "prop-types";
import { StyledSeeker } from "./styled";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

const Seeker = React.forwardRef(({ parentId, pos, onChangePosition }, ref) => {
  return (
    <StyledSeeker
      ref={ref}
      bounds={parentId}
      enableResizing={false}
      default={{
        height: "100%",
        x: pos,
        y: 0,
      }}
      dragAxis="x"
      position={{
        x: pos,
        y: 0,
      }}
      onDragStop={onChangePosition}
    >
      <div className="seeker">
        <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
      </div>
    </StyledSeeker>
  );
});

Seeker.propTypes = {
  parentId: PropTypes.string.isRequired,
  pos: PropTypes.number,
  onChangePosition: PropTypes.func,
};

export default Seeker;
