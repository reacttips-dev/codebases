import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {WEIGHT, BASE_TEXT} from '../../../style/typography';
import {PHONE} from '../../../style/breakpoints';
import {TARMAC} from '../../../style/colors';
import {Container, Title, Link, SectionPlaceholder} from '../card';
import glamorous from 'glamorous';
import {formatToolList} from '../../../utils/format-tool-list';

const Name = glamorous.div({fontWeight: WEIGHT.BOLD});

const Description = glamorous.div({
  ...BASE_TEXT,
  lineHeight: '22px',
  color: TARMAC,
  paddingLeft: 10
});

const GridContainer = glamorous.div({
  display: 'grid',
  gridTemplateColumns: '150px auto',
  gridRowGap: 20,
  marginBottom: 20,
  marginTop: 20,
  [PHONE]: {
    gridTemplateColumns: '100px auto'
  }
});

const Alternative = glamorous.div({
  display: 'flex',
  flexDirection: 'row',
  ...BASE_TEXT,
  lineHeight: '22px',
  color: TARMAC
});

const AlternativesCard = ({tools, title, items, altPath}) => {
  let subject = '';
  if (tools && tools.length > 1) {
    subject = formatToolList(tools);
  } else {
    subject = title;
  }
  const displayTitle = `What are some alternatives to ${subject}?`;
  let popularTool;
  if (tools && tools.length > 0) {
    popularTool = tools[0];
    for (let i = 1; i < tools.length; i++) {
      if (tools[i].popularity > popularTool.popularity) {
        popularTool = tools[i];
      }
    }
  }

  const showLink = (popularTool && popularTool.path) || altPath;

  return (
    <Container>
      {title && <Title>{displayTitle}</Title>}
      {items.length > 0 && (
        <Fragment>
          <GridContainer>
            {items.map(({name, description}, index) => (
              <Fragment key={index}>
                <Alternative>
                  <Name>{name}</Name>
                </Alternative>
                <Description>{description}</Description>
              </Fragment>
            ))}
          </GridContainer>
          {showLink && (
            <Link
              data-testid="seeAllAlternativesLink"
              href={altPath ? altPath : `${popularTool.path}/alternatives`}
            >
              See all alternatives
            </Link>
          )}
        </Fragment>
      )}
      {items.length === 0 && <SectionPlaceholder>No alternatives found</SectionPlaceholder>}
    </Container>
  );
};

AlternativesCard.propTypes = {
  tools: PropTypes.array,
  title: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({name: PropTypes.string, description: PropTypes.string})
  ),
  altPath: PropTypes.string
};

export default AlternativesCard;
