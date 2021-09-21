import React from 'react';
import styled from '@emotion/styled';
import {
  ListHeader,
  ListItem,
  Title,
  DualColumns,
  List,
  ListSubHeader,
} from '../../../../components/MarketingPagesShared/DualColumnList';
import { MarketingSection } from '../../../../components/MarketingPagesShared/styles';

export function GetStarted() {
  return (
    <MarketingSection>
      <DualColumns>
        <Title>Getting Started</Title>
        <List>
          <GetStartedListItem>
            <ListSubHeader>Step 1</ListSubHeader>
            <ListHeader>Create an account and connect your blog</ListHeader>
          </GetStartedListItem>
          <GetStartedListItem>
            <ListSubHeader>Step 2</ListSubHeader>
            <ListHeader>Record or convert posts to audio</ListHeader>
          </GetStartedListItem>
          <GetStartedListItem>
            <ListSubHeader>Step 3</ListSubHeader>
            <ListHeader>Distribute your podcast everywhere</ListHeader>
          </GetStartedListItem>
        </List>
      </DualColumns>
    </MarketingSection>
  );
}

const GetStartedListItem = styled(ListItem)`
  padding: 0 0 12px 0;
  margin: 0 0 32px 0;
`;
