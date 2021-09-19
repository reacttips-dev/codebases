import React, { useMemo, cloneElement } from 'react';
import PropTypes from 'prop-types';
import { deepMap } from 'react-children-utilities';
import useClientGuid from 'hooks/useClientGuid';

// Uses the passed guid to ensure all ids in the svg are unique so multiple instances of an icon do not clash/icons with the same ids
const SVGUniqueID = ({ children, id }) => {
  return deepMap(children, child => {
    const childProps = child.props;
    if (['string', 'number'].includes(typeof child)) {
        return child;
    }
    // add id to all props with a url(#...) values
    const fixedUrlProps = Object.entries(childProps)
      .filter(([key, value]) => typeof value === 'string' && value.includes('url(#')) // filter out props without urls
      .map(([key, value]) => [key, `${value.slice(0,-1)}${id})`]) // append id inside url parens
      .reduce( (obj, [key, value]) => ({ ...obj, [key] : value }), {}); // turn back to object

    return cloneElement(child, {
      id : childProps.id ? `${childProps.id}${id}` : undefined,
      xlinkHref : childProps.xlinkHref && /^#/.test(childProps.xlinkHref) ? `${childProps.xlinkHref}${id}` : childProps.xlinkHref, // only append id to links that start with # since that means it is a reference to an id
      ...fixedUrlProps
    });
  });
};

const IconBase = ({ children, color = '#fff', size = '1em', title, description, ...props }) => {
  const id = useClientGuid();
  const titleId = `icon-title-${id}`;
  const descriptionId = `icon-description-${id}`;
  return (
    <svg
      preserveAspectRatio="xMidYMid meet"
      fill={color}
      height={size}
      width={size}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descriptionId : undefined}
      {...props}>
      {title && <title id={titleId}>{title}</title>}
      {description && <desc id={descriptionId}>{description}</desc>}
        <SVGUniqueID id={id} > {children} </SVGUniqueID>
    </svg>
  );
};

IconBase.propTypes = {
  color: PropTypes.string,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  title: PropTypes.string,
  description: PropTypes.string
};

export default IconBase;
