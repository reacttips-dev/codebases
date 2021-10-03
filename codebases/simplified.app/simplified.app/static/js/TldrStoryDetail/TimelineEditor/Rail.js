import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { blackAlpha } from "../../_components/styled/variable";

const StyledRail = styled.div`
  display: flex;
  min-width: 100%;
  transition: background 0.3s;
  align-items: center;
  padding: 8px 0;
  position: relative;

  :hover {
    background: ${blackAlpha};
  }

  .inner-div {
    display: flex;
    position: relative;
  }
`;

function Rail({ id, children, height, innerDivClasses, width, addComponent }) {
  let classes = "inner-div ";
  if (innerDivClasses) {
    classes += innerDivClasses;
  }

  return (
    <StyledRail>
      <div id={id} className={classes} style={{ height, width }}>
        {children}
      </div>
      {addComponent}
    </StyledRail>
  );
}

Rail.defaultProps = {
  width: "100%",
};

Rail.propTypes = {
  id: PropTypes.string.isRequired,
  addComponent: PropTypes.node,
};

export default Rail;
