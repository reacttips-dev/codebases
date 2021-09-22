import React from "react";
import ReactTimeAgo, { ReactTimeagoProps } from "react-timeago";
import styled from "styled-components";
import { Text } from "@invisionapp/helios";
import { ITimeAgoProps } from "../../types/SearchResults/ITimeAgoProps";

const PrefixCaret = styled.div`
  height: 4px;
  width: 4px;
  border-radius: 50%;
  background-color: #cfcfd3;
  margin: 0 4px;
`;
const StyledText = styled(Text)<ITimeAgoProps>`
  line-height: 20px;
  display: flex;
  align-items: center;
`;

const StyledReactTimeAgo = styled(ReactTimeAgo)<ReactTimeagoProps<any>>`
  margin-left: 4px;
`;

const abbreviations: any = {
  second: "s",
  minute: "m",
  hour: "h",
  day: "d",
  week: "w",
  month: "mo",
  year: "y",
};

const formatter = (value: number, unit: string): string => {
  const abbrevUnit = abbreviations[unit] || unit;
  return `${value}${abbrevUnit} ago`;
};

const TimeAgo = ({
  userLastAccessedAt,
  contentUpdatedAt,
  withPrefixCaret,
}: ITimeAgoProps) => {
  return (
    <StyledText color="text-lighter" size="smallest" element="div" order="body">
      {withPrefixCaret && <PrefixCaret />}
      {userLastAccessedAt ? "Viewed" : "Updated"}
      <StyledReactTimeAgo
        live={false}
        formatter={formatter}
        date={userLastAccessedAt ? userLastAccessedAt : contentUpdatedAt}
        title={undefined} /* Disable title */
      />
    </StyledText>
  );
};

export default TimeAgo;
