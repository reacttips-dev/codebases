'use es6';

import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { jsxs as _jsxs } from "react/jsx-runtime";
import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState, memo } from 'react';
import Immutable from 'immutable';
import Skeleton from './Skeleton';
import preloadImage from 'FileManagerCore/utils/preloadImage';
import FileDimensions from 'FileManagerCore/components/FileDimensions';
var X = /*#__PURE__*/memo(function () {
  return /*#__PURE__*/_jsx("span", {
    className: "m-x-2",
    children: "x"
  });
});

var ImageDimensions = function ImageDimensions(_ref) {
  var src = _ref.src;

  var _useState = useState({
    width: 0,
    height: 0,
    loading: true
  }),
      _useState2 = _slicedToArray(_useState, 2),
      _useState2$ = _useState2[0],
      width = _useState2$.width,
      height = _useState2$.height,
      loading = _useState2$.loading,
      setImageMetaData = _useState2[1];

  useEffect(function () {
    preloadImage(src, function (metaData) {
      setImageMetaData(Object.assign({}, metaData, {
        loading: false
      }));
    }, function () {
      setImageMetaData({});
    });
  }, [src]);

  if (loading) {
    return /*#__PURE__*/_jsxs("span", {
      children: [/*#__PURE__*/_jsx(Skeleton, {
        height: "1em",
        inline: true,
        width: "4em"
      }), /*#__PURE__*/_jsx(X, {}), /*#__PURE__*/_jsx(Skeleton, {
        height: "1em",
        inline: true,
        width: "4em"
      })]
    });
  }

  return /*#__PURE__*/_jsx(FileDimensions, {
    file: Immutable.Map({
      width: width,
      height: height
    })
  }); // return (
  //   <span>
  //     <FormattedNumber value={width} />
  //     <X />
  //     <Pixels value={height} />
  //   </span>
  // );
};

export default ImageDimensions;