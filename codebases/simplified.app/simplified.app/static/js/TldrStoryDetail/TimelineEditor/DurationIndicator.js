import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { grey, lightInactive, md } from "../../_components/styled/variable";

dayjs.extend(duration);

const StyledDurationIndicator = styled.div`
  height: 100%;
  font-size: 16px;
  color: ${grey};
  font-weight: 400;
  .current {
    color: ${lightInactive};
    margin-right: 2px;
  }
  .total {
    margin-left: 2px;
  }

  @media (max-width: ${md}) {
    font-size: 12px;
  }
`;

function DurationIndicator({ className, total, current }) {
  return (
    <StyledDurationIndicator className={className}>
      <span className="current">
        {current !== undefined && current !== null
          ? dayjs.duration(current, "seconds").format("mm:ss")
          : "-"}
      </span>
      /
      <span className="total">
        {total !== undefined && total !== null
          ? dayjs.duration(total, "seconds").format("mm:ss")
          : "--"}
      </span>
    </StyledDurationIndicator>
  );
}

DurationIndicator.propTypes = {
  total: PropTypes.number,
  current: PropTypes.number,
};

export default DurationIndicator;
