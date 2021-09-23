import React, { Component } from 'react';
import hexRgb from 'hex-rgb';
import PropTypes from 'prop-types';
import Pica from 'pica';
import getHslFromRgb from './modules/getHslFromRgb';
import styles from './TextImage.sass';

const pica = Pica();

// NOTE: Inspiration from: https://stackoverflow.com/questions/45706829/change-color-image-in-canvas

// About:
//   We're using canvas to render the text overlay because it's the only
//   way we can manipulate the color of the image (i.e. color of the text)
//
//   Also, because the text overlay image is much larger than our canvas,
//   canvas needs to scale it down, but unfortunately when it does this it
//   degrades the quality of the image and it appears super blurry. To address
//   this issue we resize our original text overlay image using the 'pica' package
//   to be the size of the canvas.
//
//   Even after the image was resized to fit the canvas perfectly, it would still
//   appear somewhat blurry. Another optimization we do it to set the following
//   canvas context properties
//         ctx.imageSmoothingQuality = 'high';
//         ctx.imageSmoothingEnabled = false;
//
//   Lastly, because the image still appears blurry on retina screens, we
//   adjust the size and scale of the canvas. We set the canvas width and height
//   to be double the desired width but we use css to scale it down to desired width.
//   Eg.
//     If we want a 500x500 canvas, we set the canvas width and height to 1000 but
//     set the css width and height attributes to 500
//
//
//  You'll also notice that we make the canvas invisible for 50ms. The is to prevent the visible reset
//    of changing the color. Before this change, when changing a color you'd see a flash of white text
//    each time you change the text color.

const draw = (canvas, ctx, fillColorHex, image) => {
  canvas.style.visibility = 'hidden';
  // Image quality optimizations
  ctx.imageSmoothingQuality = 'high';
  ctx.imageSmoothingEnabled = false;

  ctx.drawImage(
    image,
    0,
    0,
    image.naturalHeight,
    image.naturalHeight,
    0,
    0,
    canvas.width,
    canvas.height
  );

  // set composite mode
  ctx.globalCompositeOperation = 'source-in';

  // These are what actually changes the color of the text overlay image
  ctx.fillStyle = fillColorHex;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // We MUST make the canvas visible again. We make it invisible earlier in the code to hide it
  //  when it's swithcing colors to prevent the user from seeing the flash of white, which comes
  //  from reseting the canvas.
  setTimeout(() => {
    canvas.style.visibility = 'visible'; //
  }, 50);
};

class TextImage extends Component {
  constructor(props) {
    super(props);
    this.canvas = null;
    this.image = null;
  }

  componentDidMount() {
    this.updateCanvas();
  }

  componentDidUpdate(prevProps) {
    if (this.props.imageUrl !== prevProps.imageUrl) {
      this.updateCanvas();
    }
    if (this.props.hex !== prevProps.hex) {
      this.updateCanvas();
    }
  }

  updateCanvas = () => {
    const { imageUrl, hex, width, height } = this.props;

    // reset canvas
    if (this.image) {
      this.image.onload = null;
    }
    this.canvas.style.visibility = 'hidden';
    this.canvas.width = this.canvas.width;
    // end reset

    const ctx = this.canvas.getContext('2d');
    ctx.scale(2, 2);
    this.image = new Image();
    this.image.crossOrigin = 'Anonymous';
    this.image.src = imageUrl;
    this.image.onload = () => {
      pica
        .resize(this.image, this.canvas, {
          alpha: true,
          unsharpAmount: 100,
          unsharpRadius: 0.6,
          unsharpThreshold: 2,
        })
        .then(result => pica.toBlob(result, 'image/png', 0.9))
        .then(blob => {
          const imageUrl = URL.createObjectURL(blob);
          // reset canvas
          if (this.image) {
            this.image.onload = null;
          }
          this.canvas.width = this.canvas.width;
          // end reset
          // Resize & convert to blob
          this.image = new Image();
          this.image.crossOrigin = 'Anonymous';
          this.image.src = imageUrl;
          this.image.onload = () => {
            draw(this.canvas, ctx, hex, this.image);
          };
        });
    };
  };

  render() {
    const { imageUrl, hex, width, height } = this.props;

    return (
      <canvas
        ref={canvas => {
          this.canvas = canvas;
        }}
        width={width * 2}
        height={height * 2}
        style={{
          width,
          height,
        }}
      />
    );
  }
}

TextImage.propTypes = {
  imageUrl: PropTypes.string,
  hex: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
TextImage.defaultProps = {
  imageUrl: '',
  hex: '#ffffff',
  width: '100%',
  height: '100%',
};

export default TextImage;
