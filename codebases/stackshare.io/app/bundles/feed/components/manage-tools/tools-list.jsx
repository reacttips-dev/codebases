import React from 'react';
import ServiceTile, {SMALL} from '../../../../shared/library/tiles/service';
import FollowServiceButton from '../../../../shared/library/buttons/follow/follow-service-button';
import glamorous from 'glamorous';
import {BASE_TEXT} from '../../../../shared/style/typography';
import {GUNSMOKE} from '../../../../shared/style/colors';

const List = glamorous.ul({
  padding: 0,
  margin: 0,
  paddingTop: 13
});

const ListItem = glamorous.li({
  display: 'flex',
  flexDirection: 'row',
  paddingLeft: 15,
  paddingRight: 15,
  marginBottom: 13,
  alignItems: 'center'
});

const Hugs = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
  flexWrap: 'none',
  alignItems: 'center'
});

const Label = glamorous.div({
  ...BASE_TEXT,
  fontSize: 14,
  lineHeight: 1.4,
  marginLeft: 10,
  marginRight: 10,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});

const EmptyMsg = glamorous.div({
  ...BASE_TEXT,
  fontSize: 16,
  color: GUNSMOKE,
  textAlign: 'center',
  width: '75vw',
  lineHeight: 1.7,
  margin: '30px auto'
});

// eslint-disable-next-line react/prop-types,react/display-name
export default ({tools}) => (
  <List>
    {tools.map(({id, name, following, canonicalUrl, imageUrl}) => (
      <ListItem key={id}>
        <Hugs>
          <ServiceTile size={SMALL} name={name} href={canonicalUrl} imageUrl={imageUrl} />
          <Label>{name}</Label>
        </Hugs>
        <FollowServiceButton serviceId={id} following={following} />
      </ListItem>
    ))}
    {tools.length === 0 && (
      <EmptyMsg>
        You aren&apos;t following any tools.
        <br />
        Use the search bar above to find and follow tools to personalize your feed experience.
      </EmptyMsg>
    )}
  </List>
);
