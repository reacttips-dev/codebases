import React from 'react';
import PropTypes from 'prop-types';
import glamorous from 'glamorous';
import Breadcrumbs from '../../../../shared/library/breadcrumbs';

const Container = glamorous.div({
  margin: '10px 0'
});

const ToolBreadCrumbs = ({tool}) => {
  const {layer, category} = tool;

  const items = [
    {name: 'Home', path: '/'},
    {name: layer.name, path: `/${layer.slug}`},
    {name: category.name, path: `/${category.slug}`},
    {name: tool.function.name, path: `/${tool.function.slug}`}
  ];

  return (
    <Container>
      <Breadcrumbs items={items} />
    </Container>
  );
};

ToolBreadCrumbs.propTypes = {
  tool: PropTypes.object
};

export default ToolBreadCrumbs;
