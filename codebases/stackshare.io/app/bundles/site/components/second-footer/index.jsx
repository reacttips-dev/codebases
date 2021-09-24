import React, {useMemo} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import {BASE_TEXT, WEIGHT} from '../../../../shared/style/typography';
import {CHARCOAL, FOCUS_BLUE} from '../../../../shared/style/colors';
import {PAGE_WIDTH} from '../../../../shared/style/dimensions';
import {PHONE_LANDSCAPE, TABLET} from '../../../../shared/style/breakpoints';

const Container = glamorous.div({
  background: '#f7f7f7',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  paddingTop: 68,
  paddingBottom: 68,
  [PHONE_LANDSCAPE]: {
    paddingTop: 30,
    paddingBottom: 50
  }
});

const FixedColumn = glamorous.div({
  width: PAGE_WIDTH,
  display: 'flex',
  justifyContent: 'space-between',
  paddingLeft: 20,
  paddingRight: 20,
  [PHONE_LANDSCAPE]: {
    flexDirection: 'column',
    justifyContent: 'center'
  }
});

const List = glamorous.div({
  ...BASE_TEXT,
  color: CHARCOAL,
  display: 'flex',
  flexDirection: 'column',
  [PHONE_LANDSCAPE]: {
    textAlign: 'center'
  }
});

const Heading = glamorous.h2({
  fontSize: 20,
  fontWeight: WEIGHT.BOLD,
  letterSpacing: 0.4
});

const Link = glamorous.a({
  fontSize: 13,
  lineHeight: 2.07,
  letterSpacing: 0.3,
  textDecoration: 'none',
  color: CHARCOAL,
  ':hover': {
    color: FOCUS_BLUE
  },
  [TABLET]: {
    fontSize: 14
  }
});

const itemPresenter = (item, section, altLink, altTitle, jobsLink, jobsTitle) => {
  const {name, path, title, slug, __typename} = item;
  const types = __typename || section.type;
  let url = path || `/${slug}`;
  let linkName = title || name;
  if (section.type === 'jobs' && jobsLink && jobsTitle) {
    url = `${jobsLink}${url}`;
    linkName = `${linkName} ${jobsTitle}`;
  }
  switch (types) {
    case 'Tool':
      if (altLink && altTitle) {
        url = `${url}${altLink}`;
        linkName = `${linkName} ${altTitle}`;
      }
      break;
    case 'Alternative':
      url = `/${slug}/alternatives`;
      linkName = `${name} Alternatives`;
      break;
    case 'Stackup':
      url = path || `/stackups/${slug}`;
      break;
  }
  return {linkName, url};
};

const SecondaryFooter = ({sections, altLink, altTitle, jobsLink, jobsTitle}) => {
  const filteredSections = sections.filter(
    section => section.title && section.items && section.items.length > 0
  );

  const renderedSections = useMemo(
    () =>
      sections.map((section, key) => (
        <List key={key}>
          <Heading>{section.title}</Heading>
          {section.items.map((item, key) => {
            const {linkName, url} = itemPresenter(
              item,
              section,
              altLink,
              altTitle,
              jobsLink,
              jobsTitle
            );
            return (
              <Link key={key} href={url} title={linkName}>
                {linkName}
              </Link>
            );
          })}
        </List>
      )),
    [sections]
  );

  return (
    sections &&
    filteredSections.length !== 0 && (
      <Container>
        <FixedColumn>{renderedSections}</FixedColumn>
      </Container>
    )
  );
};

SecondaryFooter.propTypes = {
  sections: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      type: PropTypes.string,
      items: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.number,
          name: PropTypes.string,
          slug: PropTypes.string,
          path: PropTypes.string,
          title: PropTypes.string
        })
      )
    })
  ),
  altLink: PropTypes.string,
  altTitle: PropTypes.string,
  jobsLink: PropTypes.string,
  jobsTitle: PropTypes.string
};

export default SecondaryFooter;
