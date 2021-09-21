import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames/bind';
import './fonts.sass';
import styles from './Font.sass';

const supportedFonts = {
  'AmaticSC-Bold': {
    fontFamily: "'Amatic SC', cursive",
    fontWeight: 700,
    fontStyle: 'normal',
  },
  'AmaticSC-Regular': {
    fontFamily: "'Amatic SC', cursive",
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  'Bangers-Regular': {
    fontFamily: "'Bangers', cursive",
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  'Barrio-Regular': {
    fontFamily: "'Barrio', cursive",
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  'Chango-Regular': {
    fontFamily: "'Chango', cursive",
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  'Courgette-Regular': {
    fontFamily: "'Courgette', cursive",
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  'Economica-Bold': {
    fontFamily: "'Economica', sans-serif",
    fontWeight: 700,
    fontStyle: 'normal',
  },
  'Economica-Regular': {
    fontFamily: "'Economica', sans-serif",
    fontWeight: 400,
    fontStyle: 'normal',
  },
  'Graduate-Regular': {
    fontFamily: "'Graduate', cursive",
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  'JollyLodger-Regular': {
    fontFamily: "'Jolly Lodger', cursive",
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  'JosefinSlab-Bold': {
    fontFamily: "'Josefin Slab', serif",
    fontWeight: 700,
    fontStyle: 'normal',
  },
  'JosefinSlab-Italic': {
    fontFamily: "'Josefin Slab', serif",
    fontWeight: 400,
    fontStyle: 'italic',
  },
  'JosefinSlab-Light': {
    fontFamily: "'Josefin Slab', serif",
    fontWeight: 300,
    fontStyle: 'normal',
  },
  'Lato-Bold': {
    fontFamily: "'Lato', sans-serif",
    fontWeight: 700,
    fontStyle: 'normal',
  },
  'Lato-Light': {
    fontFamily: "'Lato', sans-serif",
    fontWeight: 300,
    fontStyle: 'normal',
  },
  'Lato-Regular': {
    fontFamily: "'Lato', sans-serif",
    fontWeight: 400,
    fontStyle: 'normal',
  },
  'Lobster-Regular': {
    fontFamily: "'Lobster', cursive",
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  'Monoton-Regular': {
    fontFamily: "'Monoton', cursive",
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  'Montserrat-Bold': {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 700,
    fontStyle: 'normal',
  },
  'Montserrat-Light': {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 300,
    fontStyle: 'normal',
  },
  'Montserrat-Regular': {
    fontFamily: "'Montserrat', sans-serif",
    fontWeight: 400,
    fontStyle: 'normal',
  },
  'OldStandard-Bold': {
    fontFamily: "'Old Standard TT', serif",
    fontWeight: 400,
    fontStyle: 'normal',
  },
  'OldStandard-Italic': {
    fontFamily: "'Old Standard TT', serif",
    fontWeight: 400,
    fontStyle: 'italic',
  },
  'Oswald-Bold': {
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 700,
    fontStyle: 'normal',
  },
  'Oswald-Light': {
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 300,
    fontStyle: 'normal',
  },
  'Oswald-Regular': {
    fontFamily: "'Oswald', sans-serif",
    fontWeight: 400,
    fontStyle: 'normal',
  },
  // 'PTM55FT', // Can't find this
  'Quicksand-Bold': {
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: 700,
    fontStyle: 'normal',
  },
  'Quicksand-Regular': {
    fontFamily: "'Quicksand', sans-serif",
    fontWeight: 400,
    fontStyle: 'normal',
  },
  'Raleway-Bold': {
    fontFamily: "'Raleway', sans-serif",
    fontWeight: 700,
    fontStyle: 'normal',
  },
  'Raleway-Italic': {
    fontFamily: "'Raleway', sans-serif",
    fontWeight: 400,
    fontStyle: 'italic',
  },
  'Raleway-Light': {
    fontFamily: "'Raleway', sans-serif",
    fontWeight: 300,
    fontStyle: 'normal',
  },
  'SeaweedScript-Regular': {
    fontFamily: "'Seaweed Script', cursive",
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  'Shrikhand-Regular': {
    fontFamily: "'Shrikhand', cursive",
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  'SourceSansPro-Black': {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontWeight: 900,
    fontStyle: 'normal',
  },
  'SourceSansPro-Bold': {
    fontFamily: "'Source Sans Pro', sans-serif",
    fontWeight: 700,
    fontStyle: 'normal',
  },
  'StintUltraExpanded-Regular': {
    fontFamily: "'Stint Ultra Expanded', cursive",
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  'VastShadow-Regular': {
    fontFamily: "'Vast Shadow', cursive",
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  'Voltaire-Regular': {
    fontFamily: "'Voltaire', sans-serif",
    fontWeight: 'normal',
    fontStyle: 'normal',
  },
  'DMSans-Bold': {
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 700,
    fontStyle: 'normal',
  },
};

const getStylesForFont = fontName => {
  const font = supportedFonts[fontName] || supportedFonts['DMSans-Bold'];

  const { fontFamily, fontWeight, fontStyle } = font;
  return {
    fontFamily,
    fontWeight,
    fontStyle,
  };
};

const Font = ({ children, fontName }) => (
  <div
    style={{
      ...getStylesForFont(fontName),
    }}
  >
    {children}
  </div>
);

// Font.defaultProps = {
//   fontName: 'Maax-Regular',
// };

// Toggle.propTypes = {
//   isChecked: PropTypes.bool,
//   onToggle: PropTypes.func,
//   isDisabled: PropTypes.bool,
//   className: PropTypes.string,
// };

Font.propTypes = {
  fontName: PropTypes.object.isRequired,
};

export default Font;
