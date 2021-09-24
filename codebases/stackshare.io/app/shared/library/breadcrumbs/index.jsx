import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import {BASE_TEXT} from '../../style/typography';
import {CONCRETE, FOCUS_BLUE} from '../../style/colors';
import {PHONE_LANDSCAPE} from '../../style/breakpoints';
import glamorous from 'glamorous';

const Container = glamorous.div({
  ...BASE_TEXT,
  display: 'flex',
  flexWrap: 'wrap',
  [PHONE_LANDSCAPE]: {
    ' > a': {
      textAlign: 'center'
    }
  }
});

const BreadcrumbLink = glamorous.a({
  textDecoration: 'none',
  cursor: 'pointer',
  color: CONCRETE,
  '&:hover': {
    color: FOCUS_BLUE
  }
});

const Divider = glamorous.div({
  color: CONCRETE,
  margin: '0 5px 0 5px',
  '::after': {
    content: '/'
  }
});

const Breadcrumbs = ({items}) => (
  <Container data-testid="breadcrumbs">
    {items.map(({name, path}, index) => (
      <Fragment key={index}>
        {index > 0 && <Divider />}
        {index < items.length && <BreadcrumbLink href={path}>{name}</BreadcrumbLink>}
      </Fragment>
    ))}
  </Container>
);

Breadcrumbs.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      path: PropTypes.string
    })
  )
};

export default Breadcrumbs;
