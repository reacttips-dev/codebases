import React, {useContext} from 'react';
import glamorous from 'glamorous';
import BigTitle from '../../../shared/library/typography/big-title';
import Text from '../../../shared/library/typography/text';
import {JobsContext} from '../enhancers/jobs';
import {PAGE_BACKGROUND, WHITE} from '../../../shared/style/colors';
import {PHONE} from '../../../shared/style/breakpoints';
import BackIcon from '../../../shared/library/icons/back-arrow.svg';
import BookmarkIcon from '../../../shared/library/icons/bookmarked-blue.svg';

const Container = glamorous.div({
  gridArea: 'searchBar',
  position: 'sticky',
  top: 0,
  zIndex: 2,
  background: WHITE,
  boxShadow: '0 1px #ebebeb',
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  [PHONE]: {
    background: PAGE_BACKGROUND,
    position: 'relative'
  }
});

const Content = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  width: 828,
  [PHONE]: {
    maxWidth: '100%',
    flexDirection: 'column',
    marginLeft: 0
  }
});

const Bookmark = glamorous(BookmarkIcon)({
  width: 15,
  height: 15,
  marginRight: 10
});

const ItemDetails = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

const Title = glamorous(BigTitle)({
  margin: 0
});

const BackToSearch = glamorous.div({
  margin: 0,
  position: 'absolute',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  marginLeft: 30,
  '>svg': {
    marginRight: 5
  }
});

const Item = glamorous.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '100%'
});

const AltHeader = () => {
  const jobsContext = useContext(JobsContext);

  return (
    <Container>
      <BackToSearch
        onClick={() => {
          jobsContext.setBookmarkSearch(false);
          jobsContext.setTerms([]);
          jobsContext.setHitsPerPage(15);
        }}
      >
        <BackIcon />
        <Text>Search</Text>
      </BackToSearch>
      <Content>
        <Item>
          <ItemDetails>
            <Bookmark />
            <Title>My Bookmarked Jobs</Title>
          </ItemDetails>
        </Item>
      </Content>
    </Container>
  );
};

export default AltHeader;
