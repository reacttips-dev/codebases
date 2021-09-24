import React, {Fragment} from 'react';
import glamorous from 'glamorous';
import PropTypes from 'prop-types';
import {formatCount} from '../../../shared/utils/format';
import DescriptionCard from '../../../shared/library/cards/description';
import {Link as CardLink} from '../../../shared/library/cards/card';
import {CHARCOAL, FOCUS_BLUE} from '../../../shared/style/colors';

const Link = glamorous.a({
  color: CHARCOAL,
  '&:hover': {
    color: FOCUS_BLUE,
    textDecoration: 'underline'
  }
});

const ToolFunctionDescription = ({tool}) => {
  return (
    <Fragment>
      {tool.name} is a tool in the <strong>{tool.function.name}</strong> category of a tech stack.
    </Fragment>
  );
};

const OpenSourceTextDescription = ({tool}) => {
  return (
    <Fragment>
      {tool.name} is an open source tool with <strong>{formatCount(tool.githubStarsCount)}</strong>{' '}
      GitHub stars and <strong>{formatCount(tool.githubForksCount)}</strong> GitHub forks. Here’s a
      link to {tool.name}&#39;s open source repository on{' '}
      <Link href={tool.pressUrl} title={`${tool.name}'s GitHub`}>
        GitHub
      </Link>
    </Fragment>
  );
};

const Description = ({tool}) => {
  const showOpensoureInfo =
    tool.pressUrl && tool.githubForksCount !== 0 && tool.githubStarsCount !== 0;

  return (
    <DescriptionCard
      heading={`What is ${tool.name} and what are its top alternatives?`}
      description={tool.description}
    >
      <ToolFunctionDescription tool={tool} />
      {showOpensoureInfo && <OpenSourceTextDescription tool={tool} />}
      {tool.ampStoryEnabled && (
        <CardLink href={`/ampstories/${tool.slug}`}>Explore {`${tool.name}'s`} Story</CardLink>
      )}
    </DescriptionCard>
  );
};

Description.propTypes = {
  tool: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    pressUrl: PropTypes.string
  })
};

ToolFunctionDescription.propTypes = {
  tool: PropTypes.shape({
    name: PropTypes.string,
    function: PropTypes.shape({
      name: PropTypes.string
    })
  })
};

OpenSourceTextDescription.propTypes = {
  tool: PropTypes.shape({
    name: PropTypes.string,
    githubStarsCount: PropTypes.number,
    githubForksCount: PropTypes.number,
    pressUrl: PropTypes.string
  })
};

export default Description;
