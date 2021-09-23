'use es6';

import _objectWithoutProperties from "@babel/runtime/helpers/esm/objectWithoutProperties";
import { jsx as _jsx } from "react/jsx-runtime";
import PropTypes from 'prop-types';
import classNames from 'classnames';

var Pre = function Pre(props) {
  var className = props.className,
      use = props.use,
      rest = _objectWithoutProperties(props, ["className", "use"]);

  return /*#__PURE__*/_jsx("pre", Object.assign({}, rest, {
    className: classNames(className, use === 'code' && 'private-pre--code')
  }));
};

Pre.propTypes = {
  use: PropTypes.oneOf(['default', 'code'])
};
Pre.defaultProps = {
  use: 'default'
};
Pre.displayName = 'Pre';
export default Pre;