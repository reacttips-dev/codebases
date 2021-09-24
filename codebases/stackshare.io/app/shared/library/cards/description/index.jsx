import React from 'react';
import PropTypes from 'prop-types';
import {TITLE_TEXT, BASE_TEXT} from '../../../style/typography';
import {TARMAC, CHARCOAL} from '../../../style/colors';
import glamorous from 'glamorous';

const Container = glamorous.div();

const Title = glamorous.h2(
  {
    ...TITLE_TEXT,
    fontSize: 18,
    color: CHARCOAL,
    margin: 0
  },
  ({headingPadding}) => ({
    padding: headingPadding
  })
);

const Description = glamorous.div({
  ...BASE_TEXT,
  marginTop: 8,
  color: TARMAC,
  lineHeight: 1.69
});

const DescriptionCard = ({heading, description, children, headingPadding}) => {
  const childrenDescription =
    children &&
    children.map((d, index) => {
      return <Description key={index}>{d}</Description>;
    });

  return (
    <Container>
      <Title headingPadding={headingPadding}>{heading}</Title>
      <Description>{description}</Description>
      {children && childrenDescription}
    </Container>
  );
};

DescriptionCard.propTypes = {
  heading: PropTypes.string,
  description: PropTypes.string,
  children: PropTypes.array,
  headingPadding: PropTypes.string
};

export default DescriptionCard;
