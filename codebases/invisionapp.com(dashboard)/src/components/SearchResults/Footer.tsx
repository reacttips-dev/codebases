import React from "react";
import styled from "styled-components";
import { Text, Flex } from "@invisionapp/helios";
import { NavigateUp, NavigateDown, Reply } from "@invisionapp/helios/icons";

const StyledFooter = styled.div`
  border-radius: 0 0 4px 4px;
  background-color: #f8f8fa;
  box-shadow: 0 -1px 0 0 #ebecee;
  padding: 10px 24px;
`;

const StyledText = styled(Text)`
  line-height: 20px;
  letter-spacing: 0px;
  color: #6d7078;
  margin-left: 4px;
`;

const StyledEscText = styled(StyledText)`
  font-weight: 500;
`;

// Helios does not have an icon for the Enter key so we generate one by inverting the Reply icon vertically
const StyledReply = styled(Reply)`
  transform: scaleY(-1);
  margin-left: 40px;
`;

const LeftContent = () => {
  return (
    <Flex alignContent="center" alignItems="center" justifyContent="flex-start">
      <NavigateUp size={16} strokeWidth="2" fill="text-lightest" />
      <NavigateDown size={16} strokeWidth="2" fill="text-lightest" />
      <StyledText size="smallest" element="div" order="body">
        to navigate
      </StyledText>
      <StyledReply size={16} strokeWidth="2" fill="text-lightest" />
      <StyledText
        color="text-lightest"
        size="smallest"
        element="div"
        order="body"
      >
        to open
      </StyledText>
    </Flex>
  );
};

const RightContent = () => {
  return (
    <Flex alignContent="center" alignItems="center" justifyContent="flex-end">
      <StyledEscText
        color="text-lightest"
        size="smallest"
        element="div"
        order="body"
      >
        esc
      </StyledEscText>
      <StyledText
        color="text-lightest"
        size="smallest"
        element="div"
        order="body"
      >
        to close
      </StyledText>
    </Flex>
  );
};

const Footer = () => {
  return (
    <StyledFooter data-testid="global-search-ui-search-results-footer">
      <Flex
        alignContent="center"
        alignItems="center"
        justifyContent="space-between"
      >
        <LeftContent />
        <RightContent />
      </Flex>
    </StyledFooter>
  );
};

export default Footer;
