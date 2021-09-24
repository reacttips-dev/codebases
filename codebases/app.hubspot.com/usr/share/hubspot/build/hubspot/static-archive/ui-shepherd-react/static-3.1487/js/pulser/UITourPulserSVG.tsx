import PropTypes from 'prop-types';
import styled from 'styled-components';
var UITourPulserSVG = styled.svg.attrs(function (props) {
  return {
    // This is for preventing generating duplicate style in renderings
    style: {
      zIndex: props.zIndex
    }
  };
}).withConfig({
  displayName: "UITourPulserSVG",
  componentId: "sc-1s9l6fj-0"
})(["height:0;left:0;opacity:0;overflow:hidden;pointer-events:none;position:fixed;top:0;width:100vw;&.tour-pulser--visible{height:100vh;opacity:1;transition:all 0.3s ease-out,height 0s;}.tour-pulser-overlay{opacity:0.3;pointer-events:all;}"]);
UITourPulserSVG.propTypes = {
  zIndex: PropTypes.number.isRequired
};
export default UITourPulserSVG;